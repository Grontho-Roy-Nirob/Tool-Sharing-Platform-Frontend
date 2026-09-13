"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import OwnerProtected from "../../../../components/authForm/OwnerProtected";
import api from "../../../../lib/axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

// ================= OWNER =================

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  nidNumber?: string;
  profile_image?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// ================= JWT =================

interface OwnerToken {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
}

// ================= PROFILE FORM =================

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  nidNumber: string;
  password: string;
  profile_image: File | null;
}

export default function OwnerProfilePage() {
  const [owner, setOwner] = useState<Owner | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    nidNumber: "",
    password: "",
    profile_image: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // GET OWNER PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        // Decode JWT
        const decoded = jwtDecode<OwnerToken>(token);

        const email = decoded.email;

        if (!email) {
          toast.error("Owner email not found. Please login again.");
          return;
        }

        // Get all owners
        const response = await api.get<Owner[]>("/owner/listall");

        // Find logged-in owner
        const ownerData = response.data.find((item) => item.email === email);

        if (!ownerData) {
          toast.error("Owner information not found.");
          return;
        }

        // Save owner data
        setOwner(ownerData);

        // Fill form
        setForm({
          name: ownerData.name ?? "",
          email: ownerData.email ?? "",
          phone: ownerData.phone ?? "",
          nidNumber: ownerData.nidNumber ?? "",
          password: "",
          profile_image: null,
        });
      } catch (error) {
        console.error("Failed to load owner profile:", error);

        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // HANDLE IMAGE CHANGE
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    // Check file size
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be less than 2MB");

      event.target.value = "";

      return;
    }

    setForm((previous) => ({
      ...previous,
      profile_image: file,
    }));
  };

  // ==========================================
  // SUBMIT FORM
  // OPEN CONFIRMATION
  // ==========================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!owner?.id) {
      toast.error("Owner information not found");
      return;
    }

    setShowConfirm(true);
  };

  // ==========================================
  // CONFIRM UPDATE
  // PATCH /owner/update/:id
  // ==========================================

  const handleConfirmUpdate = async () => {
    if (!owner?.id) {
      toast.error("Owner information not found");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);

      if (form.phone.trim()) {
        formData.append("phone", form.phone);
      }

      if (form.nidNumber.trim()) {
        formData.append("nidNumber", form.nidNumber);
      }

      if (form.password.trim()) {
        formData.append("password", form.password);
      }

      if (form.profile_image) {
        formData.append("myfile", form.profile_image);
      }

      const response = await api.patch(`/owner/update/${owner.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data) {
        toast.error("Profile updated but couldn't reload data");

        setShowConfirm(false);

        return;
      }

      setOwner(response.data);

      setForm({
        name: response.data.name ?? "",
        email: response.data.email ?? "",
        phone: response.data.phone ?? "",
        nidNumber: response.data.nidNumber ?? "",
        password: "",
        profile_image: null,
      });

      setShowConfirm(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      if (axios.isAxiosError(error)) {
        console.log("STATUS:", error.response?.status);

        console.log("BACKEND ERROR:", error.response?.data);

        const backendMessage = (
          error.response?.data as {
            message?: string | string[];
          }
        )?.message;

        const errorText = Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage;

        toast.error(errorText || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#08090b] text-white">
        {/*  SIDEBAR */}

        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] border-r border-[#25272c] bg-[#0b0c0e] lg:block">
          {/* LOGO */}

          <div className="flex h-[88px] items-center border-b border-[#25272c] px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
                T
              </div>

              <span className="text-xl font-bold">ToolShare</span>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="px-4 py-6">
            {/* DASHBOARD */}

            <a
              href="/owner/dashboard"
              className="mb-2 flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm text-[#9ca3af] transition hover:bg-[#15171a] hover:text-white"
            >
              <span className="text-lg">▦</span>

              <span>Dashboard</span>
            </a>

            {/* MY TOOLS */}

            <a
              href="/owner/mytools"
              className="mb-2 flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm text-[#9ca3af] transition hover:bg-[#15171a] hover:text-white"
            >
              <span className="text-lg">▣</span>

              <span>My Tools</span>
            </a>

            {/* ADD TOOL */}

            {/* PROFILE */}

            <a
              href="/owner/profile"
              className="mb-2 flex items-center gap-4 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black"
            >
              <span className="text-lg">♙</span>

              <span>Profile</span>
            </a>
          </nav>
        </aside>

        {/*  MAIN AREA */}

        <div className="lg:ml-[280px]">
          {/* TOP HEADER */}

          <header className="sticky top-0 z-40 flex h-[88px] items-center justify-between border-b border-[#25272c] bg-[#08090b]/95 px-6 backdrop-blur sm:px-8">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Profile</h1>

              <p className="mt-1 text-sm text-[#737780]">
                Manage your ToolShare account
              </p>
            </div>

            <div className="flex items-center gap-5">
              {/* NOTIFICATION */}

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#25272c] bg-[#0d0f11] text-lg text-[#a1a5ad] transition hover:bg-[#15171a]"
              >
                ♧
              </button>

              {/* OWNER */}

              <a href="/owner/profile" className="flex items-center gap-3">
                {owner?.profile_image ? (
                  <img
                    src={owner.profile_image}
                    alt={owner.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#202226] text-sm font-semibold">
                    {owner?.name?.charAt(0).toUpperCase() || "O"}
                  </div>
                )}

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">
                    {owner?.name || "Owner"}
                  </p>

                  <p className="mt-0.5 text-xs text-[#737780]">
                    {owner?.email || ""}
                  </p>
                </div>
              </a>
            </div>
          </header>

          {/*  PAGE CONTENT */}

          <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
            {/* PAGE HEADER */}

            <div className="mb-8">
              <h2 className="text-3xl font-bold sm:text-4xl">Profile</h2>

              <p className="mt-3 text-sm text-[#8c919b] sm:text-base">
                Manage your personal information and account details.
              </p>
            </div>

            {/*  LOADING */}

            {loading ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10]">
                <Loader2 className="h-6 w-6 animate-spin text-[#9ca3af]" />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* PROFILE CARD */}

                <section className="h-fit rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* PROFILE IMAGE */}

                    {owner?.profile_image ? (
                      <img
                        src={owner.profile_image}
                        alt={owner.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
                        {owner?.name ? (
                          owner.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    {/* NAME */}

                    <h2 className="mt-4 text-lg font-semibold">
                      {owner?.name || "Owner"}
                    </h2>

                    {/* EMAIL */}

                    <p className="mt-1 break-all text-sm text-[#71717a]">
                      {owner?.email}
                    </p>

                    {/* ACCOUNT INFORMATION */}

                    <div className="mt-5 w-full border-t border-[#292b30] pt-5">
                      {/* OWNER ID */}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#71717a]">Owner ID</span>

                        <span className="font-medium text-[#d4d4d8]">
                          #{owner?.id}
                        </span>
                      </div>

                      {/* PHONE */}

                      <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                        <span className="text-[#71717a]">Phone</span>

                        <span className="text-right text-[#d4d4d8]">
                          {owner?.phone || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* PROFILE FORM */}

                <section className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[#71717a]">
                      Update your owner account information below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        maxLength={150}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        maxLength={255}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />
                    </div>

                    {/* PHONE */}

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />

                      <p className="mt-2 text-xs text-[#52525b]">
                        Use a valid Bangladesh phone number.
                      </p>
                    </div>

                    {/* NID */}

                    <div>
                      <label
                        htmlFor="nidNumber"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        NID Number
                      </label>

                      <input
                        id="nidNumber"
                        name="nidNumber"
                        type="text"
                        value={form.nidNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        placeholder="Enter your NID number"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />
                    </div>

                    {/* PASSWORD */}

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="Enter new password only if you want to change it"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />

                      <p className="mt-2 text-xs text-[#52525b]">
                        Leave this empty to keep your existing password.
                      </p>
                    </div>

                    {/* PROFILE IMAGE */}

                    <div>
                      <label
                        htmlFor="profile_image"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Profile Image
                      </label>

                      <input
                        id="profile_image"
                        name="profile_image"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleImageChange}
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] text-sm text-[#d4d4d8] file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                      />

                      <p className="mt-2 text-xs text-[#52525b]">
                        JPG, JPEG, PNG or WEBP. Maximum 2MB.
                      </p>
                    </div>

                    {/* SAVE BUTTON */}

                    <div className="flex justify-end border-t border-[#292b30] pt-5">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e4e4e7] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}

                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            )}

            {/* CONFIRMATION DIALOG */}

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Changes</AlertDialogTitle>

                  <AlertDialogDescription>
                    Are you sure you want to save these changes to your profile?
                    Please make sure all the information is correct before
                    continuing.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={saving}>
                    No, Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleConfirmUpdate}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Yes, Save Changes"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
