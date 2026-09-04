import { useState } from "react";
import { login, signup } from "../services/api";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordPattern = /^[A-Za-z0-9]+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (name === "email") {
      if (value && !emailPattern.test(value.trim())) {
        setEmailWarning("Warning: enter a valid email address, for example name@example.com.");
      } else {
        setEmailWarning("");
      }
    }
    if (name === "password") {
      if (value && !passwordPattern.test(value)) {
        setPasswordWarning("Warning: password can contain letters and numbers only.");
      } else if (value && value.length < 8) {
        setPasswordWarning(`Password needs ${8 - value.length} more character${8 - value.length === 1 ? "" : "s"}.`);
      } else {
        setPasswordWarning("");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    if (!emailPattern.test(form.email.trim())) {
      setError("Enter a valid email address, for example name@example.com.");
      setSubmitting(false);
      return;
    }
    if (form.password.length < 8 || !passwordPattern.test(form.password)) {
      setError("Password must be at least 8 characters and contain only letters and numbers.");
      setSubmitting(false);
      return;
    }
    try {
      if (mode === "signup") {
        await signup(form);
        setMode("login");
        setForm({ name: "", email: form.email, password: "" });
        setEmailWarning("");
        setPasswordWarning("");
        setMessage("Admin account created. Sign in to continue.");
      } else {
        const response = await login({ email: form.email, password: form.password });
        onLogin(response.data.data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete this request.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-mark">IA</div>
        <p className="eyebrow">Inventory Audit</p>
        <h1>{isSignup ? "Create your admin account" : "Welcome back"}</h1>
        <p className="login-subtitle">
          {isSignup ? "Set up the first account with permission to manage stock." : "Sign in to manage your stock workspace."}
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <>
              <label htmlFor="login-name">Full name</label>
              <input id="login-name" name="name" value={form.name} onChange={handleChange} required />
            </>
          )}
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
            title="Enter a valid email address, for example name@example.com."
            value={form.email}
            onChange={handleChange}
            required
          />
          {emailWarning && (
            <p className="email-warning" role="status">{emailWarning}</p>
          )}
          <label htmlFor="login-password">Password</label>
          <div className="password-field">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              minLength="8"
              pattern="[A-Za-z0-9]+"
              title="Use at least 8 letters and numbers only."
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className={`password-toggle ${showPassword ? "password-toggle-visible" : ""}`}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {showPassword ? (
                  <>
                    <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </>
                ) : (
                  <>
                    <path d="m3 3 18 18" />
                    <path d="M10.6 6.2A10.6 10.6 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.7 17.7 0 0 1-3.2 3.7M6.2 6.3C3.8 7.9 2.5 12 2.5 12s3.4 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />
                  </>
                )}
              </svg>
            </button>
          </div>
          {passwordWarning && (
            <p className="password-warning" role="status">{passwordWarning}</p>
          )}
          {error && <p className="login-error" role="alert">{error}</p>}
          {message && <p className="login-success" role="status">{message}</p>}
          <button type="submit" disabled={submitting}>{submitting ? "Please wait..." : isSignup ? "Create admin account" : "Sign in"}</button>
        </form>
        <button
          type="button"
          className="login-switch"
          onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); setMessage(""); }}
        >
          {isSignup ? "Already have an account? Sign in" : "Need to create the first admin? Sign up"}
        </button>
      </section>
    </main>
  );
};

export default Login;
