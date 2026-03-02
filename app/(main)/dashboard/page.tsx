import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import AlbumCard from "@/components/albums/AlbumCard";
import Link from "next/link";
import type { Album } from "@/app/(main)/albums/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your recent memories and quick stats.',
};

export default async function DashboardPage() {
  await requireAuth();
  const supabase = await createClient();
  const profile = await getProfile();

  const { data: recentAlbums } = await supabase
    .from("albums")
    .select("*, media(count), preview:media(id, cloudinary_url, thumbnail_url, media_type)")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count: totalMedia } = await supabase
    .from("media")
    .select("*", { count: "exact", head: true });

  const { count: totalAlbums } = await supabase
    .from("albums")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="page-title">
          Welcome back, {profile?.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Here are your latest university memories
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold gradient-text">
            {totalAlbums ?? 0}
          </p>
          <p className="text-xs font-medium text-zinc-400 mt-1.5 uppercase tracking-wider">Albums</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold gradient-text">
            {totalMedia ?? 0}
          </p>
          <p className="text-xs font-medium text-zinc-400 mt-1.5 uppercase tracking-wider">Memories</p>
        </div>
        <div className="stat-card text-center hidden sm:block">
          <p className="text-3xl font-extrabold gradient-text">
            ∞
          </p>
          <p className="text-xs font-medium text-zinc-400 mt-1.5 uppercase tracking-wider">Good Times</p>
        </div>
      </div>

      {/* Recent Albums */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Recent Albums</h2>
          <Link
            href="/albums"
            className="text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
          >
            View all
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recentAlbums as unknown as Album[])?.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
        {recentAlbums?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📸</p>
            <p className="text-zinc-400 text-sm">No albums yet. Time to create some memories!</p>
          </div>
        )}
      </div>
    </div>
  );
}
