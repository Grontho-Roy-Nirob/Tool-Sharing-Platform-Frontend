"use client";

import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  Home,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#f5f3ef] px-4 py-10 sm:px-6 lg:px-8">
      {" "}
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
        {" "}
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(41,39,34,0.10)]">
          {" "}
          <div className="bg-[#292722] px-6 py-10 text-center sm:px-10">
            {" "}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8A33D] shadow-lg">
              {" "}
              <CheckCircle2
                className="h-11 w-11 text-white"
                strokeWidth={2.5}
              />{" "}
            </div>
            ```
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70 sm:text-base">
              Your payment has been completed successfully. Your rental order
              has been recorded.
            </p>
          </div>
          <div className="px-6 py-8 sm:px-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#eee9e1] bg-[#faf9f7] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3df]">
                    <CreditCard className="h-5 w-5 text-[#E8A33D]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Payment
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#292722]">
                      Completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee9e1] bg-[#faf9f7] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fdf0eb]">
                    <PackageCheck className="h-5 w-5 text-[#C1502E]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Order
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#292722]">
                      Payment Received
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5f3ef] p-5">
              <p className="text-sm leading-6 text-gray-600">
                Thank you for using ToolShare. Your payment information has been
                securely processed through Stripe. You can now return to your
                orders and check your rental details.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/renter/orders"
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E8A33D] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d8942f] hover:shadow-[0_8px_20px_rgba(232,163,61,0.25)]"
              >
                <PackageCheck className="h-4 w-4" />
                View My Orders
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/renter"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ddd7ce] bg-white px-5 py-3.5 text-sm font-semibold text-[#292722] transition-all duration-300 hover:bg-[#f8f6f2]"
              >
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
