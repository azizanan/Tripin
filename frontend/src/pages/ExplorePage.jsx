import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import DestinationCard from "../components/DestinationCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category_id: "",
    district: "",
    min_price: "",
    max_price: "",
    sort: "newest"
  });

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || [])).catch(() => toast.error("Kategori gagal dimuat."));
  }, []);

  const load = async (page = 1, selectedFilters = filters) => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...Object.fromEntries(Object.entries(selectedFilters).filter(([, value]) => value !== "")) };
      const response = await api.get("/destinations", { params });
      setItems(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 });
      setSearchParams(selectedFilters.search ? { search: selectedFilters.search } : {}, { replace: true });
    } catch {
      toast.error("Destinasi gagal dimuat. Periksa koneksi API.");
      setItems([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(1); }, []);

  const change = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const apply = (event) => { event.preventDefault(); load(1, filters); };
  const reset = () => {
    const cleared = { search: "", category_id: "", district: "", min_price: "", max_price: "", sort: "newest" };
    setFilters(cleared);
    load(1, cleared);
  };

  return (
    <div className="page-container py-12">
      <div className="mb-10">
        <span className="eyebrow">DISCOVER SURABAYA</span>
        <h1 className="heading-lg mt-3 text-slate-900">Jelajahi destinasi</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">Temukan tempat sesuai minat, lokasi, dan anggaran perjalananmu.</p>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[270px_1fr]">
        <form onSubmit={apply} className="surface p-5">
          <div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-extrabold text-slate-900"><SlidersHorizontal size={17} /> Filter destinasi</h2><button type="button" onClick={reset} className="text-xs font-bold text-blue-600">Reset</button></div>
          <label className="mb-2 block text-xs font-bold text-slate-600">Kata kunci</label>
          <div className="relative mb-5"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="field !pl-9" value={filters.search} onChange={(e) => change("search", e.target.value)} placeholder="Nama tempat..." /></div>

          <label className="mb-2 block text-xs font-bold text-slate-600">Kategori</label>
          <select className="field mb-5" value={filters.category_id} onChange={(e) => change("category_id", e.target.value)}><option value="">Semua kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}</select>

          <label className="mb-2 block text-xs font-bold text-slate-600">Kecamatan / lokasi</label>
          <input className="field mb-5" value={filters.district} onChange={(e) => change("district", e.target.value)} placeholder="Contoh: Wonokromo" />

          <label className="mb-2 block text-xs font-bold text-slate-600">Rentang harga (Rp)</label>
          <div className="mb-5 grid grid-cols-2 gap-2"><input type="number" min="0" className="field" value={filters.min_price} onChange={(e) => change("min_price", e.target.value)} placeholder="Min" /><input type="number" min="0" className="field" value={filters.max_price} onChange={(e) => change("max_price", e.target.value)} placeholder="Maks" /></div>

          <label className="mb-2 block text-xs font-bold text-slate-600">Urutkan</label>
          <select className="field mb-5" value={filters.sort} onChange={(e) => change("sort", e.target.value)}>
            <option value="newest">Terbaru</option><option value="rating">Rating tertinggi</option><option value="popular">Paling populer</option><option value="name">Nama A–Z</option>
          </select>
          <button className="btn-primary w-full" type="submit"><Filter size={16} /> Terapkan filter</button>
        </form>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500"><strong className="text-slate-900">{pagination.total || 0}</strong> destinasi ditemukan</p>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">Surabaya, Jawa Timur</span>
          </div>
          {loading ? <LoadingState label="Mencari destinasi..." /> : items.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <DestinationCard key={item.id} destination={item} />)}</div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)} className="btn-secondary">Sebelumnya</button>
                <span className="text-sm text-slate-500">Halaman {pagination.page} dari {pagination.totalPages}</span>
                <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)} className="btn-secondary">Berikutnya</button>
              </div>
            </>
          ) : <EmptyState title="Destinasi belum ditemukan" description="Coba ubah kata kunci, kategori, rentang harga, atau lokasi. Destinasi baru akan muncul setelah diverifikasi dan dipublikasikan." />}
        </div>
      </div>
    </div>
  );
}
