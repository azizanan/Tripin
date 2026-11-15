export default function LoadingState({ label = "Memuat data..." }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      {label}
    </div>
  );
}
