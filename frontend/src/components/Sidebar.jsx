import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 420;

const Sidebar = ({ isOpen, onClose, onWidthChange }) => {
  const sidebarRef = useRef(null);
  const resizingRef = useRef(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!resizingRef.current) {
        return;
      }

      const width = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, event.clientX),
      );
      onWidthChange(width);
    };

    const stopResizing = () => {
      resizingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [onWidthChange]);

  const startResizing = (event) => {
    event.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleResizeKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const change = event.key === "ArrowLeft" ? -16 : 16;
      const currentWidth = sidebarRef.current?.getBoundingClientRect().width ?? 256;
      const width = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, currentWidth + change),
      );
      onWidthChange(width);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "📊",
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: "📦",
    },
    {
      name: "Audit",
      path: "/audit",
      icon: "🔍",
    },
    {
      name: "Audit Report",
      path: "/report",
      icon: "📋",
    },
  ];

  return (
    <>
    {isOpen && (
      <button
        aria-label="Close menu"
        className="sidebar-overlay fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        onClick={onClose}
        type="button"
      />
    )}
    <aside
      ref={sidebarRef}
      className={`app-sidebar fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* Logo */}
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true">
          IA
        </div>
        <button
          aria-label="Close menu"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <div className="brand-copy">
          <h1>Inventory Audit</h1>
          <p>Control center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">
          Main Menu
        </p>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "sidebar-link-active"
                    : ""
                }`
              }
            >
              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              <span className="sidebar-link-name">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
        onKeyDown={handleResizeKeyDown}
        onPointerDown={startResizing}
        role="separator"
        tabIndex={0}
        title="Drag to resize sidebar"
      />

      {/* Bottom Section */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <div className="sidebar-footer-icon" aria-hidden="true">✓</div>
          <div>
            <p className="sidebar-footer-title">Inventory Audit</p>
            <p className="sidebar-footer-subtitle">Stock management system</p>
          </div>
        </div>
      </div>

    </aside>
    </>
  );
};

export default Sidebar;