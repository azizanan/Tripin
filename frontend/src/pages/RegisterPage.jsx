import { ArrowRight, Compass, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success("Akun TRIPIN berhasil dibuat.");
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registrasi gagal. Coba kembali.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-container grid min-h-[75vh] items-center py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md px-2 lg:px-12">
        <span className="eyebrow">JOIN THE COMMUNITY</span>
        <h1 className="heading-lg mt-3 text-slate-900">Buat akun TRIPIN</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">Daftar untuk menyimpan destinasi dan berbagi pengalaman di Surabaya.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div><label className="mb-2 block text-xs font-bold text-slate-600">Nama lengkap</label><div className="relative"><UserRound size={17} className="absolute left-3 top-3.5 text-slate-400" /><input autoComplete="name" className="field !pl-10" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} maxLength={100} required placeholder="Nama kamu" /></div></div>
          <div><label className="mb-2 block text-xs font-bold text-slate-600">Email</label><div className="relative"><Mail size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type="email" autoComplete="email" className="field !pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="nama@email.com" /></div></div>
          <div><label className="mb-2 block text-xs font-bold text-slate-600">Password</label><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type="password" autoComplete="new-password" className="field !pl-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required placeholder="Minimal 8 karakter" /></div></div>
          <p className="text-xs leading-5 text-slate-400">Dengan mendaftar, akun akan dibuat sebagai pengguna biasa. Hak admin hanya dapat diberikan melalui proses server.</p>
          <button disabled={submitting} className="btn-primary w-full !py-3.5" type="submit">{submitting ? "Membuat akun..." : "Buat akun"} <ArrowRight size={17} /></button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link to="/login" className="font-extrabold text-blue-600">Login</Link></p>
      </div>
      <div className="hidden rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-900 p-12 text-white lg:block">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><Compass size={28} /></span>
        <p className="mt-10 text-xs font-extrabold tracking-[.2em] text-blue-200">EXPLORE MORE</p>
        <h2 className="heading-lg mt-4 max-w-md text-white">Temukan tempat baru, buat cerita baru.</h2>
        <p className="mt-5 max-w-md text-sm leading-8 text-blue-100/80">Simpan tempat yang ingin kamu kunjungi dan bantu komunitas dengan ulasan berdasarkan pengalaman nyata.</p>
      </div>
    </div>
  );
}
