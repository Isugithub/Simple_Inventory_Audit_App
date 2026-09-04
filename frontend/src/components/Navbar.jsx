import { NavLink } from "react-router-dom";

const Navbar = ({ onMenuClick, user, onLogout }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Inventory",
      path: "/inventory",
    },
    {
      name: "Audit",
      path: "/audit",
    },
    {
      name: "Audit Report",
      path: "/report",
    },
  ];

  return (
    <nav className="app-navbar fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="navbar-avatar flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            IA
          </div>
          <button
            aria-label="Open menu"
            className="menu-button inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Inventory overview</p>
          </div>
        </div>
        <div className="navbar-links ml-auto hidden items-center justify-end gap-2 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar-link inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold leading-5 transition ${
                  isActive
                    ? "navbar-link-active"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {user && (
            <div className="navbar-user">
              <span>{user.email}</span>
              <button type="button" onClick={onLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;