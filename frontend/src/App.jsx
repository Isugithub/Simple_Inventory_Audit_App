import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Audit from "./pages/Audit";
import AuditReport from "./pages/AuditReport";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("inventory_auth_session");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (nextSession) => {
    localStorage.setItem("inventory_auth_token", nextSession.token);
    localStorage.setItem("inventory_auth_session", JSON.stringify(nextSession.user));
    setSession(nextSession.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("inventory_auth_token");
    localStorage.removeItem("inventory_auth_session");
    setSession(null);
  };

  if (!session) return <Login onLogin={handleLogin} />;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ "--sidebar-width": `${sidebarWidth}px` }}
    >
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        user={session}
        onLogout={handleLogout}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onWidthChange={setSidebarWidth}
      />
      <main className="app-main min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/report" element={<AuditReport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;