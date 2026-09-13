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
} from "lucide-react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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

  // Rental form state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const toolId = Number(params.id);

  /*
   * ==========================================
   * FETCH TOOL
   * ==========================================
   */
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

  /*
   * ==========================================
   * LOADING STATE
   * ==========================================
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#090a0c] px-4 pb-24 pt-32 text-white sm:px-8">
        <div className="mx-auto max-w-[1152px]">
          <div className="animate-pulse">
            <div className="h-5 w-28 rounded bg-[#202126]" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="aspect-4/3 rounded-3xl bg-[#151619] lg:min-h-[560px]" />

              <div className="space-y-5">
                <div className="h-4 w-32 rounded bg-[#202126]" />
                <div className="h-10 w-3/4 rounded bg-[#202126]" />
                <div className="h-8 w-28 rounded bg-[#202126]" />
                <div className="h-10 w-40 rounded-full bg-[#202126]" />
                <div className="h-24 w-full rounded-2xl bg-[#151619]" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-2xl bg-[#151619]" />
                  <div className="h-20 rounded-2xl bg-[#151619]" />
                </div>
                <div className="h-14 rounded-2xl bg-[#202126]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * ERROR STATE
   * ==========================================
   */
  if (error || !tool) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-4 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#292b30] bg-[#0d0e10]">
            <ArrowUpRight className="size-5 text-[#686a72]" />
          </div>

          <h1 className="mt-6 text-2xl font-medium">Tool not found</h1>

          <p className="mt-3 text-sm leading-6 text-[#686a72]">
            This tool may have been removed, rejected, or is no longer
            available.
          </p>

          <Link
            href="/tools"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="size-4" />
            Back to tools
          </Link>
        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * TOOL DATA & CALCULATIONS
   * ==========================================
   */
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

  /*
   * ==========================================
   * PLACE ORDER
   * ==========================================
   */
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

  /*
   * ==========================================
   * PAGE RENDER
   * ==========================================
   */
  return (
    <main className="min-h-screen bg-[#090a0c] px-4 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto max-w-[1152px]">
        {/* BACK BUTTON */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-sm text-[#7d7f87] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to tools
          </button>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* TOOL IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-[#292b30] bg-[#0d0e10]"
          >
            <div className="aspect-4/3 overflow-hidden bg-[#151619] lg:aspect-auto lg:h-full lg:min-h-[560px]">
              <img
                src={imageUrl}
                alt={tool.tool_name}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* TOOL INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#686a72]">
              {tool.category?.name ?? "Uncategorized"}
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              {tool.tool_name}
            </h1>

            {/* Price */}
            <div className="mt-6">
              <span className="text-3xl font-medium">
                ৳{price.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-[#686a72]">per day</span>
            </div>

            {/* Availability */}
            <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#292b30] bg-[#0d0e10] px-4 py-2">
              <span
                className={`size-2 rounded-full ${
                  tool.is_available ? "bg-emerald-400" : "bg-[#686a72]"
                }`}
              />
              <span className="text-sm text-[#a5a5ab]">
                {tool.is_available
                  ? "Available for rental"
                  : "Currently unavailable"}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-[#202126] pt-7">
              <h2 className="text-sm font-medium text-white">
                About this tool
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#96979f]">
                {tool.description}
              </p>
            </div>

            {/* Tool Details */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-4">
                <p className="text-xs text-[#686a72]">Brand</p>
                <p className="mt-2 text-sm font-medium text-white">
                  {tool.brand}
                </p>
              </div>

              <div className="rounded-2xl border border-[#292b30] bg-[#0d0e10] p-4">
                <p className="text-xs text-[#686a72]">Condition</p>
                <p className="mt-2 text-sm font-medium text-white">
                  {tool.condition}
                </p>
              </div>

              <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-[#292b30] bg-[#0d0e10] p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#151619]">
                  <MapPin className="size-4 text-[#96979f]" />
                </div>
                <div>
                  <p className="text-xs text-[#686a72]">Location</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {tool.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner */}
            {tool.owner && (
              <div className="mt-8 border-t border-[#202126] pt-7">
                <p className="text-xs uppercase tracking-wider text-[#686a72]">
                  Shared by
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-white">
                    {tool.owner.name}
                  </p>
                  <p className="mt-1 text-xs text-[#686a72]">Tool owner</p>
                </div>
              </div>
            )}

            {/* RENTAL FORM */}
            <div className="mt-8 border-t border-[#202126] pt-7">
              <h2 className="text-lg font-medium text-white">Rent this tool</h2>
              <p className="mt-2 text-sm leading-6 text-[#686a72]">
                Choose your rental period and send a request to the owner.
              </p>

              {/* Date Range Picker */}
              <div className="mt-6">
                <label className="mb-2 block text-xs font-medium text-[#a5a5ab]">
                  Rental period
                </label>
                <Popover>
                  <PopoverTrigger
                    disabled={placingOrder || !tool.is_available}
                    className="flex h-12 w-full items-center justify-start rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 text-left text-sm font-normal text-white transition-colors hover:bg-[#151619] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CalendarDays className="mr-2 size-4 text-[#96979f]" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM dd, yyyy")}
                          {" – "}
                          {format(dateRange.to, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span className="text-[#686a72]">
                        Select rental dates
                      </span>
                    )}
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-auto border-[#292b30] bg-[#0d0e10] p-0 text-white"
                  >
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={{ before: new Date() }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price Summary */}
              {durationDays > 0 && (
                <div className="mt-5 rounded-2xl border border-[#292b30] bg-[#0d0e10] p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#686a72]">Rental price</span>
                    <span className="text-white">
                      ৳{price.toLocaleString()}/day
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[#686a72]">Duration</span>
                    <span className="text-white">
                      {durationDays} {durationDays === 1 ? "day" : "days"}
                    </span>
                  </div>

                  <div className="my-4 border-t border-[#202126]" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      Estimated total
                    </span>
                    <span className="text-xl font-medium text-white">
                      ৳{estimatedTotal.toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#686a72]">
                    Final rental amount is calculated by the server when your
                    order is submitted.
                  </p>
                </div>
              )}

              {/* Message */}
              <div className="mt-5">
                <label
                  htmlFor="order-message"
                  className="mb-2 block text-xs font-medium text-[#a5a5ab]"
                >
                  Message <span className="text-[#686a72]">(optional)</span>
                </label>

                <textarea
                  id="order-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="Add a message for the tool owner..."
                  disabled={placingOrder || !tool.is_available}
                  className="w-full resize-none rounded-xl border border-[#292b30] bg-[#0d0e10] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-[#686a72] focus:border-[#45474d] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <p className="mt-1 text-right text-xs text-[#686a72]">
                  {message.length}/1000
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  !tool.is_available ||
                  placingOrder ||
                  !dateRange?.from ||
                  !dateRange?.to ||
                  durationDays <= 0
                }
                className="group mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-medium text-black transition-all hover:-translate-y-0.5 hover:bg-[#e8e8e8] disabled:cursor-not-allowed disabled:bg-[#1a1b1f] disabled:text-[#686a72] disabled:hover:translate-y-0"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    Place order
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-[#686a72]">
                <ShieldCheck className="size-4" />
                Verified listing
              </div>

              <div className="flex items-center gap-2 text-xs text-[#686a72]">
                <CheckCircle2 className="size-4" />
                Admin approved
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
