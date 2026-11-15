import { ArrowLeft, Clock3, ExternalLink, Heart, MapPin, MessageCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

const rupiah = (value) => value == null ? "Belum tersedia" :
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const loadReviews = async () => {
    const response = await api.get(`/reviews/${id}`);
    setReviews(response.data.data || []);
  };

  useEffect(() => {
    let active = true;
    Promise.all([api.get(`/destinations/${id}`), api.get(`/reviews/${id}`)]).then(([destinationResponse, reviewResponse]) => {
      if (!active) return;
      setDestination(destinationResponse.data.data);
      setReviews(reviewResponse.data.data || []);
    }).catch(() => toast.error("Informasi destinasi gagal dimuat."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!user) { setFavorite(false); return; }
    api.get("/favorites").then((r) => {
      setFavorite((r.data.data || []).some((item) => Number(item.id) === Number(id)));
    }).catch(() => {});
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) { toast("Login untuk menyimpan destinasi."); return; }
    try {
      if (favorite) {
        await api.delete(`/favorites/${id}`);
        setFavorite(false);
        toast.success("Dihapus dari favorit.");
      } else {
        await api.post("/favorites", { destination_id: Number(id) });
        setFavorite(true);
        toast.success("Ditambahkan ke favorit.");
      }
    } catch (error) { toast.error(error.response?.data?.message || "Favorit gagal diperbarui."); }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews", { destination_id: Number(id), rating, comment });
      setComment("");
      await loadReviews();
      toast.success("Ulasan berhasil dikirim.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ulasan gagal dikirim.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-container py-12"><LoadingState /></div>;
  if (!destination) return <div className="page-container py-12"><EmptyState title="Destinasi tidak ditemukan" description="Destinasi mungkin belum dipublikasikan atau alamat halaman tidak valid." /></div>;

  const mapQuery = destination.latitude != null && destination.longitude != null
    ? `${destination.latitude},${destination.longitude}`
    : destination.address || destination.name + ", Surabaya";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const ratingValue = Number(destination.average_rating || 0);

  return (
    <div className="page-container py-10">
      <Link to="/explore" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Kembali ke Explore</Link>
      <div className="grid gap-9 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="overflow-hidden rounded-[26px] bg-slate-100">
            {destination.image ? <img src={destination.image} alt={destination.name} className="h-[340px] w-full object-cover sm:h-[460px]" /> : <div className="grid h-[340px] place-items-center text-sm text-slate-400 sm:h-[460px]">Foto destinasi belum tersedia</div>}
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{destination.category_name}</span><span className="text-xs text-slate-400">Surabaya, Jawa Timur</span></div>
            <h1 className="heading-lg mt-4 text-slate-900">{destination.name}</h1>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">{destination.description || "Deskripsi destinasi belum tersedia."}</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="surface flex gap-3 p-4"><MapPin className="mt-0.5 shrink-0 text-blue-600" size={19} /><div><p className="text-xs font-bold text-slate-500">Alamat / Lokasi</p><p className="mt-1 text-sm font-semibold text-slate-800">{destination.address || destination.district || "Belum tersedia"}</p></div></div>
            <div className="surface flex gap-3 p-4"><Clock3 className="mt-0.5 shrink-0 text-blue-600" size={19} /><div><p className="text-xs font-bold text-slate-500">Jam operasional</p><p className="mt-1 text-sm font-semibold text-slate-800">{destination.opening_hours || "Belum tersedia"}</p></div></div>
            <div className="surface flex gap-3 p-4"><Star className="mt-0.5 shrink-0 text-amber-500" size={19} /><div><p className="text-xs font-bold text-slate-500">Rating pengunjung</p><p className="mt-1 text-sm font-semibold text-slate-800">{ratingValue ? ratingValue.toFixed(1) : "Belum ada rating"} · {destination.review_count || 0} ulasan</p></div></div>
            <div className="surface flex gap-3 p-4"><MessageCircle className="mt-0.5 shrink-0 text-blue-600" size={19} /><div><p className="text-xs font-bold text-slate-500">Estimasi harga</p><p className="mt-1 text-sm font-semibold text-slate-800">{destination.price_min != null ? rupiah(destination.price_min) : "Belum tersedia"}{destination.price_max != null ? ` – ${rupiah(destination.price_max)}` : ""}</p></div></div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {destination.latitude != null && destination.longitude != null ? <iframe title="Peta lokasi destinasi" src={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}&output=embed`} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="flex h-36 items-center justify-center text-sm text-slate-500">Koordinat peta belum tersedia.</div>}
            <div className="flex items-center justify-between gap-3 bg-white p-4"><span className="text-xs text-slate-500">Lokasi pada Google Maps</span><a className="inline-flex items-center gap-2 text-xs font-bold text-blue-600" href={mapLink} target="_blank" rel="noreferrer">Buka navigasi <ExternalLink size={14} /></a></div>
          </div>
        </div>

        <aside>
          <div className="surface sticky top-24 p-6">
            <div className="flex items-center justify-between"><span className="eyebrow">DESTINATION INFO</span><button onClick={toggleFavorite} className={`rounded-xl border p-3 ${favorite ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-200 text-slate-500"}`} aria-label="Favorit"><Heart size={18} fill={favorite ? "currentColor" : "none"} /></button></div>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">Bagikan pengalamanmu</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Rating destinasi dihitung dari ulasan pengguna TRIPIN.</p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4"><Star size={25} fill="currentColor" className="text-amber-500" /><div><strong className="text-xl text-slate-900">{ratingValue ? ratingValue.toFixed(1) : "—"}</strong><p className="text-xs text-slate-500">{reviews.length} ulasan</p></div></div>
            <div className="my-6 border-t border-slate-100" />
            <h3 className="font-extrabold text-slate-900">Tulis ulasan</h3>
            {user ? <form onSubmit={submitReview} className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-600">Rating</label>
              <select className="field" value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} bintang</option>)}</select>
              <label className="block text-xs font-bold text-slate-600">Pengalaman kamu</label>
              <textarea className="field min-h-28 resize-y" value={comment} onChange={(e) => setComment(e.target.value)} minLength={3} maxLength={2000} placeholder="Ceritakan pengalamanmu..." required />
              <button disabled={submitting} className="btn-primary w-full" type="submit">{submitting ? "Mengirim..." : "Kirim ulasan"}</button>
            </form> : <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Login untuk memberikan ulasan. <Link to="/login" className="font-extrabold underline">Login sekarang</Link></div>}
          </div>
        </aside>
      </div>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between"><div><span className="eyebrow">COMMUNITY VOICES</span><h2 className="heading-lg mt-2 text-slate-900">Ulasan pengunjung</h2></div><span className="text-xs text-slate-500">{reviews.length} ulasan</span></div>
        {reviews.length ? <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <article className="surface p-5" key={review.id}>
          <div className="flex items-center justify-between gap-3"><strong className="text-sm text-slate-900">{review.user_name}</strong><span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Star size={13} fill="currentColor" /> {review.rating}/5</span></div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
          <p className="mt-3 text-[11px] text-slate-400">{new Date(review.created_at).toLocaleDateString("id-ID")}</p>
        </article>)}</div> : <EmptyState title="Belum ada ulasan" description="Jadilah orang pertama yang membagikan pengalaman di tempat ini." />}
      </section>
    </div>
  );
}
