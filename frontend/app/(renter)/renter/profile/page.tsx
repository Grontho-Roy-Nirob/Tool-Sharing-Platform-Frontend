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
  CheckCircle2,
  CalendarDays,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import RenterProtected from "../../../../components/authForm/RenterProtected";
import RenterSidebar from "../../../../components/dashboard/renter/RenterSidebar";
import RenterHeader from "../../../../components/dashboard/renter/RenterHeader";
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

// ==========================================
// RENTER
// ==========================================

interface Renter {
  renterId: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  nidNumber: string;
  role: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// JWT
// ==========================================

interface RenterToken {
  sub: number;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

// ==========================================
// PROFILE FORM
// ==========================================

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  nidNumber: string;
  password: string;
}

// ==========================================
// COMPONENT
// ==========================================

export default function RenterProfilePage() {
  const [renter, setRenter] = useState<Renter | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    nidNumber: "",
    password: "",
  });

  // ==========================================
  // IMAGE STATES
  // ==========================================

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // NEW:
  // Image load না হলে fallback দেখানোর জন্য
  const [imageLoadError, setImageLoadError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  // ==========================================
  // FETCH RENTER PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        const decoded = jwtDecode<RenterToken>(token);
        const renterId = decoded.sub;

        if (!renterId) {
          toast.error("Renter information not found");
          return;
        }

        const response = await api.get<Renter>(`/renter/${renterId}`);

        const data = response.data;

        setRenter(data);

        setForm({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          nidNumber: data.nidNumber ?? "",
          password: "",
        });

        // ==========================================
        // EXISTING PROFILE IMAGE
        // ==========================================

        if (data.profileImage) {
          setImageLoadError(false);

          setImagePreview(
            `${API_URL}/uploads/${data.profileImage}?t=${Date.now()}`,
          );
        } else {
          setImagePreview(null);
          setImageLoadError(false);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL]);

  // ==========================================
  // CLEANUP IMAGE PREVIEW
  // ==========================================

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // ==========================================
    // FILE TYPE VALIDATION
    // ==========================================

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");

      event.target.value = "";
      return;
    }

    // ==========================================
    // FILE SIZE VALIDATION
    // ==========================================

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");

      event.target.value = "";
      return;
    }

    // ==========================================
    // SET IMAGE FILE
    // ==========================================

    setImageFile(file);

    // নতুন image select করলে আগের error remove
    setImageLoadError(false);

    // ==========================================
    // CREATE PREVIEW
    // ==========================================

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!renter?.renterId) {
      toast.error("Renter information not found");
      return;
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (form.password && form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // ==========================================
    // NID VALIDATION
    // ==========================================

    if (!/^\d{10}$/.test(form.nidNumber)) {
      toast.error("NID number must be exactly 10 digits");
      return;
    }

    setShowConfirm(true);
  };

  // ==========================================
  // CONFIRM UPDATE
  // ==========================================

  const handleConfirmUpdate = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Authentication required");
        setShowConfirm(false);
        return;
      }

      const decoded = jwtDecode<RenterToken>(token);
      const renterId = decoded.sub;

      // ==========================================
      // FORM DATA
      // ==========================================

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("nidNumber", form.nidNumber);

      if (form.phone) {
        formData.append("phone", form.phone);
      }

      if (form.password) {
        formData.append("password", form.password);
      }

      // ==========================================
      // PROFILE IMAGE
      // ==========================================

      if (imageFile) {
        // Backend:
        // FileInterceptor('profileImage')
        //
        // তাই এখানে profileImage দিতে হবে
        formData.append("profileImage", imageFile);
      }

      // ==========================================
      // PATCH REQUEST
      // ==========================================

      const response = await api.patch<Renter>(
        `/renter/${renterId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ==========================================
      // UPDATED RENTER
      // ==========================================

      setRenter(response.data);

      setForm({
        fullName: response.data.fullName ?? "",
        email: response.data.email ?? "",
        phone: response.data.phone ?? "",
        nidNumber: response.data.nidNumber ?? "",
        password: "",
      });

      // ==========================================
      // UPDATE IMAGE PREVIEW
      // ==========================================

      if (response.data.profileImage) {
        setImageLoadError(false);

        setImagePreview(
          `${API_URL}/uploads/${response.data.profileImage}?t=${Date.now()}`,
        );
      } else {
        setImagePreview(null);
        setImageLoadError(false);
      }

      setImageFile(null);
      setShowConfirm(false);

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      toast.success(
        form.password
          ? "Profile, image and password updated successfully"
          : imageFile
            ? "Profile and image updated successfully"
            : "Profile updated successfully",
      );
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <RenterProtected>
      <div className="min-h-screen bg-[#f5f3ef] text-[#25231f]">
        {/* ==========================================
            SIDEBAR
        ========================================== */}

        <RenterSidebar />

        {/* ==========================================
            MAIN AREA
        ========================================== */}

        <div className="pt-[68px] lg:ml-[280px] lg:pt-0">
          {/* ==========================================
              HEADER
          ========================================== */}

          <RenterHeader renter={renter} />

          {/* ==========================================
              PAGE CONTENT
          ========================================== */}

          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-[1350px]">
              {/* ==========================================
                  PROFILE HERO
              ========================================== */}

              <section className="relative mb-7 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18191c] via-[#222327] to-[#2b2d31] shadow-[0_16px_40px_rgba(20,20,20,0.14)]">
                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/[0.045]" />

                <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/[0.025]" />

                <div className="pointer-events-none absolute left-[52%] top-6 h-24 w-24 rounded-full bg-white/[0.025]" />

                <div className="pointer-events-none absolute bottom-5 left-[60%] hidden h-12 w-12 rounded-full border border-white/[0.06] sm:block" />

                <div className="relative px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
                  <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 backdrop-blur-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b3d42]">
                      <User className="h-3 w-3 text-white/90" />
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                      Renter Profile
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[36px]">
                    Your Profile
                  </h1>

                  <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/45 sm:text-[13px]">
                    Manage your personal information and account details from
                    one place.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#78a878]" />

                      <span className="text-[10px] font-medium text-white/60">
                        Account Active
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b3a078]" />

                      <span className="text-[10px] font-medium text-white/60">
                        Profile Settings
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8f9298]" />

                      <span className="text-[10px] font-medium text-white/60">
                        Renter Account
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ==========================================
                  LOADING
              ========================================== */}

              {loading ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-white shadow-[0_12px_35px_rgba(76,57,30,0.07)]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eee9] shadow-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-[#5d5a54]" />
                    </div>

                    <p className="text-sm font-medium text-[#77736d]">
                      Loading profile...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid items-start gap-5 lg:grid-cols-[290px_1fr]">
                  {/* ==========================================
                      LEFT PROFILE CARD
                  ========================================== */}

                  <section className="overflow-hidden rounded-[28px] border border-[#e7e3dc] bg-gradient-to-br from-white via-[#fffdf9] to-[#f3efe8] p-5 shadow-[0_12px_35px_rgba(76,57,30,0.07)]">
                    <div className="flex flex-col items-center text-center">
                      {/* ==========================================
                          PROFILE IMAGE
                      ========================================== */}

                      <div className="relative h-28 w-28 shrink-0">
                        {/* ========================================
                            FIXED 112x112 CONTAINER
                        ======================================== */}

                        {imagePreview && !imageLoadError ? (
                          <img
                            src={imagePreview}
                            alt={renter?.fullName || "Renter"}
                            className="block h-28 w-28 rounded-[28px] object-cover shadow-[0_10px_25px_rgba(50,50,50,0.13)]"
                            onError={() => {
                              // Image load না হলে container থাকবে
                              // শুধু fallback দেখাবে
                              setImageLoadError(true);
                            }}
                          />
                        ) : (
                          // ========================================
                          // FALLBACK
                          // ========================================

                          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#55575b] to-[#242528] text-4xl font-bold text-white shadow-[0_10px_25px_rgba(35,35,35,0.18)]">
                            {renter?.fullName
                              ? renter.fullName.charAt(0).toUpperCase()
                              : "R"}
                          </div>
                        )}

                        {/* ==========================================
                            VERIFIED ICON
                        ========================================== */}

                        <div className="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_5px_15px_rgba(76,57,30,0.14)]">
                          <CheckCircle2 className="h-4 w-4 text-[#55575b]" />
                        </div>
                      </div>

                      {/* ==========================================
                          IMAGE UPLOAD BUTTON
                      ========================================== */}

                      <label
                        htmlFor="profileImage"
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#ded9d0] bg-white px-3.5 py-2 text-[11px] font-bold text-[#555047] shadow-sm transition hover:border-[#c8c2b8] hover:bg-[#f8f6f1]"
                      >
                        <Camera className="h-3.5 w-3.5" />

                        {imageFile ? "Change Image" : "Upload Image"}
                      </label>

                      <input
                        id="profileImage"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <p className="mt-2 text-[10px] text-[#999188]">
                        JPG, JPEG, PNG or WEBP • Max 2MB
                      </p>

                      {/* ==========================================
                          SELECTED IMAGE NAME
                      ========================================== */}

                      {imageFile && (
                        <div className="mt-2 flex max-w-full items-center gap-1.5 text-[10px] font-medium text-[#55575b]">
                          <ImageIcon className="h-3 w-3 shrink-0" />

                          <span className="max-w-[190px] truncate">
                            {imageFile.name}
                          </span>
                        </div>
                      )}

                      {/* ==========================================
                          NAME
                      ========================================== */}

                      <h2 className="mt-5 text-lg font-bold text-[#292722]">
                        {renter?.fullName || "Renter"}
                      </h2>

                      <p className="mt-1 max-w-full break-all text-xs text-[#77736d]">
                        {renter?.email}
                      </p>
                    </div>

                    {/* ==========================================
                        PROFILE INFO
                    ========================================== */}

                    <div className="mt-6 space-y-2.5">
                      {/* RENTER ID */}

                      <div className="flex items-center gap-3 rounded-2xl border border-[#eeeae3] bg-white/90 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0eee9]">
                          <ShieldCheck className="h-4 w-4 text-[#55575b]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Renter ID
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-[#292722]">
                            #{renter?.renterId}
                          </p>
                        </div>
                      </div>

                      {/* PHONE */}

                      <div className="flex items-center gap-3 rounded-2xl border border-[#eeeae3] bg-white/90 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f1eee9]">
                          <Phone className="h-4 w-4 text-[#67645e]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Phone
                          </p>

                          <p className="mt-0.5 truncate text-xs font-semibold text-[#292722]">
                            {renter?.phone || "Not added"}
                          </p>
                        </div>
                      </div>

                      {/* ROLE */}

                      <div className="flex items-center gap-3 rounded-2xl border border-[#eeeae3] bg-white/90 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0eee9]">
                          <User className="h-4 w-4 text-[#55575b]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Account Role
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-[#292722]">
                            Renter
                          </p>
                        </div>
                      </div>

                      {/* MEMBER SINCE */}

                      <div className="flex items-center gap-3 rounded-2xl border border-[#eeeae3] bg-white/90 px-3.5 py-3 shadow-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f1eee9]">
                          <CalendarDays className="h-4 w-4 text-[#67645e]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999188]">
                            Member Since
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-[#292722]">
                            {renter?.createdAt
                              ? new Date(renter.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ==========================================
                      RIGHT FORM
                  ========================================== */}

                  <section className="rounded-[28px] border border-[#e7e3dc] bg-gradient-to-br from-white via-[#fffdf9] to-[#f4f0e9] p-5 shadow-[0_12px_35px_rgba(76,57,30,0.07)] sm:p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f0eee9] to-[#dedbd4]">
                        <User className="h-5 w-5 text-[#55575b]" />
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
                      {/* NAME + EMAIL */}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* FULL NAME */}

                        <div>
                          <label
                            htmlFor="fullName"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                          >
                            Full Name
                          </label>

                          <div className="relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                            <input
                              id="fullName"
                              name="fullName"
                              type="text"
                              value={form.fullName}
                              onChange={handleChange}
                              required
                              maxLength={150}
                              placeholder="Enter your full name"
                              className="w-full rounded-2xl bg-[#faf8f4] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(80,80,80,0.10)]"
                            />
                          </div>
                        </div>

                        {/* EMAIL */}

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
                              className="w-full rounded-2xl bg-[#faf8f4] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(80,80,80,0.10)]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PHONE + NID */}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* PHONE */}

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
                              className="w-full rounded-2xl bg-[#faf8f4] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(80,80,80,0.10)]"
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
                              required
                              inputMode="numeric"
                              maxLength={10}
                              placeholder="Enter your NID number"
                              className="w-full rounded-2xl bg-[#faf8f4] py-3.5 pl-11 pr-4 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(80,80,80,0.10)]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PASSWORD */}

                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#77736d]"
                        >
                          New Password
                        </label>

                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa39a]" />

                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            placeholder="Leave blank to keep current password"
                            className="w-full rounded-2xl bg-[#faf8f4] py-3.5 pl-11 pr-12 text-sm text-[#292722] shadow-inner outline-none transition placeholder:text-[#aaa39a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(80,80,80,0.10)]"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((previous) => !previous)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa39a] transition hover:text-[#55575b]"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-[11px] text-[#999188]">
                          Password must contain at least 6 characters. Leave
                          blank if you do not want to change it.
                        </p>
                      </div>

                      {/* ACCOUNT INFORMATION */}

                      <div className="rounded-[22px] border border-[#e8e3db] bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0eee9]">
                            <ShieldCheck className="h-4 w-4 text-[#55575b]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-[#30302d]">
                              Account Information
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-[#8d8981]">
                              Your password is securely updated when you enter a
                              new password. You can also upload a new profile
                              image. Leave the password field empty to keep your
                              current password.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SAVE BUTTON */}

                      <div className="flex justify-end border-t border-[#e7e3dc] pt-5">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3d3e41] to-[#1f2022] px-6 py-3 text-xs font-bold text-white shadow-[0_10px_25px_rgba(30,30,30,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(30,30,30,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
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

              {/* ==========================================
                  CONFIRMATION DIALOG
              ========================================== */}

              <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="rounded-[28px] border-0 bg-[#fffdf9] shadow-[0_25px_70px_rgba(45,43,38,0.18)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-[#292722]">
                      Confirm Changes
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm leading-6 text-[#77736d]">
                      Are you sure you want to save these changes to your
                      profile?
                      {imageFile && (
                        <span className="mt-1 block font-medium text-[#55575b]">
                          Your new profile image will also be uploaded.
                        </span>
                      )}
                      {form.password && (
                        <span className="mt-1 block font-medium text-[#55575b]">
                          Your new password will also be updated.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={saving}
                      className="rounded-xl border-0 bg-[#f0eee9] text-[#555047] shadow-none hover:bg-[#e5e1da]"
                    >
                      No, Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleConfirmUpdate}
                      disabled={saving}
                      className="rounded-xl border-0 bg-gradient-to-r from-[#3d3e41] to-[#1f2022] text-white shadow-md hover:opacity-90"
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
    </RenterProtected>
  );
}
