import { Compass, Heart, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="page-container flex h-[76px] items-center justify-between gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><Compass size={22} /></span>
          <span className="font-extrabold tracking-[.15em] text-slate-900">TRIPIN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `text-sm font-semibold transition ${isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="btn-secondary !rounded-full !px-3 !py-2"><UserRound size={16} /> {user.name}</Link>
              {user.role === "admin" && <Link to="/admin" className="btn-secondary !rounded-full !px-3 !py-2">Admin</Link>}
              <button onClick={signOut} className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Logout"><LogOut size={18} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="btn-primary !rounded-full !px-5">Register</Link>
            </>
          )}
        </div>

        <button className="rounded-lg p-2 text-slate-700 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Buka menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 md:hidden">
          <nav className="page-container flex flex-col gap-4">
            {navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-600">{item.label}</NavLink>)}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold"><UserRound size={16} /> Profil</Link>
                {user.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold">Admin dashboard</Link>}
                <button onClick={signOut} className="flex items-center gap-2 text-left text-sm font-semibold text-red-600"><LogOut size={16} /> Logout</button>
              </>
            ) : (
              <div className="flex gap-3"><Link to="/login" onClick={() => setOpen(false)} className="btn-secondary">Login</Link><Link to="/register" onClick={() => setOpen(false)} className="btn-primary">Register</Link></div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
