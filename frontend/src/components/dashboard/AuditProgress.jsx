const AuditProgress = ({ progress }) => {
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Overview</p>
          <h2 className="mt-1 font-semibold text-slate-900">Audit progress</h2>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">{safeProgress}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
          style={{
            width: `${safeProgress}%`,
          }}
        />

      </div>

      <p className="mt-3 text-sm text-slate-500">
        {safeProgress}% of inventory items have been audited.
      </p>

    </div>
  );
};

export default AuditProgress;