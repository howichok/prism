export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 animate-fade-in">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="loading-mark-wrap">
          <div className="loading-mark">
            P
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-display text-2xl text-white">PrismMTR</div>
          <div className="text-sm text-white/52">Loading workspace</div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="loading-dot" />
          <span className="loading-dot [animation-delay:120ms]" />
          <span className="loading-dot [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
