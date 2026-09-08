// "use client";

// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { Loader2, Save, User } from "lucide-react";
// import { toast } from "sonner";

// import RenterProtected from "../../../../components/authForm/RenterProtected";
// import RenterSidebar from "../../../../components/dashboard/renter/RenterSidebar";
// import RenterHeader from "../../../../components/dashboard/renter/RenterHeader";

// import api from "../../../../lib/axios";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../../../../components/ui/alert-dialog";

// interface Renter {
//   renterId: number;
//   fullName: string;
//   email: string;
//   phone?: string;
//   profileImage?: string;
//   nidNumber: string;
//   role: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface RenterToken {
//   sub: number;
//   email: string;
//   role: number;
//   iat: number;
//   exp: number;
// }

// interface ProfileForm {
//   fullName: string;
//   email: string;
//   phone: string;
//   nidNumber: string;
// }

// export default function RenterProfilePage() {
//   const [renter, setRenter] = useState<Renter | null>(null);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [form, setForm] = useState<ProfileForm>({
//     fullName: "",
//     email: "",
//     phone: "",
//     nidNumber: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("access_token");

//         if (!token) {
//           return;
//         }

//         const decoded = jwtDecode<RenterToken>(token);
//         const renterId = decoded.sub;

//         const response = await api.get<Renter>(`/renter/${renterId}`);

//         const data = response.data;

//         setRenter(data);

//         setForm({
//           fullName: data.fullName ?? "",
//           email: data.email ?? "",
//           phone: data.phone ?? "",
//           nidNumber: data.nidNumber ?? "",
//         });
//       } catch (error) {
//         console.error("Failed to load profile:", error);
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       setSaving(true);

//       const token = localStorage.getItem("access_token");

//       if (!token) {
//         toast.error("Authentication required");
//         return;
//       }

//       const decoded = jwtDecode<RenterToken>(token);
//       const renterId = decoded.sub;

//       const response = await api.patch<Renter>(`/renter/${renterId}`, {
//         fullName: form.fullName,
//         email: form.email,
//         phone: form.phone || undefined,
//         nidNumber: form.nidNumber,
//       });

//       setRenter(response.data);

//       setForm({
//         fullName: response.data.fullName ?? "",
//         email: response.data.email ?? "",
//         phone: response.data.phone ?? "",
//         nidNumber: response.data.nidNumber ?? "",
//       });

//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.error("Failed to update profile:", error);

//       toast.error("Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <RenterProtected>
//       <div className="min-h-screen bg-[#090a0c] text-white">
//         <RenterSidebar />

//         <div className="lg:pl-64">
//           <RenterHeader renter={renter} />

//           <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
//             {/* Page Header */}
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//                 Profile
//               </h1>

//               <p className="mt-2 text-sm text-[#9ca3af]">
//                 Manage your personal information and account details.
//               </p>
//             </div>

//             {/* Loading */}
//             {loading ? (
//               <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10]">
//                 <Loader2 className="h-6 w-6 animate-spin text-[#9ca3af]" />
//               </div>
//             ) : (
//               <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
//                 {/* Profile Card */}
//                 <section className="h-fit rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
//                   <div className="flex flex-col items-center text-center">
//                     {renter?.profileImage ? (
//                       <img
//                         src={renter.profileImage}
//                         alt={renter.fullName}
//                         className="h-24 w-24 rounded-2xl object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
//                         {renter?.fullName ? (
//                           renter.fullName.charAt(0).toUpperCase()
//                         ) : (
//                           <User className="h-8 w-8" />
//                         )}
//                       </div>
//                     )}

//                     <h2 className="mt-4 text-lg font-semibold">
//                       {renter?.fullName || "Renter"}
//                     </h2>

//                     <p className="mt-1 break-all text-sm text-[#71717a]">
//                       {renter?.email}
//                     </p>

//                     <div className="mt-5 w-full border-t border-[#292b30] pt-5">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-[#71717a]">Renter ID</span>

//                         <span className="font-medium text-[#d4d4d8]">
//                           #{renter?.renterId}
//                         </span>
//                       </div>

//                       <div className="mt-3 flex items-center justify-between text-sm">
//                         <span className="text-[#71717a]">Member since</span>

//                         <span className="text-[#d4d4d8]">
//                           {renter?.createdAt
//                             ? new Date(renter.createdAt).toLocaleDateString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "short",
//                                   year: "numeric",
//                                 },
//                               )
//                             : "-"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Profile Form */}
//                 <section className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
//                   <div className="mb-6">
//                     <h2 className="text-lg font-semibold">
//                       Personal Information
//                     </h2>

//                     <p className="mt-1 text-sm text-[#71717a]">
//                       Update your personal information below.
//                     </p>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Full Name */}
//                     <div>
//                       <label
//                         htmlFor="fullName"
//                         className="mb-2 block text-sm font-medium text-[#d4d4d8]"
//                       >
//                         Full Name
//                       </label>

