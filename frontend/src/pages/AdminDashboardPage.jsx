import { BarChart3, CheckCircle2, Edit3, FolderPlus, MessageSquare, Plus, Save, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

const initialForm = {
  category_id: "", name: "", description: "", address: "", district: "",
  latitude: "", longitude: "", price_min: "", price_max: "",
  opening_hours: "", image: "", is_published: false
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("destinations");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ category_name: "", description: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsResponse, destinationResponse, categoryResponse, reviewResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/destinations"),
        api.get("/categories"),
        api.get("/admin/reviews")
      ]);
      setStats(statsResponse.data.data);
      setDestinations(destinationResponse.data.data || []);
      setCategories(categoryResponse.data.data || []);
      setReviews(reviewResponse.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Data dashboard gagal dimuat.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadDashboard(); }, []);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const editDestination = (item) => {
    setEditingId(item.id);
    setForm({
      category_id: String(item.category_id || ""),
      name: item.name || "",
      description: item.description || "",
      address: item.address || "",
      district: item.district || "",
      latitude: item.latitude ?? "",
      longitude: item.longitude ?? "",
      price_min: item.price_min ?? "",
      price_max: item.price_max ?? "",
      opening_hours: item.opening_hours || "",
      image: item.image || "",
      is_published: Boolean(item.is_published)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitDestination = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      price_min: form.price_min === "" ? null : Number(form.price_min),
      price_max: form.price_max === "" ? null : Number(form.price_max)
    };
    try {
      if (editingId) await api.put(`/destinations/${editingId}`, payload);
      else await api.post("/destinations", payload);
      toast.success(editingId ? "Destinasi diperbarui." : "Destinasi ditambahkan.");
      setForm(initialForm);
      setEditingId(null);
      await loadDashboard();
    } catch (error) { toast.error(error.response?.data?.message || "Destinasi gagal disimpan."); }
    finally { setSaving(false); }
  };

  const removeDestination = async (id) => {
    if (!window.confirm("Hapus destinasi ini? Ulasan dan favorit terkait juga akan terhapus.")) return;
    try { await api.delete(`/destinations/${id}`); toast.success("Destinasi dihapus."); await loadDashboard(); }
    catch (error) { toast.error(error.response?.data?.message || "Destinasi gagal dihapus."); }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    try {
      if (editingCategoryId) await api.put(`/categories/${editingCategoryId}`, categoryForm);
      else await api.post("/categories", categoryForm);
      setCategoryForm({ category_name: "", description: "" });
      setEditingCategoryId(null);
      toast.success(editingCategoryId ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan.");
      await loadDashboard();
    } catch (error) { toast.error(error.response?.data?.message || "Kategori gagal disimpan."); }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ category_name: category.category_name, description: category.description || "" });
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Hapus kategori ini? Kategori yang masih dipakai destinasi tidak dapat dihapus.")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Kategori berhasil dihapus.");
      await loadDashboard();
    } catch (error) { toast.error(error.response?.data?.message || "Kategori gagal dihapus."); }
  };

  const removeReview = async (id) => {
    if (!window.confirm("Hapus ulasan ini dari TRIPIN?")) return;
    try { await api.delete(`/admin/reviews/${id}`); toast.success("Ulasan dihapus."); await loadDashboard(); }
    catch (error) { toast.error(error.response?.data?.message || "Ulasan gagal dihapus."); }
  };

  const statsCards = [
    { label: "Total destinasi", value: stats?.totalDestinations ?? "—", icon: BarChart3 },
    { label: "Destinasi publik", value: stats?.publishedDestinations ?? "—", icon: CheckCircle2 },
    { label: "Pengguna", value: stats?.totalUsers ?? "—", icon: Users },
    { label: "Total ulasan", value: stats?.totalReviews ?? "—", icon: MessageSquare }
  ];

  return (
    <div className="page-container py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">TRIPIN CONTROL CENTER</span><h1 className="heading-lg mt-3 text-slate-900">Admin dashboard</h1><p className="mt-2 text-sm text-slate-500">Kelola destinasi, kategori, dan moderasi ulasan TRIPIN.</p></div><button onClick={loadDashboard} className="btn-secondary">Refresh data</button></div>
      {loading && !stats ? <LoadingState /> : <>
        <div className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statsCards.map(({ label, value, icon: Icon }) => <div className="surface flex items-center gap-4 p-5" key={label}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={22} /></span><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p></div></div>)}</div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[["destinations","Destinasi"],["categories","Kategori"],["reviews","Ulasan"]].map(([key,label]) => <button key={key} onClick={() => setTab(key)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === key ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{label}</button>)}
        </div>

        {tab === "destinations" && <div className="grid items-start gap-6 xl:grid-cols-[390px_1fr]">
          <form onSubmit={submitDestination} className="surface space-y-3 p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold text-slate-900">{editingId ? "Edit destinasi" : "Tambah destinasi"}</h2>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="text-slate-400"><X size={17} /></button>}</div>
            <label className="block text-xs font-bold text-slate-600">Nama destinasi</label><input className="field" value={form.name} onChange={(e) => updateField("name", e.target.value)} required minLength={2} />
            <label className="block text-xs font-bold text-slate-600">Kategori</label><select className="field" value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} required><option value="">Pilih kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}</select>
            <label className="block text-xs font-bold text-slate-600">Deskripsi</label><textarea className="field min-h-24" value={form.description} onChange={(e) => updateField("description", e.target.value)} />
            <label className="block text-xs font-bold text-slate-600">Alamat</label><input className="field" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
            <label className="block text-xs font-bold text-slate-600">Kecamatan</label><input className="field" value={form.district} onChange={(e) => updateField("district", e.target.value)} />
            <div className="grid grid-cols-2 gap-3"><div><label className="mb-1 block text-xs font-bold text-slate-600">Harga minimum</label><input type="number" min="0" className="field" value={form.price_min} onChange={(e) => updateField("price_min", e.target.value)} /></div><div><label className="mb-1 block text-xs font-bold text-slate-600">Harga maksimum</label><input type="number" min="0" className="field" value={form.price_max} onChange={(e) => updateField("price_max", e.target.value)} /></div></div>
            <label className="block text-xs font-bold text-slate-600">Jam operasional</label><input className="field" value={form.opening_hours} onChange={(e) => updateField("opening_hours", e.target.value)} placeholder="Isi hanya setelah diverifikasi" />
            <label className="block text-xs font-bold text-slate-600">URL gambar</label><input type="url" className="field" value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." />
            <div className="grid grid-cols-2 gap-3"><div><label className="mb-1 block text-xs font-bold text-slate-600">Latitude</label><input type="number" step="any" className="field" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} /></div><div><label className="mb-1 block text-xs font-bold text-slate-600">Longitude</label><input type="number" step="any" className="field" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} /></div></div>
            <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700"><input type="checkbox" checked={form.is_published} onChange={(e) => updateField("is_published", e.target.checked)} /> Publikasikan destinasi (pastikan data sudah diverifikasi)</label>
            <button disabled={saving} className="btn-primary w-full" type="submit">{editingId ? <Save size={16} /> : <Plus size={16} />}{saving ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Tambah destinasi"}</button>
          </form>
          <div className="surface overflow-hidden">
            <div className="border-b border-slate-100 p-5"><h2 className="font-extrabold text-slate-900">Daftar destinasi</h2><p className="mt-1 text-xs text-slate-500">{destinations.length} data, termasuk draft</p></div>
            {destinations.length ? <div className="divide-y divide-slate-100">{destinations.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-slate-900">{item.name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.is_published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{item.is_published ? "Published" : "Draft"}</span></div><p className="mt-1 text-xs text-slate-500">{item.category_name} · {item.district || "Lokasi belum diisi"}</p></div>
              <div className="flex items-center gap-2"><button onClick={() => editDestination(item)} className="rounded-lg border border-slate-200 p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit"><Edit3 size={15} /></button><button onClick={() => removeDestination(item.id)} className="rounded-lg border border-slate-200 p-2 text-rose-500 hover:bg-rose-50" aria-label="Hapus"><Trash2 size={15} /></button></div>
            </div>)}</div> : <div className="p-5"><EmptyState title="Belum ada destinasi" description="Tambahkan destinasi melalui formulir di samping." /></div>}
          </div>
        </div>}

        {tab === "categories" && <div className="grid items-start gap-6 md:grid-cols-[360px_1fr]">
          <form onSubmit={saveCategory} className="surface space-y-3 p-5"><h2 className="mb-2 flex items-center gap-2 font-extrabold text-slate-900"><FolderPlus size={18} /> {editingCategoryId ? "Edit kategori" : "Tambah kategori"}</h2><label className="block text-xs font-bold text-slate-600">Nama kategori</label><input className="field" value={categoryForm.category_name} onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })} required minLength={2} /><label className="block text-xs font-bold text-slate-600">Deskripsi</label><textarea className="field min-h-24" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /><div className="flex gap-2"><button className="btn-primary flex-1" type="submit"><Save size={16} /> {editingCategoryId ? "Simpan perubahan" : "Tambah kategori"}</button>{editingCategoryId && <button type="button" className="btn-secondary" onClick={() => { setEditingCategoryId(null); setCategoryForm({ category_name: "", description: "" }); }}>Batal</button>}</div></form>
          <div className="surface divide-y divide-slate-100">{categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 p-5"><div><strong className="text-sm text-slate-900">{category.category_name}</strong><p className="mt-1 text-xs text-slate-500">{category.description}</p><span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">{category.destination_count || 0} tempat</span></div><div className="flex gap-2"><button onClick={() => editCategory(category)} className="rounded-lg border border-slate-200 p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit kategori"><Edit3 size={15} /></button><button onClick={() => removeCategory(category.id)} className="rounded-lg border border-slate-200 p-2 text-rose-500 hover:bg-rose-50" aria-label="Hapus kategori"><Trash2 size={15} /></button></div></div>)}</div>
        </div>}

        {tab === "reviews" && <div className="surface divide-y divide-slate-100">{reviews.length ? reviews.map((review) => <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 p-5"><div className="min-w-0"><strong className="text-sm text-slate-900">{review.user_name}</strong><p className="mt-1 text-xs text-blue-600">{review.destination_name} · {review.rating}/5</p><p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p></div><button onClick={() => removeReview(review.id)} className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50" aria-label="Moderasi ulasan"><Trash2 size={16} /></button></div>) : <div className="p-5"><EmptyState title="Belum ada ulasan" /></div>}</div>}
      </>}
    </div>
  );
}
