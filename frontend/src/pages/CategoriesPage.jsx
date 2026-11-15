import { ArrowRight, Compass, Coffee, Gem, Hotel, Landmark, Trees, Utensils, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

const icons = [Coffee, Trees, Utensils, Hotel, Landmark, Gem, BriefcaseBusiness];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || []))
      .catch(() => toast.error("Kategori gagal dimuat."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container py-14">
      <span className="eyebrow">EXPLORE BY INTEREST</span>
      <h1 className="heading-lg mt-3 text-slate-900">Kategori destinasi</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Pilih kategori untuk menemukan pengalaman yang sesuai dengan rencana eksplorasimu di Surabaya.</p>
      <div className="mt-9">
        {loading ? <LoadingState /> : categories.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = icons[index % icons.length];
            return <Link key={category.id} to={`/categories/${category.id}`} className="surface group flex items-center gap-5 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"><Icon size={24} /></span>
              <span className="min-w-0 flex-1"><strong className="block text-base font-extrabold text-slate-900">{category.category_name}</strong><span className="mt-1 block text-xs text-slate-500">{category.description || "Temukan rekomendasi pilihan."}</span><span className="mt-3 block text-[11px] font-bold text-blue-600">{category.destination_count || 0} destinasi</span></span>
              <ArrowRight size={18} className="shrink-0 text-slate-300 group-hover:text-blue-600" />
            </Link>;
          })}
        </div> : <EmptyState title="Kategori belum tersedia" />}
      </div>
    </div>
  );
}
