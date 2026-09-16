"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  Camera,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import OwnerProtected from "@/components/authForm/OwnerProtected";
import OwnerSidebar from "@/components/dashboard/owner/OwnerSidebar";
import OwnerHeader from "@/components/dashboard/owner/OwnerHeader";
import api from "@/lib/axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

// ================= COMPONENT =================

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // =====================================================
  // FETCH OWNER PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        const decoded = jwtDecode<OwnerToken>(token);
        const email = decoded.email;

        if (!email) {
          toast.error("Owner email not found. Please login again.");
          return;
        }

        const response = await api.get<Owner[]>("/owner/listall");

        const ownerData = response.data.find(
          (item) =>
            item.email?.trim().toLowerCase() === email.trim().toLowerCase(),
        );

        if (!ownerData) {
          toast.error("Owner information not found.");
          return;
        }

        setOwner(ownerData);

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

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    // File size

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be less than 2MB");
      event.target.value = "";
      return;
    }

    // File type

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG or WEBP images are allowed");
      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      profile_image: file,
    }));

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((oldUrl) => {
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      return previewUrl;
    });
  };

  // =====================================================
  // CLEAN IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!owner?.id) {
      toast.error("Owner information not found");
      return;
    }

    setShowConfirm(true);
  };

  // =====================================================
  // CONFIRM UPDATE
  // =====================================================

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

      setImagePreview(null);

      setShowConfirm(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      if (axios.isAxiosError(error)) {
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

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <OwnerProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <OwnerSidebar />

        {/* ================================================= */}
        {/* MAIN AREA */}
        {/* ================================================= */}

        <div className="lg:ml-[280px]">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <OwnerHeader owner={owner} />

          {/* ================================================= */}
          {/* PAGE CONTENT */}
          {/* ================================================= */}

          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-[1350px]">
              {/* ================================================= */}
              {/* PROFILE HERO */}
              {/* ================================================= */}

              <section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#292722] shadow-[0_18px_45px_rgba(41,39,34,0.13)]">
                {/* Decorative Shapes */}

                <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#c1502e]/20" />

                <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-[#e4a15b]/10" />

                <div className="pointer-events-none absolute left-[52%] top-8 h-24 w-24 rounded-full bg-white/[0.03]" />

                <div className="pointer-events-none absolute bottom-6 left-[58%] hidden h-14 w-14 rounded-full border border-white/[0.06] sm:block" />

                {/* Hero Content */}

                <div className="relative px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                  {/* Small Label */}

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 backdrop-blur-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c1502e]">
                      <User className="h-3 w-3 text-white" />
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                      Owner Profile
                    </span>
                  </div>

                  {/* Heading */}

                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
                    Your Profile
                  </h1>

                  {/* Description */}

                  <p className="mt-2 max-w-2xl text-sm leading-5 text-white/55 sm:text-[14px]">
                    Manage your personal information, account details and
                    profile image from one place.
                  </p>

                  {/* Bottom Info */}

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    {/* Account Active */}

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6fa875]" />

                      <span className="text-[11px] font-medium text-white/65">
                        Account Active
                      </span>
                    </div>

                    {/* Profile Settings */}

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e4a15b]" />

                      <span className="text-[11px] font-medium text-white/65">
                        Profile Settings
                      </span>
                    </div>

                    {/* Owner Account */}

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c1502e]" />

                      <span className="text-[11px] font-medium text-white/65">
                        Owner Account
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================================================= */}
              {/* LOADING */}
              {/* ================================================= */}

              {loading ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-white shadow-[0_12px_35px_rgba(76,57,30,0.07)]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0d5] shadow-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-[#c1502e]" />
                    </div>

                    <p className="text-sm font-medium text-[#77736d]">
                      Loading profile...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid items-start gap-5 lg:grid-cols-[290px_1fr]">
                  {/* ================================================= */}
                  {/* LEFT PROFILE CARD */}
                  {/* ================================================= */}

                  <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-[#fffdf9] to-[#f5ecdf] p-5 shadow-[0_12px_35px_rgba(76,57,30,0.07)]">
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Photo */}

                      <div className="relative">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Selected profile"
                            className="h-28 w-28 rounded-[28px] object-cover shadow-[0_10px_25px_rgba(76,57,30,0.12)]"
                          />
                        ) : owner?.profile_image ? (
                          <img
                            src={owner.profile_image}
                            alt={owner.name}
                            className="h-28 w-28 rounded-[28px] object-cover shadow-[0_10px_25px_rgba(76,57,30,0.12)]"
                          />
                        ) : (
                          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#e8a33d] to-[#c1502e] text-4xl font-bold text-white shadow-[0_10px_25px_rgba(193,80,46,0.18)]">
                            {owner?.name
                              ? owner.name.charAt(0).toUpperCase()
                              : "O"}
                          </div>
                        )}

                        <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_5px_15px_rgba(76,57,30,0.14)]">
                          <Camera className="h-4 w-4 text-[#c1502e]" />
                        </div>
                      </div>

                      <h2 className="mt-5 text-lg font-bold text-[#292722]">
                        {owner?.name || "Owner"}
                      </h2>

                      <p className="mt-1 max-w-full break-all text-xs text-[#77736d]">
                        {owner?.email}
                      </p>
                    </div>

                    {/* Owner Details */}

                    <div className="mt-6 space-y-2.5">
                      {/* Owner ID */}

                      <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0d9]">
                          <ShieldCheck className="h-4 w-4 text-[#c1502e]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Owner ID
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-[#292722]">
                            #{owner?.id}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}

                      <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9eadb]">
                          <Phone className="h-4 w-4 text-[#c1502e]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Phone
                          </p>

                          <p className="mt-0.5 truncate text-xs font-semibold text-[#292722]">
                            {owner?.phone || "Not added"}
                          </p>
                        </div>
                      </div>

                      {/* Role */}

                      <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0d9]">
                          <CheckCircle2 className="h-4 w-4 text-[#c1502e]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Account Role
                          </p>

                          <p className="mt-0.5 text-xs font-semibold capitalize text-[#292722]">
                            {owner?.role || "Owner"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ================================================= */}
                  {/* RIGHT FORM */}
                  {/* ================================================= */}

                  <section className="rounded-[28px] bg-gradient-to-br from-white via-[#fffdf9] to-[#f6efe6] p-5 shadow-[0_12px_35px_rgba(76,57,30,0.07)] sm:p-6">
                    {/* Form Header */}

                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff0d5] to-[#f8dfb5]">
                        <User className="h-5 w-5 text-[#c1502e]" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-[#292722]">
                          Personal Information
                        </h2>

                        <p className="mt-0.5 text-xs text-[#999188]">
                          Update your account information.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* ================================================= */}
                      {/* NAME + EMAIL */}
                      {/* ================================================= */}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name */}

                        <div>
                          <label
                            htmlFor="name"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                          >
                            Full Name
                          </label>

                          <div className="relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={form.name}
                              onChange={handleChange}
                              required
                              maxLength={150}
                              placeholder="Enter your full name"
                              className="w-full rounded-2xl bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,163,61,0.14)]"
                            />
                          </div>
                        </div>

                        {/* Email */}

                        <div>
                          <label
                            htmlFor="email"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                          >
                            Email
                          </label>

                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              maxLength={255}
                              placeholder="Enter your email"
                              className="w-full rounded-2xl bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,163,61,0.14)]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* PHONE + NID */}
                      {/* ================================================= */}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Phone */}

                        <div>
                          <label
                            htmlFor="phone"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                          >
                            Phone Number
                          </label>

                          <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="+8801XXXXXXXXX"
                              className="w-full rounded-2xl bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,163,61,0.14)]"
                            />
                          </div>
                        </div>

                        {/* NID */}

                        <div>
                          <label
                            htmlFor="nidNumber"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                          >
                            NID Number
                          </label>

                          <div className="relative">
                            <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                            <input
                              id="nidNumber"
                              name="nidNumber"
                              type="text"
                              value={form.nidNumber}
                              onChange={handleChange}
                              inputMode="numeric"
                              placeholder="Enter your NID number"
                              className="w-full rounded-2xl bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,163,61,0.14)]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* PASSWORD */}
                      {/* ================================================= */}

                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                        >
                          New Password
                        </label>

                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            placeholder="Enter a new password"
                            className="w-full rounded-2xl bg-[#faf7f1] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,163,61,0.14)]"
                          />
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#999188]">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#c1502e]" />
                          Leave empty to keep your current password.
                        </p>
                      </div>

                      {/* ================================================= */}
                      {/* PROFILE IMAGE */}
                      {/* ================================================= */}

                      <div>
                        <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]">
                          Profile Image
                        </label>

                        <div className="rounded-[22px] bg-white p-4 shadow-[0_8px_25px_rgba(76,57,30,0.06)]">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* IMAGE PREVIEW */}

                            <div className="relative flex shrink-0 justify-center sm:justify-start">
                              <div className="h-[92px] w-[92px] overflow-hidden rounded-[20px] bg-[#f7f3ec] shadow-[0_5px_15px_rgba(76,57,30,0.08)]">
                                {imagePreview ? (
                                  <img
                                    src={imagePreview}
                                    alt="Selected profile"
                                    className="h-full w-full object-cover"
                                  />
                                ) : owner?.profile_image ? (
                                  <img
                                    src={owner.profile_image}
                                    alt={owner.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8a33d] to-[#c1502e] text-3xl font-bold text-white">
                                    {owner?.name
                                      ? owner.name.charAt(0).toUpperCase()
                                      : "O"}
                                  </div>
                                )}
                              </div>

                              {/* Camera Icon */}

                              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(76,57,30,0.15)]">
                                <Camera className="h-3.5 w-3.5 text-[#c1502e]" />
                              </div>
                            </div>

                            {/* UPLOAD AREA */}

                            <label
                              htmlFor="profile_image"
                              className="group flex min-h-[92px] flex-1 cursor-pointer items-center justify-center rounded-[18px] border-2 border-dashed border-[#e8dfd2] bg-[#fcfaf6] px-5 py-4 transition-all duration-200 hover:border-[#e8a33d] hover:bg-[#fff8ed]"
                            >
                              <div className="flex items-center gap-4">
                                {/* Upload Icon */}

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0d9] transition group-hover:scale-105">
                                  <Camera className="h-5 w-5 text-[#c1502e]" />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-[#292722]">
                                    Choose a profile image
                                  </p>

                                  <p className="mt-1 text-[11px] text-[#999188]">
                                    Click here to upload a new photo
                                  </p>

                                  <p className="mt-1.5 text-[10px] font-medium text-[#aaa39a]">
                                    JPG · JPEG · PNG · WEBP · Max 2MB
                                  </p>
                                </div>
                              </div>

                              <input
                                id="profile_image"
                                name="profile_image"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* SELECTED FILE */}

                          {form.profile_image && (
                            <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-[#fff8ed] px-3.5 py-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9e1bd]">
                                <CheckCircle2 className="h-4 w-4 text-[#c1502e]" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#aaa39a]">
                                  New image selected
                                </p>

                                <p className="mt-0.5 truncate text-[11px] font-semibold text-[#292722]">
                                  {form.profile_image.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* SAVE BUTTON */}
                      {/* ================================================= */}

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8a33d] to-[#c1502e] px-6 py-3 text-xs font-bold text-white shadow-[0_10px_25px_rgba(193,80,46,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(193,80,46,0.23)] disabled:cursor-not-allowed disabled:opacity-50"
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

              {/* ================================================= */}
              {/* CONFIRMATION DIALOG */}
              {/* ================================================= */}

              <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="rounded-[28px] border-0 bg-[#fffdf9] shadow-[0_25px_70px_rgba(60,45,25,0.18)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-[#292722]">
                      Confirm Changes
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm leading-6 text-[#77736d]">
                      Are you sure you want to save these changes to your
                      profile? Please make sure all the information is correct
                      before continuing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={saving}
                      className="rounded-xl border-0 bg-[#f3eee6] text-[#555047] shadow-none hover:bg-[#e9e1d5]"
                    >
                      No, Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleConfirmUpdate}
                      disabled={saving}
                      className="rounded-xl border-0 bg-gradient-to-r from-[#e8a33d] to-[#c1502e] text-white shadow-md hover:opacity-90"
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
            </div>
          </main>
        </div>
      </div>
    </OwnerProtected>
  );
}
