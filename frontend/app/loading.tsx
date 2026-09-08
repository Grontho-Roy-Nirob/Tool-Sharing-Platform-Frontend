export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0c] px-6 text-white">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 scale-150 rounded-full bg-white/5 blur-2xl" />

          {/* Logo */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-[#101114] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            T
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-6 text-xl font-semibold tracking-[-0.04em]">
          ToolShare
        </h1>

        {/* Loading indicator */}
        <div className="mt-5 flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-white" />
          <span className="size-1.5 animate-pulse rounded-full bg-white [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-white [animation-delay:300ms]" />
        </div>

        <p className="mt-3 text-sm text-[#71717a]">Loading...</p>
      </div>
    </main>
  );
}
