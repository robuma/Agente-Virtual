export function LoadingIndicator({ label = "Procesando" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500" role="status">
      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-600" />
      <span>{label}</span>
    </div>
  );
}
