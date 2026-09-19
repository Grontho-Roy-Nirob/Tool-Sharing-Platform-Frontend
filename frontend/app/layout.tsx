import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ToolShare",
    template: "%s | ToolShare",
  },
  description:
    "ToolShare is a community-powered platform for borrowing, lending, and sharing tools.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col bg-[#faf7f2] text-slate-900">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}