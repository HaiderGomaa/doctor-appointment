import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyAppoitments.css";

const API_URL = "http://localhost:5000";

function formatAppointmentDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function MyAppoitments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmingId, setConfirmingId] = useState("");
  const [cancelingId, setCancelingId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadAppointments = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${API_URL}/api/appointments/getAppointments`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            signal: controller.signal,
          }
        );

        if (response.status === 401 || response.status === 403) {
          setRequiresLogin(true);
          throw new Error(
            token
              ? "Your session has expired. Please log in again."
              : "Log in to see your appointments."
          );
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load your appointments.");
        }

        if (!Array.isArray(data)) {
          throw new Error("The appointments response has an unexpected format.");
        }

        const now = Date.now();
        const sortedAppointments = data
          .map((appointment) => ({
            ...appointment,
            isUpcoming: new Date(appointment.date).getTime() >= now,
          }))
          .sort((first, second) => {
            if (first.isUpcoming !== second.isUpcoming) {
              return first.isUpcoming ? -1 : 1;
            }

            const firstDate = new Date(first.date).getTime();
            const secondDate = new Date(second.date).getTime();
            return first.isUpcoming
              ? firstDate - secondDate
              : secondDate - firstDate;
          });

        setAppointments(sortedAppointments);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your appointments."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();
    return () => controller.abort();
  }, [refreshKey]);

  const refreshAppointments = () => {
    setIsLoading(true);
    setError("");
    setRequiresLogin(false);
    setActionError("");
    setRefreshKey((key) => key + 1);
  };

  const handleCancel = async (appointmentId) => {
    setActionError("");
    setActionMessage("");
    setCancelingId(appointmentId);

    const token = localStorage.getItem("token");
    if (!token) {
      setRequiresLogin(true);
      setActionError("Please log in again to manage your appointments.");
      setCancelingId("");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/appointments/cancelAppointment/${appointmentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setRequiresLogin(true);
        throw new Error("Your session has expired. Please log in again.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel this appointment.");
      }

      setAppointments((current) =>
        current.filter((appointment) => appointment._id !== appointmentId)
      );
      setConfirmingId("");
      setActionMessage(data.message || "Appointment cancelled.");
    } catch (cancelError) {
      setActionError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this appointment."
      );
    } finally {
      setCancelingId("");
    }
  };

  return (
    <main className="my-appointments-page">
      <header className="my-appointments-heading">
        <p className="my-appointments-eyebrow">YOUR HEALTH, YOUR SCHEDULE</p>
        <h1>My appointments</h1>
        <p>View and manage the appointments connected to your account.</p>
      </header>

      <section
        className="my-appointments-list"
        aria-label="Your appointments"
      >
        <div className="my-appointments-toolbar">
          <div>
            <h2>Appointment history</h2>
            {!isLoading && !error && (
              <p>
                {appointments.length}{" "}
                {appointments.length === 1 ? "appointment" : "appointments"}
              </p>
            )}
          </div>
          {!isLoading && !error && (
            <button
              className="appointments-refresh"
              type="button"
              onClick={refreshAppointments}
            >
              Refresh
            </button>
          )}
        </div>

        {isLoading && (
          <p className="appointments-state" role="status">
            Loading your appointments...
          </p>
        )}

        {!isLoading && error && (
          <div className="appointments-state is-error" role="alert">
            <p>{error}</p>
            {requiresLogin ? (
              <Link to="/login">Go to log in</Link>
            ) : (
              <button
                className="appointments-retry"
                type="button"
                onClick={refreshAppointments}
              >
                Try again
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <div className="appointments-state">
            <span className="appointments-empty-icon" aria-hidden="true">
              +
            </span>
            <h3>No appointments yet</h3>
            <p>Your booked appointments will appear here.</p>
            <Link className="appointments-book-link" to="/appointments/new">
              Book an appointment
            </Link>
          </div>
        )}

        {actionMessage && (
          <p className="appointments-action-message" role="status">
            {actionMessage}
          </p>
        )}
        {actionError && (
          <p className="appointments-action-error" role="alert">
            {actionError}{" "}
            {requiresLogin && <Link to="/login">Go to log in</Link>}
          </p>
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <div className="appointments-grid">
            {appointments.map((appointment) => {
              const isUpcoming = appointment.isUpcoming;
              const doctor = appointment.doctor;

              return (
                <article className="appointment-card" key={appointment._id}>
                  <div className="appointment-card-header">
                    <span
                      className={`appointment-status${isUpcoming ? " is-upcoming" : " is-past"}`}
                    >
                      {isUpcoming ? "Upcoming" : "Past appointment"}
                    </span>
                    <time dateTime={appointment.date}>
                      {formatAppointmentDate(appointment.date)}
                    </time>
                  </div>

                  <div className="appointment-doctor-info">
                    <span className="appointment-doctor-avatar" aria-hidden="true">
                      {doctor?.name?.charAt(0)?.toUpperCase() || "D"}
                    </span>
                    <div>
                      {doctor?._id ? (
                        <Link
                          className="appointment-doctor-name"
                          to={`/doctors/${doctor._id}`}
                        >
                          {doctor.name}
                        </Link>
                      ) : (
                        <h3 className="appointment-doctor-name">
                          {doctor?.name || "Doctor information unavailable"}
                        </h3>
                      )}
                      {doctor?.specialty && (
                        <p className="appointment-doctor-specialty">
                          {doctor.specialty}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="appointment-reason">
                    <span>Reason for visit</span>
                    <p>{appointment.reason}</p>
                  </div>

                  {isUpcoming && (
                    <div className="appointment-card-actions">
                      {confirmingId === appointment._id ? (
                        <div
                          className="appointment-cancel-confirm"
                          role="group"
                          aria-label="Confirm appointment cancellation"
                        >
                          <span>Cancel this appointment?</span>
                          <button
                            type="button"
                            onClick={() => handleCancel(appointment._id)}
                            disabled={cancelingId === appointment._id}
                          >
                            {cancelingId === appointment._id
                              ? "Cancelling..."
                              : "Yes, cancel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId("")}
                            disabled={cancelingId === appointment._id}
                          >
                            Keep it
                          </button>
                        </div>
                      ) : (
                        <button
                          className="appointment-cancel-button"
                          type="button"
                          onClick={() => setConfirmingId(appointment._id)}
                        >
                          Cancel appointment
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyAppoitments;