import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Doctors.css";

const API_URL = "http://localhost:5000";

function getDoctorImageUrl(image) {
  if (!image) {
    return "";
  }

  const filename = image.replace(/\\/g, "/").split("/").filter(Boolean).pop();
  return filename ? `${API_URL}/uploads/${encodeURIComponent(filename)}` : "";
}

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doctors/getDoctors`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load doctors.");
        }

        if (!Array.isArray(data)) {
          throw new Error("The doctors response has an unexpected format.");
        }

        setDoctors(data);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load doctors."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctors();
    return () => controller.abort();
  }, []);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredDoctors = doctors.filter((doctor) => {
    const searchableText = [
      doctor.name,
      doctor.specialty,
      doctor.description,
      doctor.experienceYear,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  return (
    <section id="doctors" className="doctors-page">
      <header className="doctors-heading">
        <p className="doctors-eyebrow">MEET OUR MEDICAL TEAM</p>
        <h2>Meet our doctors</h2>
        <p>
          Explore our doctors, their specialties, experience, and approach to
          care.
        </p>
      </header>

      <section className="doctors-directory" aria-label="Doctor directory">
        <div className="doctors-toolbar">
          <div>
            <h2>Our doctors</h2>
            {!isLoading && !error && (
              <p>
                {filteredDoctors.length}{" "}
                {filteredDoctors.length === 1 ? "doctor" : "doctors"}
                {normalizedSearch ? " found" : " available"}
              </p>
            )}
          </div>
          <label className="doctors-search">
            <span className="visually-hidden">Search doctors</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle
                cx="10.8"
                cy="10.8"
                r="6.8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4.2 4.2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or specialty"
            />
          </label>
        </div>

        {isLoading && (
          <p className="doctors-state" role="status">
            Loading doctors...
          </p>
        )}

        {!isLoading && error && (
          <p className="doctors-state is-error" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && doctors.length === 0 && (
          <div className="doctors-state">
            <h3>No doctors added yet</h3>
            <p>Our medical team will appear here once profiles are available.</p>
          </div>
        )}

        {!isLoading && !error && doctors.length > 0 && filteredDoctors.length === 0 && (
          <div className="doctors-state">
            <h3>No matching doctors</h3>
            <p>Try a different name or specialty.</p>
          </div>
        )}

        {!isLoading && !error && filteredDoctors.length > 0 && (
          <div className="doctors-grid">
            {filteredDoctors.map((doctor) => {
              const imageUrl = getDoctorImageUrl(doctor.image);
              const initials = doctor.name
                ?.split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <article className="doctor-card" key={doctor._id}>
                  <div className="doctor-card-top">
                    <div className="doctor-avatar">
                      <span aria-hidden="true">{initials || "DR"}</span>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={doctor.name || "Doctor"}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    <span className="doctor-specialty">
                      {doctor.specialty || "Medical specialist"}
                    </span>
                  </div>

                  <div className="doctor-card-content">
                    <h3>{doctor.name || "Doctor"}</h3>
                    <p className="doctor-experience">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle
                          cx="12"
                          cy="12"
                          r="8.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M12 7v5l3 2"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                        />
                      </svg>
                      {doctor.experienceYear ?? 0} years of experience
                    </p>
                    <p className="doctor-description">
                      {doctor.description || "More information coming soon."}
                    </p>
                    <Link
                      className="doctor-details-link"
                      to={`/doctors/${doctor._id}`}
                    >
                      View full profile
                    </Link>
                    <Link
                      className="doctor-book-link"
                      to="/appointments/new"
                    >
                      Book an appointment
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default Doctors;