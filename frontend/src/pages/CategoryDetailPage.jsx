import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import DestinationCard from "../components/DestinationCard";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get(`/categories/${id}/destinations`).then((r) => {
      if (!active) return;
      setCategory(r.data.category);
      setItems(r.data.data || []);
    }).catch(() => toast.error("Kategori atau destinasi gagal dimuat."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  return (
    <div className="page-container py-12">
      <Link to="/categories" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowLeft size={16} /> Semua kategori</Link>
      {loading ? <LoadingState /> : <>
        <span className="eyebrow">CATEGORY COLLECTION</span>
        <h1 className="heading-lg mt-3 text-slate-900">{category?.category_name || "Kategori"}</h1>
        <p className="mt-2 text-sm text-slate-500">{category?.description}</p>
        <div className="mt-8">{items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <DestinationCard key={item.id} destination={item} />)}</div> : <EmptyState title="Belum ada destinasi pada kategori ini" description="Tempat akan ditampilkan setelah admin menambahkan dan memublikasikannya." />}</div>
      </>}
    </div>
  );
}
