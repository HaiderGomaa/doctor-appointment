import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AddAppointment.css";

function getLocalDateTime() {
  const localDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60_000
  );
  return localDate.toISOString().slice(0, 16);
}

function AddAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [bookingToast, setBookingToast] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors/getDoctors",
          { signal: controller.signal }
        );
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
          setIsLoadingDoctors(false);
        }
      }
    };

    loadDoctors();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!bookingToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setBookingToast(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [bookingToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBookingToast(null);
    setRequiresLogin(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setRequiresLogin(true);
      setBookingToast({
        type: "error",
        message: "Please log in before booking an appointment.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments/bookAppointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor: selectedDoctor,
            date,
            reason: reason.trim(),
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        setRequiresLogin(true);
        throw new Error("Your session has expired. Please log in again.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to book your appointment.");
      }

      setBookingToast({
        type: "success",
        message: "Your appointment has been booked successfully.",
      });
      setSelectedDoctor("");
      setDate("");
      setReason("");
    } catch (submitError) {
      setBookingToast({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Unable to book your appointment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const doctor = doctors.find((item) => item._id === selectedDoctor);
  const formattedDate = date
    ? new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Choose a date and time";

  return (
    <main className="appointment-page">
      {bookingToast && (
        <div
          className={`appointment-toast is-${bookingToast.type}`}
          role={bookingToast.type === "error" ? "alert" : "status"}
        >
          <span className="appointment-toast-icon" aria-hidden="true">
            {bookingToast.type === "success" ? (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m6 12 4 4 8-8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v5m0 3h.01M10.3 4.9 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13a2 2 0 0 0-3.4-.1Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            )}
          </span>
          <div className="appointment-toast-content">
            <p>{bookingToast.message}</p>
            {requiresLogin && <Link to="/login">Go to log in</Link>}
          </div>
          <button
            className="appointment-toast-close"
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setBookingToast(null)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m7 7 10 10M17 7 7 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      )}

      <header className="appointment-heading">
        <p className="appointment-eyebrow">YOUR HEALTH, YOUR TIME</p>
        <h1>Book an appointment</h1>
        <p>
          Choose a doctor and a time that works for you. We’ll take care of the
          rest.
        </p>
      </header>

      <div className="appointment-layout">
        <section
          className="appointment-form-card"
          aria-labelledby="appointment-form-title"
        >
          <div className="appointment-card-heading">
            <span className="appointment-step">01</span>
            <div>
              <h2 id="appointment-form-title">Appointment details</h2>
              <p>All fields are required to request your appointment.</p>
            </div>
          </div>

          <form className="appointment-form" onSubmit={handleSubmit}>
            <label htmlFor="appointment-doctor">Choose a doctor</label>
            <select
              id="appointment-doctor"
              value={selectedDoctor}
              onChange={(event) => setSelectedDoctor(event.target.value)}
              required
              disabled={isLoadingDoctors || doctors.length === 0}
            >
              <option value="">
                {isLoadingDoctors ? "Loading doctors..." : "Select a doctor"}
              </option>
              {doctors.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} — {item.specialty}
                </option>
              ))}
            </select>
            {!isLoadingDoctors && doctors.length === 0 && !error && (
              <p className="appointment-field-note">
                No doctors are available to book right now.
              </p>
            )}

            <label htmlFor="appointment-date">Date and time</label>
            <input
              id="appointment-date"
              type="datetime-local"
              value={date}
              min={getLocalDateTime()}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <label htmlFor="appointment-reason">Reason for visit</label>
            <textarea
              id="appointment-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Briefly describe what you need help with"
              rows={4}
              required
            />

            {error && (
              <p className="appointment-message is-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="appointment-submit"
              type="submit"
              disabled={
                isSubmitting || isLoadingDoctors || doctors.length === 0
              }
            >
              {isSubmitting ? "Booking..." : "Confirm appointment"}
            </button>
          </form>
        </section>

        <aside className="appointment-summary" aria-label="Booking summary">
          <div className="summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M8 3v3m8-3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </div>
          <p className="summary-eyebrow">YOUR BOOKING</p>
          <h2>Appointment summary</h2>

          <div className="summary-item">
            <span>Doctor</span>
            <strong>{doctor ? doctor.name : "Not selected yet"}</strong>
            {doctor && <small>{doctor.specialty}</small>}
          </div>

          <div className="summary-item">
            <span>Date &amp; time</span>
            <strong>{formattedDate}</strong>
          </div>

          <div className="summary-note">
            Your appointment request will be saved to your account after you
            confirm.
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AddAppointment;