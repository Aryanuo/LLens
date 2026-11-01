import { Link, useLocation } from 'react-router-dom';
import { Microscope, LayoutDashboard, Upload, History, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload Report', icon: Upload },
    { to: '/history', label: 'History & Trends', icon: History },
  ];

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-hidden">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-xs shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-950 transition-colors">
                  Lab<span className="text-teal-600">Lens</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 -mt-1 hidden sm:block">
                  Clinical AI Companion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4" aria-label="Main Navigation">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/analysis/demo"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50/80 px-3 py-2 rounded-lg border border-slate-200/70 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Demo Mode
            </Link>

            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs shadow-teal-600/20 hover:shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Decode Report</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex gap-1.5 py-2 overflow-x-auto border-t border-slate-100" aria-label="Mobile Navigation">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                {label}
              </Link>
            );
          })}
          <Link
            to="/analysis/demo"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-teal-700 bg-teal-50/50 hover:bg-teal-50"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