//                       <input
//                         id="fullName"
//                         name="fullName"
//                         type="text"
//                         value={form.fullName}
//                         onChange={handleChange}
//                         required
//                         maxLength={150}
//                         placeholder="Enter your full name"
//                         className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
//                       />
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="mb-2 block text-sm font-medium text-[#d4d4d8]"
//                       >
//                         Email
//                       </label>

//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                         maxLength={255}
//                         placeholder="Enter your email"
//                         className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
//                       />
//                     </div>

//                     {/* Phone */}
//                     <div>
//                       <label
//                         htmlFor="phone"
//                         className="mb-2 block text-sm font-medium text-[#d4d4d8]"
//                       >
//                         Phone Number
//                       </label>

//                       <input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         value={form.phone}
//                         onChange={handleChange}
//                         placeholder="+8801XXXXXXXXX"
//                         className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
//                       />

//                       <p className="mt-2 text-xs text-[#52525b]">
//                         Use a valid Bangladesh phone number.
//                       </p>
//                     </div>

//                     {/* NID */}
//                     <div>
//                       <label
//                         htmlFor="nidNumber"
//                         className="mb-2 block text-sm font-medium text-[#d4d4d8]"
//                       >
//                         NID Number
//                       </label>

//                       <input
//                         id="nidNumber"
//                         name="nidNumber"
//                         type="text"
//                         value={form.nidNumber}
//                         onChange={handleChange}
//                         required
//                         inputMode="numeric"
//                         placeholder="Enter your NID number"
//                         className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
//                       />
//                     </div>

//                     {/* Save */}
//                     <div className="flex justify-end border-t border-[#292b30] pt-5">
//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e4e4e7] disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                         {saving ? (
//                           <>
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="h-4 w-4" />
//                             Save Changes
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </section>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </RenterProtected>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2, Save, User } from "lucide-react";
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

interface RenterToken {
  sub: number;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  nidNumber: string;
}

export default function RenterProfilePage() {
  const [renter, setRenter] = useState<Renter | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    nidNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const decoded = jwtDecode<RenterToken>(token);
        const renterId = decoded.sub;

        const response = await api.get<Renter>(`/renter/${renterId}`);

        const data = response.data;

        setRenter(data);

        setForm({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          nidNumber: data.nidNumber ?? "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);

        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT FORM
  // Opens confirmation dialog
  // ==========================================

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowConfirm(true);
  };

  // ==========================================
  // CONFIRM UPDATE
  // PATCH /renter/:id
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

      const response = await api.patch<Renter>(`/renter/${renterId}`, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
        nidNumber: form.nidNumber,
      });

      // Update renter state
      setRenter(response.data);

      // Update form with returned backend data
      setForm({
        fullName: response.data.fullName ?? "",
        email: response.data.email ?? "",
        phone: response.data.phone ?? "",
        nidNumber: response.data.nidNumber ?? "",
      });

      // Close dialog
      setShowConfirm(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RenterProtected>
      <div className="min-h-screen bg-[#090a0c] text-white">
        {/* Sidebar */}
        <RenterSidebar />

        <div className="lg:pl-64">
          {/* Header */}
          <RenterHeader renter={renter} />

          <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Profile
              </h1>

              <p className="mt-2 text-sm text-[#9ca3af]">
                Manage your personal information and account details.
              </p>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#292b30] bg-[#0d0e10]">
                <Loader2 className="h-6 w-6 animate-spin text-[#9ca3af]" />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* ==========================================
                    PROFILE CARD
                ========================================== */}

                <section className="h-fit rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Image */}
                    {renter?.profileImage ? (
                      <img
                        src={renter.profileImage}
                        alt={renter.fullName}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-black">
                        {renter?.fullName ? (
                          renter.fullName.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    {/* Name */}
                    <h2 className="mt-4 text-lg font-semibold">
                      {renter?.fullName || "Renter"}
                    </h2>

                    {/* Email */}
                    <p className="mt-1 break-all text-sm text-[#71717a]">
                      {renter?.email}
                    </p>

                    {/* Account Information */}
                    <div className="mt-5 w-full border-t border-[#292b30] pt-5">
                      {/* Renter ID */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#71717a]">Renter ID</span>

                        <span className="font-medium text-[#d4d4d8]">
                          #{renter?.renterId}
                        </span>
                      </div>

                      {/* Member Since */}
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-[#71717a]">Member since</span>

                        <span className="text-[#d4d4d8]">
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
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ==========================================
                    PROFILE FORM
                ========================================== */}

                <section className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-[#71717a]">
                      Update your personal information below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="mb-2 block text-sm font-medium text-[#d4d4d8]"
                      >
                        Full Name
                      </label>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        maxLength={150}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
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
                        required
                        inputMode="numeric"
                        placeholder="Enter your NID number"
                        className="w-full rounded-xl border border-[#292b30] bg-[#090a0c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525b] focus:border-[#71717a]"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end border-t border-[#292b30] pt-5">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e4e4e7] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
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
    </RenterProtected>
  );
}
