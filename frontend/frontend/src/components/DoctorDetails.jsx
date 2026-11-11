import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./DoctorDetails.css";

const API_URL = "http://localhost:5000";

function getDoctorImageUrl(image) {
  if (!image) {
    return "";
  }

  const filename = image.replace(/\\/g, "/").split("/").filter(Boolean).pop();
  return filename ? `${API_URL}/uploads/${encodeURIComponent(filename)}` : "";
}

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadDoctor = async () => {
      setIsLoading(true);
      setError("");
      setDoctor(null);
      setImageFailed(false);

      try {
        const response = await fetch(`${API_URL}/api/doctors/${id}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load this doctor.");
        }

        setDoctor(data);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this doctor."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadDoctor();
    return () => controller.abort();
  }, [id]);

  const imageUrl = getDoctorImageUrl(doctor?.image);
  const initials = doctor?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="doctor-details-page">
      <div className="doctor-details-container">
        <Link className="doctor-details-back" to="/#doctors">
          <span aria-hidden="true">&larr;</span> Back to doctors
        </Link>

        {isLoading && (
          <p className="doctor-details-state" role="status">
            Loading doctor profile...
          </p>
        )}

        {!isLoading && error && (
          <div className="doctor-details-state is-error" role="alert">
            <h1>Doctor profile unavailable</h1>
            <p>{error}</p>
            <Link to="/">Return to the home page</Link>
          </div>
        )}

        {!isLoading && !error && doctor && (
          <article className="doctor-profile">
            <div className="doctor-profile-header">
              <div className="doctor-profile-photo">
                <span aria-hidden="true">{initials || "DR"}</span>
                {imageUrl && !imageFailed && (
                  <img
                    src={imageUrl}
                    alt={doctor.name || "Doctor"}
                    onError={() => setImageFailed(true)}
                  />
                )}
              </div>
              <div className="doctor-profile-intro">
                <p className="doctor-profile-eyebrow">DOCTOR PROFILE</p>
                <h1>{doctor.name || "Doctor"}</h1>
                <span className="doctor-profile-specialty">
                  {doctor.specialty || "Medical specialist"}
                </span>
              </div>
            </div>

            <div className="doctor-profile-content">
              <section className="doctor-profile-about">
                <h2>About</h2>
                <p>
                  {doctor.description || "More information is not available yet."}
                </p>
              </section>

              <aside className="doctor-profile-aside">
                <div className="doctor-profile-experience">
                  <span className="doctor-profile-experience-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
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
                  </span>
                  <div>
                    <span>Experience</span>
                    <strong>{doctor.experienceYear ?? 0} years</strong>
                  </div>
                </div>
                <Link
                  className="doctor-profile-book"
                  to="/appointments/new"
                >
                  Book an appointment
                </Link>
              </aside>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

export default DoctorDetails;