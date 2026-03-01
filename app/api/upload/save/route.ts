import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient(); // ← await added
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
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

  const { data, error } = await supabase
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

  return NextResponse.json({ success: true, data });
}
