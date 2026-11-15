import { Compass, Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="page-container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-3 text-xl font-extrabold tracking-[.15em] text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600"><Compass size={21} /></span>TRIPIN
          </Link>
          <p className="max-w-sm text-sm leading-7 text-slate-400">Explore More, Discover Surabaya. Temukan cerita, pengalaman, dan tempat menarik di Kota Pahlawan.</p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Explore</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/explore" className="hover:text-white">Semua Destinasi</Link>
            <Link to="/categories" className="hover:text-white">Kategori</Link>
            <Link to="/about" className="hover:text-white">Tentang TRIPIN</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Kontak</h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-2"><MapPin size={16} /> Surabaya, Jawa Timur</span>
            <a href="mailto:hello@tripin.id" className="flex items-center gap-2 hover:text-white"><Mail size={16} /> hello@tripin.id</a>
            <span className="flex items-center gap-2"><Instagram size={16} /> @tripin.surabaya</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} TRIPIN. Explore More, Discover Surabaya.</div>
    </footer>
  );
}
