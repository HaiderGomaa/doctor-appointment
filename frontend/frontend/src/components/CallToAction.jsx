import { Link } from "react-router-dom";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <div className="home-cta-content">
        <p className="home-cta-eyebrow">BOOK YOUR VISIT</p>
        <h2 id="home-cta-title">Ready to take care of your health?</h2>
        <p className="home-cta-description">
          Find a doctor, choose a time that works for you, and request your
          appointment online.
        </p>
      </div>

      <Link className="home-cta-button" to="/appointments/new">
        Make an appointment
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </Link>
    </section>
  );
}

export default CallToAction;
