import { useMemo, useState } from "react";

const categories = [
  { name: "Semua", icon: "✦" },
  { name: "Wisata", icon: "🏛️" },
  { name: "Kuliner", icon: "🍜" },
  { name: "Nongkrong", icon: "☕" },
  { name: "Sejarah", icon: "🏺" },
  { name: "Penginapan", icon: "🛏️" },
];

const places = [
  {
    id: 1,
    name: "Tugu Pahlawan",
    category: "Sejarah",
    area: "Alun-alun Contong",
    description: "Ikon bersejarah yang menjadi saksi perjuangan arek-arek Suroboyo.",
    image: "https://images.unsplash.com/photo-1565060169194-19fabf630121?auto=format&fit=crop&w=900&q=85",
    tag: "Ikonik",
  },
  {
    id: 2,
    name: "Kebun Binatang Surabaya",
    category: "Wisata",
    area: "Wonokromo",
    description: "Destinasi wisata keluarga dengan beragam koleksi satwa.",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=85",
    tag: "Family friendly",
  },
  {
    id: 3,
    name: "Rawon Setan",
    category: "Kuliner",
    area: "Embong Malang",
    description: "Nikmati kuliner khas Surabaya dengan cita rasa rawon yang kaya.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    tag: "Kuliner lokal",
  },
  {
    id: 4,
    name: "Kota Lama Surabaya",
    category: "Sejarah",
    area: "Krembangan",
    description: "Jelajahi sudut kota dengan bangunan kolonial dan suasana klasik.",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
    tag: "Hidden gem",
  },
  {
    id: 5,
    name: "Kafe Tepi Kota",
    category: "Nongkrong",
    area: "Surabaya Barat",
    description: "Tempat santai untuk bertemu teman dan menikmati waktu luang.",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
    tag: "Chill spot",
  },
  {
    id: 6,
    name: "Hotel Majapahit",
    category: "Penginapan",
    area: "Tunjungan",
    description: "Penginapan bersejarah dengan arsitektur klasik yang elegan.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85",
    tag: "Heritage stay",
  },
];

function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filteredPlaces = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return places.filter((place) => {
      const matchesCategory = activeCategory === "Semua" || place.category === activeCategory;
      const matchesSearch =
        !keyword ||
        place.name.toLowerCase().includes(keyword) ||
        place.area.toLowerCase().includes(keyword) ||
        place.category.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="TRIPIN home">
          <span className="brand-mark">T</span>
          <span>TRIPIN</span>
        </a>
        <nav className="nav-links" aria-label="Navigasi utama">
          <a className="nav-active" href="#home">Beranda</a>
          <a href="#explore">Jelajahi</a>
          <a href="#about">Tentang</a>
        </nav>
        <a className="nav-cta" href="#explore">Mulai eksplorasi <span>↗</span></a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-kicker"><span /> TEMUKAN CERITA DI SETIAP SUDUT KOTA</div>
            <h1>Surabaya punya banyak cerita.<br /><em>Temukan versimu.</em></h1>
            <p className="hero-copy">
              Dari sudut bersejarah hingga tempat nongkrong kekinian,
              temukan inspirasi perjalananmu dalam satu tempat.
            </p>
            <form className="search-box" onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
            }}>
              <span className="search-icon">⌕</span>
              <input
                aria-label="Cari tempat atau kategori"
                placeholder="Cari tempat, kuliner, atau aktivitas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit">Cari tempat <span>→</span></button>
            </form>
            <div className="hero-note"><span>✦</span> Panduan eksplorasi lokal untuk semua orang</div>
          </div>
          <div className="hero-bottom"><span>SURABAYA, JAWA TIMUR</span><span>07° 15′ LS · 112° 45′ BT</span></div>
        </section>

        <section className="category-section section-wrap" aria-label="Kategori destinasi">
          <div className="section-heading compact-heading">
            <div><span className="eyebrow">MULAI DARI SINI</span><h2>Apa yang ingin kamu temukan?</h2></div>
            <p>Pilih kategori dan temukan tempat yang cocok dengan suasana hatimu.</p>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button
                className={activeCategory === category.name ? "category-chip selected" : "category-chip"}
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                type="button"
              >
                <span>{category.icon}</span>{category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="explore-section section-wrap" id="explore">
          <div className="section-heading">
            <div><span className="eyebrow">PILIHAN UNTUKMU</span><h2>Jelajahi Surabaya</h2></div>
            <p>Rekomendasi tempat untuk mengisi cerita perjalananmu berikutnya.</p>
          </div>
          <div className="results-line">
            <span>{filteredPlaces.length} tempat ditemukan</span>
            <span>Menampilkan rekomendasi pilihan</span>
          </div>
          {filteredPlaces.length > 0 ? (
            <div className="place-grid">
              {filteredPlaces.map((place) => (
                <article className="place-card" key={place.id}>
                  <div className="place-image-wrap">
                    <img src={place.image} alt={place.name} loading="lazy" />
                    <span className="place-tag">{place.tag}</span>
                    <button className="save-button" type="button" aria-label={`Simpan ${place.name}`}>♡</button>
                  </div>
                  <div className="place-info">
                    <div className="place-meta"><span>{place.category}</span><span>Surabaya</span></div>
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    <div className="place-footer">
                      <span className="place-location">⌖ {place.area}</span>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Surabaya")}`} target="_blank" rel="noreferrer">Lihat lokasi ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span><h3>Tempat belum ditemukan</h3>
              <p>Coba kata kunci atau kategori lainnya.</p>
              <button type="button" onClick={() => { setSearch(""); setActiveCategory("Semua"); }}>Reset pencarian</button>
            </div>
          )}
        </section>

        <section className="discover-banner section-wrap" id="about">
          <div><span className="eyebrow">CERITA KOTA PAHLAWAN</span><h2>Jangan cuma lewat.<br /><em>Jelajahi lebih dekat.</em></h2></div>
          <a href="#explore">Temukan tempat favoritmu <span>↗</span></a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">T</span><span>TRIPIN</span></a>
        <p>Temukan cerita, pengalaman, dan tempat menarik di Surabaya.</p>
        <span className="copyright">© 2026 TRIPIN. Explore Surabaya.</span>
      </footer>
    </div>
  );
}

export default App;
