export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 text-slate-900">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="relative">
          {/* Soft Glow */}
          <div className="absolute inset-0 scale-150 rounded-full bg-blue-400/20 blur-3xl" />

          {/* Logo */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)]">
            T
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-6 text-xl font-bold tracking-[-0.04em] text-slate-900">
          ToolShare
        </h1>

        {/* Loading indicator */}
        <div className="mt-5 flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />

          <span className="size-1.5 animate-pulse rounded-full bg-blue-600 [animation-delay:150ms]" />

          <span className="size-1.5 animate-pulse rounded-full bg-blue-600 [animation-delay:300ms]" />
        </div>

        {/* Loading Text */}
        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading ToolShare...
        </p>
      </div>
    </main>
  );
}