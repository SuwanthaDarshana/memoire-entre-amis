"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const supabase = createClient();
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences
        </p>
      </div>
      <div className="card">
        <h2 className="section-title mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirm(e.target.value)
              }
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
    </div>
  );
}
