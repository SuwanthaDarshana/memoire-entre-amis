"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setFullName(profile?.full_name ?? "");
      }
      setProfileLoading(false);
    }
    loadProfile();
  }, [supabase]);

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message || "Failed to update password");
    } else {
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirm("");
    }
    setLoading(false);
  }

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    if (error) {
      toast.error(error.message || "Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card">
          <h2 className="section-title mb-1">Profile Information</h2>
          <p className="text-xs text-zinc-400 mb-5">Update your display name and view your account email.</p>
          {profileLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
              <div className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  className="input-field bg-zinc-50 text-zinc-400 cursor-not-allowed"
                  disabled
                />
                <p className="text-[11px] text-zinc-400 mt-1">Email cannot be changed.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="section-title mb-1">Change Password</h2>
          <p className="text-xs text-zinc-400 mb-5">Update your password. Use at least 6 characters.</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Repeat your new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card lg:col-span-2">
          <h2 className="section-title mb-1">Account</h2>
          <p className="text-xs text-zinc-400 mb-5">Information about your session and account status.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-50 rounded-xl p-4">
              <p className="text-xs text-zinc-400 font-medium mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-zinc-800">Active</span>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-xl p-4">
              <p className="text-xs text-zinc-400 font-medium mb-1">Platform</p>
              <p className="text-sm font-semibold text-zinc-800">Mémoire entre Amis</p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-4">
              <p className="text-xs text-zinc-400 font-medium mb-1">Security</p>
              <p className="text-sm font-semibold text-zinc-800">Password Auth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
