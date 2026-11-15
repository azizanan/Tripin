import { Compass, HeartHandshake, MapPinned, SearchCheck } from "lucide-react";

const pillars = [
  { icon: SearchCheck, title: "Informasi terpusat", description: "Menyatukan rekomendasi destinasi, kuliner, sejarah, penginapan, dan ruang kreatif dalam satu platform." },
  { icon: MapPinned, title: "Eksplorasi lebih mudah", description: "Membantu pengguna menemukan tempat berdasarkan kategori, lokasi, dan kebutuhan perjalanan." },
  { icon: HeartHandshake, title: "Dukung lokal", description: "Membuka ruang promosi bagi tempat dan pelaku usaha lokal agar lebih mudah ditemukan." }
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0b1d3b] to-blue-800 py-20 text-white">
        <div className="page-container"><span className="text-xs font-extrabold tracking-[.2em] text-blue-200">ABOUT TRIPIN</span><h1 className="heading-xl mt-5 max-w-3xl text-white">Explore More,<br /><span className="text-blue-300">Discover Surabaya.</span></h1><p className="mt-6 max-w-2xl text-sm leading-8 text-blue-100/80">TRIPIN hadir sebagai platform digital yang membantu masyarakat lokal dan wisatawan menemukan berbagai tempat menarik di Kota Surabaya melalui informasi yang mudah dijelajahi.</p></div>
      </section>
      <section className="page-container section-space">
        <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div><span className="eyebrow">OUR STORY</span><h2 className="heading-lg mt-3 text-slate-900">Satu kota, begitu banyak cerita.</h2></div>
          <div className="space-y-4 text-sm leading-8 text-slate-600"><p>Surabaya memiliki beragam destinasi wisata, tempat bersejarah, kuliner, tempat nongkrong, coworking space, dan penginapan. Namun, informasi mengenai berbagai tempat tersebut sering tersebar di banyak sumber.</p><p>TRIPIN dikembangkan untuk membantu pengguna menemukan rekomendasi dalam satu platform. Pengguna dapat menjelajahi kategori, mencari tempat, melihat informasi destinasi, membaca ulasan, dan menyimpan tempat favorit.</p><p>TRIPIN juga bertujuan memberi ruang bagi pelaku usaha dan pengelola tempat lokal untuk memperkenalkan destinasi mereka kepada audiens yang lebih luas.</p></div>
        </div>
      </section>
      <section className="bg-white py-20"><div className="page-container"><span className="eyebrow">WHAT WE DO</span><h2 className="heading-lg mt-3 text-slate-900">Membuat eksplorasi lebih bermakna</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{pillars.map(({ icon: Icon, title, description }) => <article className="surface p-6" key={title}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={23} /></span><h3 className="mt-5 font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{description}</p></article>)}</div></div></section>
      <section className="page-container py-20 text-center"><span className="eyebrow">START YOUR JOURNEY</span><h2 className="heading-lg mt-3 text-slate-900">Surabaya menunggumu untuk dijelajahi.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">Mulai temukan tempat yang ingin kamu kunjungi dan bagikan ceritamu bersama komunitas TRIPIN.</p><a href="/explore" className="btn-primary mt-6">Jelajahi destinasi <Compass size={17} /></a></section>
    </div>
  );
}
