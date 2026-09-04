import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-actions">

      <button
        onClick={() => navigate("/audit")}
        className="action-button action-button-primary"
      >
        <span aria-hidden="true">✓</span>
        Start audit
      </button>

      <button
        onClick={() => navigate("/inventory")}
        className="action-button action-button-secondary"
      >
        <span aria-hidden="true">+</span>
        Add inventory
      </button>

      <button
        onClick={() => navigate("/report")}
        className="action-button action-button-secondary"
      >
        <span aria-hidden="true">↗</span>
        View report
      </button>

    </div>
  );
};

export default QuickActions;