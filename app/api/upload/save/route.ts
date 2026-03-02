import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { validateOrigin } from "@/lib/security";

// Type for the request body
type SaveMediaBody = {
  album_id: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  thumbnail_url: string | null;
  media_type: "photo" | "video";
  caption: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
};

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = validateOrigin(request);
  if (csrfError) return csrfError;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Parse and type the request body
  const {
    album_id,
    cloudinary_url,
    cloudinary_public_id,
    thumbnail_url,
    media_type,
    caption,
    width,
    height,
    duration_seconds,
    file_size_bytes,
  }: SaveMediaBody = await request.json();

  // ── Input validation ──
  const CLOUDINARY_URL_REGEX = /^https:\/\/res\.cloudinary\.com\/.+/;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!album_id || !UUID_REGEX.test(album_id)) {
    return NextResponse.json(
      { success: false, error: "Invalid album ID" },
      { status: 400 },
    );
  }

  if (!cloudinary_url || !CLOUDINARY_URL_REGEX.test(cloudinary_url)) {
    return NextResponse.json(
      { success: false, error: "Invalid cloudinary URL" },
      { status: 400 },
    );
  }

  if (thumbnail_url && !CLOUDINARY_URL_REGEX.test(thumbnail_url)) {
    return NextResponse.json(
      { success: false, error: "Invalid thumbnail URL" },
      { status: 400 },
    );
  }

  if (!cloudinary_public_id || typeof cloudinary_public_id !== "string" || cloudinary_public_id.length > 500) {
    return NextResponse.json(
      { success: false, error: "Invalid cloudinary public ID" },
      { status: 400 },
    );
  }

  if (media_type !== "photo" && media_type !== "video") {
    return NextResponse.json(
      { success: false, error: "Invalid media type" },
      { status: 400 },
    );
  }

  if (caption && (typeof caption !== "string" || caption.length > 500)) {
    return NextResponse.json(
      { success: false, error: "Caption must be under 500 characters" },
      { status: 400 },
    );
  }

  // Use admin client to bypass RLS (auth already verified above)
  const adminSupabase = createAdminClient();

  // Verify the album exists before inserting
  const { data: album, error: albumError } = await adminSupabase
    .from("albums")
    .select("id")
    .eq("id", album_id)
    .single();

  if (albumError || !album) {
    return NextResponse.json(
      { success: false, error: "Album not found" },
      { status: 404 },
    );
  }

  const { data, error } = await adminSupabase
    .from("media")
    .insert({
      album_id,
      uploader_id: user.id,
      cloudinary_url,
      cloudinary_public_id,
      thumbnail_url,
      media_type,
      caption,
      width,
      height,
      duration_seconds,
      file_size_bytes,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save media:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to save media. Please try again." },
      { status: 400 },
    );
  }

  // Bust cache so album pages show new uploads immediately
  revalidatePath(`/albums/${album_id}`);
  revalidatePath('/albums');
  revalidatePath('/dashboard');

  return NextResponse.json({ success: true, data });
}
