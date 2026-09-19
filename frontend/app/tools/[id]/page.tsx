"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Loader2,
  UserRound,
  Tag,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getPublicToolById, PublicTool } from "@/lib/toolapi";
import { createOrder } from "@/lib/orderApi";

export default function ToolDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [tool, setTool] = useState<PublicTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const toolId = Number(params.id);

  useEffect(() => {
    if (!toolId || Number.isNaN(toolId)) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchTool = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getPublicToolById(toolId);
        setTool(data);
      } catch (err) {
        console.error("Failed to load tool:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3CCFF]/20 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3CCFF]/50 shadow-lg shadow-[#A555EC]/10">
            <Loader2 className="h-7 w-7 animate-spin text-[#A555EC]" />
          </div>

          <p className="text-sm font-medium text-[#6d5c76]">
            Loading tool details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !tool) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3CCFF]/20 px-4">
        <div className="w-full max-w-md rounded-[28px] border border-[#D09CFA]/40 bg-white p-8 text-center shadow-[0_20px_60px_rgba(165,85,236,0.10)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <Wrench className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-[#281832]">Tool Not Found</h2>

          <p className="mt-2 text-sm text-[#806f88]">
            We couldn't find the tool you're looking for.
          </p>

          <Link
            href="/tools"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#A555EC] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#A555EC]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f43d2]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = tool.tool_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
    : "/placeholder-tool.jpg";

  const price = Number(tool.rental_price_per_day);

  const durationDays =
    dateRange?.from && dateRange?.to
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const estimatedTotal = durationDays * price;

  const formatDateForApi = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const handlePlaceOrder = async () => {
    if (!dateRange?.from) {
      toast.error("Please select a start date.");
      return;
    }

    if (!dateRange?.to) {
      toast.error("Please select an end date.");
      return;
    }

    if (durationDays <= 0) {
      toast.error("End date must be after start date.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Please sign in to place an order.");
      router.push(`/renter?redirect=/tools/${tool.id}`);
      return;
    }

    try {
      setPlacingOrder(true);

      await createOrder({
        tool_ids: [tool.id],
        start_date: formatDateForApi(dateRange.from),
        end_date: formatDateForApi(dateRange.to),
        message: message.trim() || undefined,
      });

      toast.success("Order placed successfully!");
      router.push("/renter/orders");
    } catch (err: any) {
      console.error("Failed to place order:", err);

      const backendMessage = err?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        toast.error(backendMessage.join(", "));
      } else {
        toast.error(
          backendMessage || "Unable to place the order. Please try again.",
        );
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3CCFF]/20 px-4 pb-24 pt-28 text-[#281832] sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        {/* BACK BUTTON */}
        <Link
          href="/tools"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#D09CFA]/30 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#6d5c76] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#A555EC]/30 hover:text-[#A555EC] hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Tools
        </Link>

        {/* HERO SECTION */}
        <div className="relative mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#F3CCFF]/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-[#FFFFD0]/40 blur-3xl" />

          {/* IMAGE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[26px] border border-[#D09CFA]/30 bg-gradient-to-br from-[#F3CCFF]/40 via-white to-[#FFFFD0]/30 p-2 shadow-[0_20px_60px_rgba(165,85,236,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(165,85,236,0.16)]"
          >
            <div className="relative h-[330px] overflow-hidden rounded-[20px] bg-[#F3CCFF]/30 sm:h-[350px] lg:h-[360px]">
              <img
                src={imageUrl}
                alt={tool.tool_name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.035]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#281832]/35 via-transparent to-transparent" />

              {/* AVAILABLE */}
              <div className="absolute left-4 top-4">
                <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-xs font-bold text-[#281832] shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Available
                </div>
              </div>

              {/* VERIFIED */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-[#281832]/70 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#F3CCFF]" />
                  Verified Listing
                </div>
              </div>
            </div>
          </motion.div>

          {/* BASIC INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-[26px] border border-[#D09CFA]/30 bg-gradient-to-br from-white via-white to-[#F3CCFF]/25 p-6 shadow-[0_20px_60px_rgba(165,85,236,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(165,85,236,0.13)] sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F3CCFF]/40 px-3 py-1.5 text-xs font-bold text-[#8f43d2]">
                <Tag className="h-3.5 w-3.5" />
                {tool.category?.name || "Tool"}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </div>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#281832] sm:text-4xl">
              {tool.tool_name}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806f88]">
              {tool.description ||
                "A reliable tool available for rental through ToolShare."}
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-[#D09CFA]/20 pt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#95869d]">
                  Rental Price
                </p>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#A555EC]">
                    ৳{price}
                  </span>

                  <span className="text-sm font-medium text-[#806f88]">
                    / day
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#FFFFD0]/60 px-4 py-2.5 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#95869d]">
                  Availability
                </p>

                <p className="mt-0.5 text-sm font-bold text-emerald-600">
                  Ready to Rent
                </p>
              </div>
            </div>

            {/* OWNER */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#D09CFA]/20 bg-white/80 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3CCFF]/50">
                <UserRound className="h-5 w-5 text-[#A555EC]" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#95869d]">
                  Listed by
                </p>

                <p className="mt-0.5 text-sm font-bold text-[#281832]">
                  {tool.owner?.name || "Tool Owner"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* LOWER SECTION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_390px]">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            {/* ABOUT */}
            <div className="rounded-[24px] border border-[#D09CFA]/25 bg-white p-6 shadow-[0_15px_45px_rgba(165,85,236,0.06)] transition-all duration-300 hover:shadow-[0_20px_55px_rgba(165,85,236,0.10)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3CCFF]/50">
                  <Wrench className="h-4 w-4 text-[#A555EC]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#281832]">
                    About this tool
                  </h2>

                  <p className="text-xs text-[#95869d]">Tool information</p>
                </div>
              </div>

              <p className="text-sm leading-7 text-[#6d5c76]">
                {tool.description ||
                  "This tool is available for rental through ToolShare. Please review the tool information and select your preferred rental dates."}
              </p>
            </div>

            {/* BRAND / CONDITION / CATEGORY */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* BRAND */}
              <div className="group rounded-2xl border border-[#D09CFA]/20 bg-gradient-to-br from-white to-[#F3CCFF]/20 px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A555EC]/30 hover:shadow-[0_12px_30px_rgba(165,85,236,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3CCFF]/45 transition-transform duration-300 group-hover:scale-105">
                    <Wrench className="h-4 w-4 text-[#A555EC]" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#95869d]">
                    Brand
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-[#281832]">
                  {tool.brand || "Not specified"}
                </p>
              </div>

              {/* CONDITION */}
              <div className="group rounded-2xl border border-[#D09CFA]/20 bg-gradient-to-br from-white to-[#FFFFD0]/35 px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A555EC]/30 hover:shadow-[0_12px_30px_rgba(165,85,236,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFFD0]/70 transition-transform duration-300 group-hover:scale-105">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#95869d]">
                    Condition
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-[#281832]">
                  {tool.condition || "Good"}
                </p>
              </div>

              {/* CATEGORY */}
              <div className="group rounded-2xl border border-[#D09CFA]/20 bg-gradient-to-br from-white to-[#F3CCFF]/20 px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A555EC]/30 hover:shadow-[0_12px_30px_rgba(165,85,236,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3CCFF]/45 transition-transform duration-300 group-hover:scale-105">
                    <Tag className="h-4 w-4 text-[#A555EC]" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#95869d]">
                    Category
                  </span>
                </div>

                <p className="mt-2 truncate text-sm font-bold text-[#281832]">
                  {tool.category?.name || "Not specified"}
                </p>
              </div>
            </div>

            {/* LOCATION */}
            <div className="rounded-[24px] border border-[#D09CFA]/25 bg-gradient-to-br from-white via-white to-[#F3CCFF]/15 p-5 shadow-[0_15px_45px_rgba(165,85,236,0.06)] transition-all duration-300 hover:shadow-[0_20px_55px_rgba(165,85,236,0.10)]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3CCFF]/45">
                  <MapPin className="h-5 w-5 text-[#A555EC]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#95869d]">
                    Pickup Location
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#281832]">
                    {tool.location || "Location not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* TRUST CARDS */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#D09CFA]/20 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3CCFF]/45">
                    <ShieldCheck className="h-4 w-4 text-[#A555EC]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#281832]">
                      Verified Listing
                    </p>

                    <p className="mt-0.5 text-xs text-[#95869d]">
                      Reviewed by ToolShare
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D09CFA]/20 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFFFD0]/70">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#281832]">
                      Rental Ready
                    </p>

                    <p className="mt-0.5 text-xs text-[#95869d]">
                      Available for booking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RENTAL FORM */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-fit lg:sticky lg:top-24"
          >
            <div className="rounded-[26px] border border-[#D09CFA]/30 bg-gradient-to-br from-[#F3CCFF]/30 via-white to-[#FFFFD0]/25 p-5 shadow-[0_20px_60px_rgba(165,85,236,0.10)] transition-all duration-300 hover:shadow-[0_28px_70px_rgba(165,85,236,0.15)]">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#A555EC]">
                  Rental Request
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#281832]">
                  Rent this tool
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#806f88]">
                  Select your preferred rental period.
                </p>
              </div>

              {/* DATE PICKER */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#281832]">
                  Rental Dates
                </label>

                <Popover>
                  <PopoverTrigger
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-[#D09CFA]/30 bg-white px-4 py-3 text-left text-sm shadow-sm transition-all duration-300 hover:border-[#A555EC]/50 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#A555EC]" />

                      <span
                        className={
                          dateRange?.from
                            ? "font-semibold text-[#281832]"
                            : "text-[#95869d]"
                        }
                      >
                        {dateRange?.from
                          ? dateRange.to
                            ? `${format(
                                dateRange.from,
                                "MMM d, yyyy",
                              )} - ${format(dateRange.to, "MMM d, yyyy")}`
                            : format(dateRange.from, "MMM d, yyyy")
                          : "Select rental dates"}
                      </span>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-[#95869d]" />
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto border-[#D09CFA]/30 bg-white p-2 shadow-xl"
                    align="start"
                  >
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* MESSAGE */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold text-[#281832]">
                  Message
                  <span className="ml-1 font-normal text-[#95869d]">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a message for the owner..."
                  className="w-full resize-none rounded-xl border border-[#D09CFA]/30 bg-white px-4 py-3 text-sm text-[#281832] outline-none transition-all duration-300 placeholder:text-[#aaa0b0] focus:border-[#A555EC]/50 focus:ring-4 focus:ring-[#A555EC]/10"
                />
              </div>

              {/* ORDER SUMMARY */}
              {durationDays > 0 && (
                <div className="mt-5 rounded-2xl border border-[#D09CFA]/20 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806f88]">
                      {durationDays} rental day
                      {durationDays > 1 ? "s" : ""}
                    </span>

                    <span className="font-semibold text-[#281832]">
                      ৳{price} × {durationDays}
                    </span>
                  </div>

                  <div className="my-3 h-px bg-[#D09CFA]/20" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#281832]">
                      Estimated Total
                    </span>

                    <span className="text-xl font-extrabold text-[#A555EC]">
                      ৳{estimatedTotal}
                    </span>
                  </div>
                </div>
              )}

              {/* PLACE ORDER */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A555EC] to-[#8f43d2] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#A555EC]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#A555EC]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Rental Request
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-[#95869d]">
                Your request will be sent to the tool owner for approval.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
