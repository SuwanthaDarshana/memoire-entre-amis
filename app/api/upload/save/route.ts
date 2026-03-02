import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

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

  // Use admin client to bypass RLS (auth already verified above)
  const adminSupabase = createAdminClient();

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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }

  // Bust cache so album pages show new uploads immediately
  revalidatePath(`/albums/${album_id}`);
  revalidatePath('/albums');
  revalidatePath('/dashboard');

  return NextResponse.json({ success: true, data });
}
