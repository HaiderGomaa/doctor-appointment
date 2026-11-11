import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to log in. Please try again.");
      }

      if (!data.token) {
        throw new Error("The login response did not include an authentication token.");
      }

      login(data.token);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-welcome">
          <span className="login-mark" aria-hidden="true">
            +
          </span>
          <p className="login-eyebrow">DOCTOR APPOINTMENT</p>
          <h1>Care that starts with you.</h1>
          <p className="login-welcome-copy">
            Sign in to manage your healthcare and appointments.
          </p>
        </div>

        <div className="login-form-panel">
          <p className="login-eyebrow login-eyebrow-teal">WELCOME BACK</p>
          <h2 id="login-title">Log in to your account</h2>
          <p className="login-intro">Enter your details to continue.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>

          <p className="login-signup">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
