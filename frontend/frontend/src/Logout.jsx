import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import "./Logout.css";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="logout-page">
      <section className="logout-card" aria-labelledby="logout-title">
        <span className="logout-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M10 17l5-5-5-5M15 12H4m9-7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
        <p className="logout-eyebrow">DOCTOR APPOINTMENT</p>
        <h1 id="logout-title">Log out of your account?</h1>
        <p className="logout-copy">
          You can sign in again whenever you need to manage your appointments.
        </p>
        <div className="logout-actions">
          <button className="logout-confirm" type="button" onClick={handleLogout}>
            Log out
          </button>
          <button
            className="logout-cancel"
            type="button"
            onClick={() => navigate("/", { replace: true })}
          >
            Stay signed in
          </button>
        </div>
      </section>
    </main>
  );
}

export default Logout;
