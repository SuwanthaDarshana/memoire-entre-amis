"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB — Cloudinary free plan image limit
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB — Cloudinary free plan video limit
const MAX_IMAGE_DIMENSION = 2400; // px — resize larger images to this
const JPEG_QUALITY = 0.85;

// Lean album type — only what the upload form needs
type AlbumOption = {
  id: string;
  title: string;
};

// Type for Cloudinary's upload response
type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  thumbnail_url: string;
  width: number;
  height: number;
  duration?: number;
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
  albums: AlbumOption[];
  onUploadComplete?: () => void;
};

/**
 * Image formats the browser can reliably decode via Canvas.
 * HEIC/HEIF (iPhone default) and other exotic formats must be
 * skipped and uploaded as-is — Cloudinary handles them server-side.
 */
const COMPRESSIBLE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/gif",
]);

/**
 * Compress an image file client-side using Canvas.
 * Resizes to fit within MAX_IMAGE_DIMENSION and re-encodes as JPEG.
 * Falls back to the original file when the browser can't decode the
 * format (e.g. HEIC from iPhones) — Cloudinary will process it instead.
 */
async function compressImage(file: File): Promise<File> {
  // Skip non-image files
  if (!file.type.startsWith("image/")) return file;
  // If already under limit, skip compression
  if (file.size <= MAX_IMAGE_SIZE) return file;
  // Skip formats the browser can't decode (HEIC, TIFF, RAW, etc.)
  if (!COMPRESSIBLE_TYPES.has(file.type)) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if larger than max dimension
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const ratio = Math.min(
          MAX_IMAGE_DIMENSION / width,
          MAX_IMAGE_DIMENSION / height
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Canvas unsupported — upload original
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Compression failed — upload original
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Browser can't decode this format — upload as-is and let Cloudinary handle it
      console.warn(`Browser cannot decode ${file.type} — skipping client compression`);
      resolve(file);
    };

    img.src = url;
  });
}

export default function UploadForm({
  albums,
  onUploadComplete,
}: UploadFormProps) {
  const router = useRouter();
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);

    // Validate video sizes upfront (videos can't be compressed client-side)
    const oversizedVideos = selected.filter(
      (f) => f.type.startsWith("video/") && f.size > MAX_VIDEO_SIZE
    );
    if (oversizedVideos.length > 0) {
      const names = oversizedVideos
        .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`)
        .join(", ");
      toast.error(
        `Videos must be under 100MB. Please trim or compress before uploading: ${names}`
      );
      // Filter out oversized videos, keep everything else
      const valid = selected.filter(
        (f) => !(f.type.startsWith("video/") && f.size > MAX_VIDEO_SIZE)
      );
      setFiles(valid);
      setProgress(valid.map(() => 0));
      return;
    }

    setFiles(selected);
    setProgress(selected.map(() => 0));
  }

  async function uploadFileToCloudinary(file: File, index: number) {
    const isVideo = file.type.startsWith("video/");
    const media_type = isVideo ? "video" : "photo";

    // Compress large images client-side before upload
    const processedFile = isVideo ? file : await compressImage(file);

    // Final size check
    const sizeLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const limitLabel = isVideo ? '100MB' : '10MB';
    if (processedFile.size > sizeLimit) {
      throw new Error(
        `${file.name} is ${(processedFile.size / 1024 / 1024).toFixed(1)}MB — max is ${limitLabel}. Try a smaller file.`
      );
    }

    const folder = `memoire/${isVideo ? "videos" : "photos"}/${selectedAlbum}`;

    // Step 1: Get signature from our server
    const signResponse = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder, media_type }),
    });

    if (!signResponse.ok) {
      const err = await signResponse.json().catch(() => ({}));
      throw new Error(err.error || `Sign failed (${signResponse.status})`);
    }

    const { data: signData }: { data: SignData } = await signResponse.json();

    if (!signData?.api_key || !signData?.signature) {
      throw new Error("Invalid sign response from server");
    }

    // Step 2: Upload directly to Cloudinary
    const formData = new FormData();
    formData.append("file", processedFile);
    formData.append("api_key", signData.api_key);
    formData.append("timestamp", String(signData.timestamp));
    formData.append("signature", signData.signature);
    formData.append("upload_preset", signData.upload_preset);
    formData.append("folder", folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${isVideo ? "video" : "image"}/upload`,
      { method: "POST", body: formData },
    );

    if (!uploadResponse.ok) {
      const err = await uploadResponse.json().catch(() => ({}));
      throw new Error(err.error?.message || `Cloudinary upload failed (${uploadResponse.status})`);
    }

    const uploadData: CloudinaryUploadResponse = await uploadResponse.json();

    if (!uploadData.secure_url) {
      throw new Error("Cloudinary did not return a URL");
    }

    // Step 3: Save metadata to Supabase
    const saveResponse = await fetch("/api/upload/save", {
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

    if (!saveResponse.ok) {
      const err = await saveResponse.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save media record (${saveResponse.status})`);
    }

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
        fileInputRef.current.value = "";
      }
      router.refresh();
      onUploadComplete?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
      console.error("Upload error:", err);
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
          className="border-2 border-dashed border-zinc-200 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-indigo-100 transition-colors mb-3">
            <svg className="w-6 h-6 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-zinc-600 text-sm font-medium">
            Click to select files
          </p>
          <p className="text-zinc-300 text-xs mt-1">
            JPG, PNG, WebP, MP4, MOV, WebM — Photos auto-compressed, videos must be under 10MB
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
                className="flex items-center justify-between text-sm bg-zinc-50 rounded-xl px-4 py-2.5 border border-zinc-100"
              >
                <span className="truncate text-zinc-700 font-medium">{file.name}</span>
                <div className="flex items-center gap-2.5 ml-4 shrink-0">
                  <span className="text-zinc-300 text-xs">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                  {progress[i] === 100 && (
                    <span className="text-green-500 text-sm">✓</span>
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
