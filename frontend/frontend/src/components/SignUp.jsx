import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";
import "./SignUp.css";

function SignUp() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create your account. Please try again.");
      }

      if (!data.token) {
        throw new Error("The registration response did not include an authentication token.");
      }

      login(data.token);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page signup-page">
      <section className="login-card signup-card" aria-labelledby="signup-title">
        <div className="login-welcome signup-welcome">
          <span className="login-mark" aria-hidden="true">
            +
          </span>
          <p className="login-eyebrow">DOCTOR APPOINTMENT</p>
          <h1>Your care journey starts here.</h1>
          <p className="login-welcome-copy">
            Create an account to book and manage your appointments.
          </p>
        </div>

        <div className="login-form-panel signup-form-panel">
          <p className="login-eyebrow login-eyebrow-teal">GET STARTED</p>
          <h2 id="signup-title">Create your account</h2>
          <p className="login-intro">Fill in your details to get started.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <label htmlFor="signup-confirm-password">Confirm password</label>
            <input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="login-signup">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
