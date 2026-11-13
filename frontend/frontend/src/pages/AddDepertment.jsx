import { useState } from "react";
import { Link } from "react-router-dom";
import "./AddDepertment.css";

function AddDepertment() {
  const [name, setName] = useState("");
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

    const token = localStorage.getItem("token");
    if (!token) {
      setRequiresLogin(true);
      setError("Please log in as an admin to add a department.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (image) {
      formData.append("image", image);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/departments/addDepertments",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.status === 401) {
        setRequiresLogin(true);
        throw new Error("Your session has expired. Please log in again.");
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

        throw new Error(
          data?.error || "Your session is invalid or you do not have admin access."
        );
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to add the department.");
      }

      setSuccess(data?.message || "Department added successfully.");
      setName("");
      setDescription("");
      setImage(null);
      setImageInputKey((key) => key + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to add the department."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="add-department-page">
      <header className="add-department-heading">
        <p className="add-department-eyebrow">ADMINISTRATION</p>
        <h1>Add a department</h1>
        <p>
          Create a department profile so patients can learn about the care you
          offer.
        </p>
      </header>

      <section
        className="add-department-card"
        aria-labelledby="add-department-title"
      >
        <div className="add-department-card-heading">
          <span className="add-department-icon" aria-hidden="true">
            +
          </span>
          <div>
            <h2 id="add-department-title">Department information</h2>
            <p>Add the name and any helpful details for patients.</p>
          </div>
        </div>

        <form className="add-department-form" onSubmit={handleSubmit}>
          <label htmlFor="department-name">Department name</label>
          <input
            id="department-name"
            name="name"
            type="text"
            minLength={2}
            maxLength={100}
            placeholder="e.g. Cardiology"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="department-description">
            Description <span>(optional)</span>
          </label>
          <textarea
            id="department-description"
            name="description"
            placeholder="Describe the services provided by this department"
            maxLength={1000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />

          <label htmlFor="department-image">
            Department image <span>(optional)</span>
          </label>
          <input
            key={imageInputKey}
            id="department-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const selectedImage = event.target.files?.[0] || null;
              if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
                setError("Department image must be 5 MB or smaller.");
                setImage(null);
                setImageInputKey((key) => key + 1);
                return;
              }
              setError("");
              setImage(selectedImage);
            }}
          />
          {image && (
            <p className="add-department-file-name">
              Selected file: {image.name}
            </p>
          )}

          {error && (
            <p className="add-department-message is-error" role="alert">
              {error}{" "}
              {requiresLogin && <Link to="/login">Go to log in</Link>}
            </p>
          )}
          {success && (
            <p className="add-department-message is-success" role="status">
              {success}
            </p>
          )}

          <button
            className="add-department-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving department..." : "Add department"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddDepertment;