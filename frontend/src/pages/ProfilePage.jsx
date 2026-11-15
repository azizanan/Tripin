import { Heart, MessageCircle, Save, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DestinationCard from "../components/DestinationCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [favoriteResponse, reviewResponse] = await Promise.all([
        api.get("/favorites"),
        api.get("/reviews/mine")
      ]);
      setFavorites(favoriteResponse.data.data || []);
      setReviews(reviewResponse.data.data || []);
    } catch {
      toast.error("Data profil belum dapat dimuat.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/profile", { name });
      await refreshProfile();
      toast.success("Profil berhasil diperbarui.");
    } catch (error) { toast.error(error.response?.data?.message || "Profil gagal diperbarui."); }
    finally { setSaving(false); }
  };

  const removeFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites((items) => items.filter((item) => Number(item.id) !== Number(id)));
      toast.success("Destinasi dihapus dari favorit.");
    } catch (error) { toast.error(error.response?.data?.message || "Gagal menghapus favorit."); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Hapus ulasan ini?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((items) => items.filter((item) => item.id !== id));
      toast.success("Ulasan berhasil dihapus.");
    } catch (error) { toast.error(error.response?.data?.message || "Ulasan gagal dihapus."); }
  };

  return (
    <div className="page-container py-12">
      <div className="mb-9"><span className="eyebrow">MY ACCOUNT</span><h1 className="heading-lg mt-3 text-slate-900">Profil pengguna</h1><p className="mt-2 text-sm text-slate-500">Kelola informasi akun, tempat favorit, dan ulasanmu.</p></div>
      <div className="grid items-start gap-7 lg:grid-cols-[320px_1fr]">
        <aside className="surface p-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-50 text-blue-600"><UserRound size={34} /></div>
          <h2 className="mt-4 text-center text-lg font-extrabold text-slate-900">{user?.name}</h2>
          <p className="mt-1 text-center text-xs text-slate-500">{user?.email}</p>
          <span className="mx-auto mt-3 block w-fit rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase text-blue-700">{user?.role}</span>
          <form onSubmit={saveProfile} className="mt-7 border-t border-slate-100 pt-6">
            <label className="mb-2 block text-xs font-bold text-slate-600">Nama tampilan</label>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={100} required />
            <button disabled={saving} className="btn-primary mt-4 w-full" type="submit"><Save size={15} /> {saving ? "Menyimpan..." : "Simpan profil"}</button>
          </form>
        </aside>

        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900"><Heart size={19} className="text-rose-500" /> Destinasi favorit</h2><span className="text-xs text-slate-500">{favorites.length} tempat</span></div>
            {loading ? <LoadingState /> : favorites.length ? <div className="grid gap-5 sm:grid-cols-2">{favorites.map((item) => <DestinationCard key={item.id} destination={item} favorite onFavorite={removeFavorite} />)}</div> : <EmptyState title="Belum ada destinasi favorit" description="Simpan destinasi yang menarik perhatianmu untuk melihatnya kembali di sini." />}
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900"><MessageCircle size={19} className="text-blue-600" /> Riwayat ulasan</h2><span className="text-xs text-slate-500">{reviews.length} ulasan</span></div>
            {loading ? <LoadingState /> : reviews.length ? <div className="space-y-3">{reviews.map((review) => <article key={review.id} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">{review.destination_name}</h3><span className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500"><Star size={13} fill="currentColor" /> {review.rating}/5</span></div><button onClick={() => deleteReview(review.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus ulasan</button></div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p><p className="mt-3 text-[11px] text-slate-400">{new Date(review.created_at).toLocaleDateString("id-ID")}</p>
            </article>)}</div> : <EmptyState title="Belum ada ulasan" description="Ulasan yang kamu kirim pada halaman destinasi akan tercatat di sini." />}
          </section>
        </div>
      </div>
    </div>
  );
}
