import { ArrowRight, Compass, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      toast.success("Login berhasil. Selamat datang kembali!");
      const target = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/profile");
      navigate(target, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal. Periksa koneksi API.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-container grid min-h-[75vh] items-center py-12 lg:grid-cols-2">
      <div className="hidden rounded-[28px] bg-gradient-to-br from-[#102d59] to-blue-700 p-12 text-white lg:block">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><Compass size={28} /></span>
        <p className="mt-10 text-xs font-extrabold tracking-[.2em] text-blue-200">WELCOME BACK TO TRIPIN</p>
        <h1 className="heading-lg mt-4 max-w-md text-white">Lanjutkan cerita eksplorasimu.</h1>
        <p className="mt-5 max-w-md text-sm leading-8 text-blue-100/80">Masuk untuk menyimpan tempat favorit, menulis ulasan, dan mengelola perjalanan eksplorasimu di Surabaya.</p>
      </div>
      <div className="mx-auto w-full max-w-md px-2 lg:px-12">
        <span className="eyebrow">ACCOUNT ACCESS</span>
        <h2 className="heading-lg mt-3 text-slate-900">Login ke TRIPIN</h2>
        <p className="mt-2 text-sm text-slate-500">Masukkan email dan password akun kamu.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div><label className="mb-2 block text-xs font-bold text-slate-600">Email</label><div className="relative"><Mail size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type="email" autoComplete="email" className="field !pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="nama@email.com" /></div></div>
          <div><label className="mb-2 block text-xs font-bold text-slate-600">Password</label><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400" /><input type="password" autoComplete="current-password" className="field !pl-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Masukkan password" /></div></div>
          <button disabled={submitting} className="btn-primary w-full !py-3.5" type="submit">{submitting ? "Memproses..." : "Login"} <ArrowRight size={17} /></button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Belum punya akun? <Link to="/register" className="font-extrabold text-blue-600">Daftar sekarang</Link></p>
      </div>
    </div>
  );
}
