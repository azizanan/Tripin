import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Belum ada data", description = "Coba ubah kata kunci atau filter pencarian." }) {
  return (
    <div className="surface flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><SearchX size={25} /></span>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
