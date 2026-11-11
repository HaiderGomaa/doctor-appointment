import { useState } from "react";
import { Link } from "react-router-dom";
import "./AddDoctor.css";

function AddDoctor() {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYear, setExperienceYear] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setRequiresLogin(false);

    if (!name.trim() || !specialty.trim() || !description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setRequiresLogin(true);
      setError("Please log in as an admin to add a doctor.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("specialty", specialty.trim());
    formData.append("experienceYear", experienceYear);
    formData.append("description", description.trim());
    if (image) {
      formData.append("image", image);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/doctors/addDoctors", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        setRequiresLogin(true);
        throw new Error("Please log in again to continue.");
      }

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (response.status === 403) {
        if (!data) {
          setRequiresLogin(true);
          throw new Error("Your session has expired. Please log in again.");
        }

        throw new Error(data.error || "Only admins can add doctors.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to add the doctor.");
      }

      setSuccess(data?.message || "Doctor added successfully.");
      setName("");
      setSpecialty("");
      setExperienceYear("");
      setDescription("");
      setImage(null);
      setImageInputKey((key) => key + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to add the doctor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="add-doctor-page">
      <header className="add-doctor-heading">
        <p className="add-doctor-eyebrow">ADMINISTRATION</p>
        <h1>Add a doctor</h1>
        <p>
          Add a doctor profile so patients can discover their experience and
          request an appointment.
        </p>
      </header>

      <section className="add-doctor-card" aria-labelledby="add-doctor-title">
        <div className="add-doctor-card-heading">
          <span className="add-doctor-icon" aria-hidden="true">
            +
          </span>
          <div>
            <h2 id="add-doctor-title">Doctor information</h2>
            <p>Complete the details below to create a profile.</p>
          </div>
        </div>

        <form className="add-doctor-form" onSubmit={handleSubmit}>
          <div className="add-doctor-fields">
            <div className="add-doctor-field">
              <label htmlFor="doctor-name">Full name</label>
              <input
                id="doctor-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Dr. Alex Morgan"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="add-doctor-field">
              <label htmlFor="doctor-specialty">Specialty</label>
              <input
                id="doctor-specialty"
                name="specialty"
                type="text"
                placeholder="e.g. Cardiology"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                required
              />
            </div>

            <div className="add-doctor-field">
              <label htmlFor="doctor-experience">Years of experience</label>
              <input
                id="doctor-experience"
                name="experienceYear"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 8"
                value={experienceYear}
                onChange={(event) => setExperienceYear(event.target.value)}
                required
              />
            </div>

            <div className="add-doctor-field add-doctor-field-wide">
              <label htmlFor="doctor-description">About the doctor</label>
              <textarea
                id="doctor-description"
                name="description"
                placeholder="Share the doctor's experience, approach, and areas of care"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="add-doctor-field add-doctor-field-wide">
              <label htmlFor="doctor-image">Profile photo</label>
              <input
                key={imageInputKey}
                id="doctor-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                required
              />
              {image && (
                <p className="add-doctor-file-name">
                  Selected file: {image.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="add-doctor-message is-error" role="alert">
              {error}{" "}
              {requiresLogin && <Link to="/login">Go to log in</Link>}
            </p>
          )}
          {success && (
            <p className="add-doctor-message is-success" role="status">
              {success}
            </p>
          )}

          <button
            className="add-doctor-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving doctor..." : "Add doctor"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddDoctor;