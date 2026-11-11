import { Link } from "react-router-dom";
import "./Services.css";

const services = [
  {
    number: "01",
    title: "Find the right doctor",
    description:
      "Explore doctor profiles, specialties, and experience to find care that fits your needs.",
    action: "Explore doctors",
    to: "/#doctors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M3.5 20v-1.5a6.5 6.5 0 0 1 13 0V20M18 8v6m-3-3h6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Book appointments online",
    description:
      "Choose a doctor, select a convenient date and time, and send your appointment request online.",
    action: "Book an appointment",
    to: "/appointments/new",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 3v3m8-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="m9 14 2 2 4-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Explore our departments",
    description:
      "Learn about the specialties and services available across our medical departments.",
    action: "View departments",
    to: "/#departments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20V7l8-4 8 4v13M2 20h20M9 20v-5h6v5M9 9h.01M15 9h.01M9 12h.01M15 12h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
];

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <header className="services-heading">
          <p className="services-eyebrow">HOW WE CAN HELP</p>
          <h2>Healthcare made easier</h2>
          <p>
            Find trusted care, explore specialties, and manage your appointment
            journey in one place.
          </p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-card-top">
                <span className="service-icon">{service.icon}</span>
                <span className="service-number">{service.number}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link className="service-action" to={service.to}>
                {service.action}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;