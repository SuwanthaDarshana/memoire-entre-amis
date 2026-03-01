"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import type { Album } from "@/app/(main)/albums/page";

// Type for Cloudinary's upload response
type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  thumbnail_url: string;
  width: number;
  height: number;
  duration?: number; // ← optional, only exists for videos
  bytes: number;
};

// Type for sign API response
type SignData = {
  signature: string;
  timestamp: number;
  upload_preset: string;
  cloud_name: string;
  api_key: string;
};

// Props type
type UploadFormProps = {
  albums: Album[];
  onUploadComplete?: () => void;
};

export default function UploadForm({
  albums,
  onUploadComplete,
}: UploadFormProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []); // ← ?? [] fallback if null
    setFiles(selected);
    setProgress(selected.map(() => 0));
  }

  async function uploadFileToCloudinary(file: File, index: number) {
    const isVideo = file.type.startsWith("video/");
    const media_type = isVideo ? "video" : "photo";
    const folder = `memoire/${isVideo ? "videos" : "photos"}/${selectedAlbum}`;

    // Step 1: Get signature from our server
    const signResponse = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder, media_type }),
    });
    const { data: signData }: { data: SignData } = await signResponse.json();

    // Step 2: Upload directly to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.api_key);
    formData.append("timestamp", String(signData.timestamp)); // ← convert to string
    formData.append("signature", signData.signature);
    formData.append("upload_preset", signData.upload_preset);
    formData.append("folder", folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${isVideo ? "video" : "image"}/upload`,
      { method: "POST", body: formData },
    );
    const uploadData: CloudinaryUploadResponse = await uploadResponse.json();

    // Step 3: Save metadata to Supabase
    await fetch("/api/upload/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        album_id: selectedAlbum,
        cloudinary_url: uploadData.secure_url,
        cloudinary_public_id: uploadData.public_id,
        thumbnail_url: isVideo
          ? uploadData.thumbnail_url
          : uploadData.secure_url,
        media_type,
        caption,
        width: uploadData.width,
        height: uploadData.height,
        duration_seconds: uploadData.duration
          ? Math.round(uploadData.duration)
          : null,
        file_size_bytes: uploadData.bytes,
      }),
    });

    // Update progress
    setProgress((prev) => {
      const updated = [...prev];
      updated[index] = 100;
      return updated;
    });
  }

  async function handleUpload() {
    if (!selectedAlbum) return toast.error("Please select an album");
    if (files.length === 0) return toast.error("Please select files to upload");

    setUploading(true);

    try {
      await Promise.all(
        files.map((file, i) => uploadFileToCloudinary(file, i)),
      );
      toast.success(
        `${files.length} file${files.length > 1 ? "s" : ""} uploaded!`,
      );
      setFiles([]);
      setCaption("");
      setProgress([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ← null check before accessing
      }
      onUploadComplete?.();
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      console.error(err);
    }

    setUploading(false);
  }

  return (
    <div className="card space-y-5">
      <h2 className="section-title">Upload Media</h2>

      {/* Album selector */}
      <div>
        <label className="label">Select Album</label>
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="input-field"
        >
          <option value="">Choose an album...</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {/* File input */}
      <div>
        <label className="label">Photos & Videos</label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-4xl mb-2">📁</p>
          <p className="text-gray-500 text-sm">
            Click to select files, or drag and drop
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Photos: JPG, PNG, WebP • Videos: MP4, MOV, WebM
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="truncate text-gray-700">{file.name}</span>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                  {progress[i] === 100 && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      <div>
        <label className="label">Caption (optional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="input-field"
          placeholder="Add a caption for these memories..."
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0 || !selectedAlbum}
        className="btn-primary w-full"
      >
        {uploading
          ? `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`
          : "Upload"}
      </button>
    </div>
  );
}
