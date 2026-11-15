import { ArrowUpRight, Heart, MapPin, Star, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

const money = (value) => value === null || value === undefined ? null :
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

export default function DestinationCard({ destination, favorite = false, onFavorite }) {
  const rating = Number(destination.average_rating ?? destination.rating ?? 0);
  const hasPrice = destination.price_min !== null && destination.price_min !== undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {destination.image
          ? <img src={destination.image} alt={destination.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400"><ImageOff size={27} /><span className="text-xs">Foto belum tersedia</span></div>}
        {destination.category_name && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-blue-700 shadow-sm">{destination.category_name}</span>}
        {onFavorite && (
          <button type="button" onClick={() => onFavorite(destination.id)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-600 shadow-sm hover:text-rose-500" aria-label="Hapus dari favorit">
            <Heart size={17} fill={favorite ? "currentColor" : "none"} className={favorite ? "text-rose-500" : ""} />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="flex min-w-0 items-center gap-1"><MapPin size={13} className="shrink-0 text-blue-500" /><span className="truncate">{destination.district || destination.address || "Surabaya"}</span></span>
          <span className="flex shrink-0 items-center gap-1 font-bold text-amber-500"><Star size={13} fill="currentColor" /> {rating ? rating.toFixed(1) : "Baru"}</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900">{destination.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-6 text-slate-500">{destination.description || "Temukan informasi lebih lanjut tentang destinasi ini."}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-500">
            {hasPrice ? <><span className="font-bold text-slate-800">{money(destination.price_min)}</span>{destination.price_max != null && <span> – {money(destination.price_max)}</span>}</> : "Harga belum tersedia"}
          </div>
          <Link to={`/destinations/${destination.id}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800">Detail <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}
