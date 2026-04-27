"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Mail, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { createSupabaseClient } from "@/lib/supabase/client";

type AccountSettingsFormProps = {
  avatarUrl: string | null;
  email: string;
  fullName: string;
  role: string;
  userId: string;
};

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function AccountSettingsForm({
  avatarUrl,
  email,
  fullName,
  role,
  userId
}: AccountSettingsFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!successOpen) {
      return;
    }

    const refreshTimer = window.setTimeout(() => {
      window.location.reload();
    }, 1200);

    return () => window.clearTimeout(refreshTimer);
  }, [successOpen]);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setErrorMessage(null);

    const supabase = createSupabaseClient();
    const nextFullName = String(formData.get("full_name") || "").trim();
    const avatarFile = formData.get("avatar") as File | null;
    let nextAvatarUrl = previewUrl;

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check .env.local.");
      setIsSaving(false);
      return;
    }

    if (avatarFile && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file.");
        setIsSaving(false);
        return;
      }

      if (avatarFile.size > 5 * 1024 * 1024) {
        setErrorMessage("Profile picture must be 5MB or smaller.");
        setIsSaving(false);
        return;
      }

      const extension = avatarFile.name.split(".").pop() || "png";
      const filePath = `${userId}/avatar-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) {
        setErrorMessage(
          uploadError.message === "Bucket not found"
            ? "Profile avatar storage is not set up yet. Create the profile-avatars bucket in Supabase, then try again."
            : uploadError.message
        );
        setIsSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-avatars")
        .getPublicUrl(filePath);

      nextAvatarUrl = publicUrlData.publicUrl;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        avatar_url: nextAvatarUrl,
        full_name: nextFullName || null
      })
      .eq("id", userId);

    if (profileError) {
      setErrorMessage(profileError.message);
      setIsSaving(false);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        avatar_url: nextAvatarUrl,
        full_name: nextFullName
      }
    });

    if (authError) {
      setErrorMessage(authError.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setPreviewUrl(nextAvatarUrl);
    setSuccessOpen(true);
  }

  return (
    <>
      <form
        action={handleSubmit}
        className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile picture"
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </span>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-slate-900">
              Profile Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Update the name shown across your admin dashboard.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 ring-4 ring-white">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile picture preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <User className="h-7 w-7" />
              )}
            </span>
            <div className="flex-1">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Profile Picture
                </span>
                <span className="mt-2 flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600">
                  <ImagePlus className="h-4 w-4 text-indigo-600" />
                  <input
                    name="avatar"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </span>
              </label>
              <p className="mt-2 text-xs text-slate-500">
                PNG, JPG, or WebP up to 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <span className="relative mt-2 block">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="full_name"
                defaultValue={fullName}
                placeholder="Admin User"
                className="bg-white pl-10"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email Address</span>
            <span className="relative mt-2 block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={email} readOnly className="bg-slate-50 pl-10 text-slate-500" />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <span className="relative mt-2 block">
              <Shield className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={formatRole(role)}
                readOnly
                className="bg-slate-50 pl-10 text-slate-500"
              />
            </span>
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Account Settings"}
          </Button>
        </div>
      </form>

      <SuccessDialog
        open={successOpen}
        title="Account Updated"
        message="Your account settings were saved successfully."
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
