const StatCard = ({
  title,
  value,
  description,
  icon,
  accent = "blue",
}) => {
  return (
    <div className="stat-card group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`stat-icon stat-icon-${accent}`}>{icon}</div>
        <span className="text-xs font-medium text-slate-300">↗</span>
      </div>
      <p className="stat-card-title mt-4 text-sm font-medium text-slate-600">{title}</p>
      <h2 className="stat-card-value mt-1 text-3xl font-bold tracking-tight text-slate-950">{value ?? 0}</h2>
      {description && <p className="stat-card-description mt-1 text-xs text-slate-500">{description}</p>}
    </div>
  );
};

export default StatCard;