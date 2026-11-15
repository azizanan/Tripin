import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Compass, Coffee, Gem, Hotel, Landmark, MapPin, Search, Sparkles, Trees, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import DestinationCard from "../components/DestinationCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

const categoryIcons = [Coffee, Trees, Utensils, Hotel, Landmark, Gem, BriefcaseBusiness];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/categories"),
      api.get("/destinations", { params: { limit: 6, sort: "rating" } })
    ]).then(([categoryResponse, destinationResponse]) => {
      if (!active) return;
      setCategories(categoryResponse.data.data || []);
      setDestinations(destinationResponse.data.data || []);
    }).catch(() => {
      if (active) toast.error("Data TRIPIN belum dapat dimuat. Pastikan backend dan database aktif.");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b1d3b] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,rgba(37,99,235,.45),transparent_42%),linear-gradient(115deg,#0b1d3b,#123b70)]" />
        <div className="absolute -right-24 top-12 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 top-24 -z-10 h-56 w-56 rounded-full border border-white/10" />
        <div className="page-container grid min-h-[570px] items-center gap-10 py-20 lg:grid-cols-[1.15fr_.85fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-blue-100">
              <Sparkles size={14} /> YOUR CITY, YOUR STORY
            </div>
            <h1 className="heading-xl max-w-2xl text-white">Explore More,<br /><span className="text-blue-300">Discover Surabaya.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/80">Temukan tempat wisata, kuliner, ruang kreatif, dan sudut tersembunyi Kota Pahlawan dalam satu panduan eksplorasi.</p>
            <form onSubmit={submitSearch} className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-blue-950/20 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 text-slate-400">
                <Search size={19} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Cari tempat atau aktivitas..." aria-label="Cari destinasi" className="min-w-0 flex-1 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              </div>
              <button className="btn-primary !rounded-xl !px-6" type="submit">Cari Destinasi <ArrowRight size={17} /></button>
            </form>
            <div className="mt-6 flex flex-wrap gap-5 text-xs font-medium text-blue-100/75">
              <span className="flex items-center gap-2"><MapPin size={14} /> Surabaya, Jawa Timur</span>
              <span className="flex items-center gap-2"><Compass size={14} /> Local discovery guide</span>
            </div>
          </div>

          <div className="relative hidden min-h-[390px] items-center justify-center lg:flex">
            <div className="absolute h-[330px] w-[330px] rounded-full border border-white/15" />
            <div className="absolute h-[250px] w-[250px] rounded-full border border-white/15" />
            <div className="relative grid h-[270px] w-[270px] place-items-center rounded-[42%_58%_54%_46%/45%_42%_58%_55%] border border-white/20 bg-gradient-to-br from-blue-400/40 to-indigo-900/50 shadow-2xl shadow-black/20">
              <Compass size={104} strokeWidth={1} className="text-blue-100" />
              <span className="absolute -right-7 top-10 rounded-2xl bg-white px-4 py-3 text-xs font-extrabold text-blue-900 shadow-xl">Explore local</span>
              <span className="absolute -bottom-5 -left-8 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-extrabold text-white shadow-xl">Discover more</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="page-container flex flex-wrap justify-between gap-3 py-4 text-[10px] font-bold tracking-[.18em] text-blue-100/60"><span>EXPLORE THE CITY</span><span>HISTORY · CULINARY · CULTURE · HIDDEN GEMS</span></div>
        </div>
      </section>

      <section className="page-container section-space">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><span className="eyebrow">TEMUKAN MINATMU</span><h2 className="heading-lg mt-3 text-slate-900">Jelajahi berdasarkan kategori</h2><p className="mt-2 text-sm text-slate-500">Pilih pengalaman yang ingin kamu temukan di Surabaya.</p></div>
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">Semua kategori <ArrowUpRight size={16} /></Link>
        </div>
        {loading ? <LoadingState label="Memuat kategori..." /> : categories.length === 0 ? <EmptyState title="Kategori belum tersedia" description="Kategori akan muncul setelah database diisi." /> : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              return <Link key={category.id} to={`/categories/${category.id}`} className="group rounded-2xl border border-slate-100 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft">
                <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"><Icon size={21} /></span>
                <span className="block text-xs font-extrabold leading-5 text-slate-800">{category.category_name}</span>
                <span className="mt-1 block text-[10px] text-slate-400">{category.destination_count || 0} tempat</span>
              </Link>;
            })}
          </div>
        )}
      </section>

      <section className="bg-white py-20">
        <div className="page-container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><span className="eyebrow">PILIHAN UNTUKMU</span><h2 className="heading-lg mt-3 text-slate-900">Destinasi pilihan</h2><p className="mt-2 text-sm text-slate-500">Rekomendasi dari data destinasi TRIPIN yang telah dipublikasikan.</p></div>
            <Link to="/explore" className="btn-secondary">Lihat semua <ArrowRight size={16} /></Link>
          </div>
          {loading ? <LoadingState /> : destinations.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div>
          ) : <EmptyState title="Destinasi sedang disiapkan" description="Tempat yang dikirimkan ke TRIPIN akan tampil setelah informasi dasarnya diverifikasi dan dipublikasikan." />}
        </div>
      </section>

      <section className="page-container py-20">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-12 text-white md:px-14 md:py-14">
          <span className="text-xs font-extrabold tracking-[.2em] text-blue-200">YOUR NEXT STORY STARTS HERE</span>
          <div className="mt-4 flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
            <div><h2 className="heading-lg max-w-xl text-white">Jangan hanya melewati Surabaya. Kenali setiap sudutnya.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80">Temukan pengalaman baru, dukung tempat lokal, dan buat perjalananmu lebih bermakna.</p></div>
            <Link to="/explore" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-700 hover:bg-blue-50">Mulai eksplorasi <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
