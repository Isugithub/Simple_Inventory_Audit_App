import { useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import AuditProgress from "../components/dashboard/AuditProgress";
import RecentAudits from "../components/dashboard/RecentAudits";
import QuickActions from "../components/dashboard/QuickActions";
import { getDashboard } from "../services/api";

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {
      setError(null);
      const response = await getDashboard();
      const dashboardData = response.data?.data || response.data;
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setError("The dashboard is temporarily unavailable. Check that the API is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6 sm:p-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-xl font-semibold">Unable to load dashboard</h1>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="dashboard-page min-h-screen p-5 sm:p-8 lg:p-10">
      <div className="mb-8 flex flex-col items-start gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-600">Good morning, team</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here's your inventory audit overview.
          </p>
        </div>
        <div className="flex w-fit max-w-full shrink-0 items-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
          System operational
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Items"
          value={dashboard.totalItems}
          description="Inventory items"
          icon="▦"
          accent="blue"
        />

        <StatCard
          title="Audited"
          value={dashboard.auditedItems}
          description="Items counted"
          icon="✓"
          accent="violet"
        />

        <StatCard
          title="Matched"
          value={dashboard.matchedItems}
          description="Correct quantities"
          icon="◉"
          accent="green"
        />

        <StatCard
          title="Short"
          value={dashboard.shortItems}
          description="Items with shortage"
          icon="−"
          accent="amber"
        />

        <StatCard
          title="Over"
          value={dashboard.overItems}
          description="Items with excess"
          icon="+"
          accent="rose"
        />

        <StatCard
          title="Expected"
          value={dashboard.totalExpectedQuantity}
          description="Expected quantity"
          icon="⌁"
          accent="cyan"
        />

        <StatCard
          title="Actual"
          value={dashboard.totalActualQuantity}
          description="Counted quantity"
          icon="⌗"
          accent="indigo"
        />

        <StatCard
          title="Total Variance"
          value={
            dashboard.totalVariance > 0
              ? `+${dashboard.totalVariance}`
              : dashboard.totalVariance
          }
          description="Actual − Expected"
          icon="±"
          accent="slate"
        />

      </div>


      {/* Progress */}

      <div className="dashboard-section">

        <AuditProgress
          progress={dashboard.auditProgress}
        />

      </div>


      {/* Recent Audits */}

      <div className="dashboard-section">
        <RecentAudits
          audits={dashboard.recentAudits}
        />

      </div>


      {/* Quick Actions */}

      <QuickActions />

    </div>

    

  );
};

export default Dashboard;