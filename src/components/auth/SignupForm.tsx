import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  const validateForm = () => {
    const nextErrors: SignupErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      nextErrors.name = "Username is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Username must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field: keyof SignupErrors) => {
    if (!errors[field]) return;

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      localStorage.setItem("username", name.trim());

      navigate("/dashboard");
    }
  };

  return (
    <form className="loginCard signupCard" noValidate onSubmit={handleSubmit}>
      <button
        className="backButton"
        type="button"
        onClick={() => navigate("/login")}
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>

      <div className="loginHeader">
        <h2>Create Account</h2>

        <p className="loginSubtitle">
          Start your ResearchMate workspace with a clean AI research profile.
        </p>
      </div>

      <div className={`inputGroup ${errors.name ? "hasError" : ""}`}>
        <label htmlFor="signupName">Username</label>

        <input
          id="signupName"
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError("name");
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "nameError" : undefined}
        />

        {errors.name && (
          <p className="fieldError" id="nameError">
            <AlertCircle size={15} />
            {errors.name}
          </p>
        )}
      </div>

      <div className={`inputGroup ${errors.email ? "hasError" : ""}`}>
        <label htmlFor="signupEmail">Email</label>

        <input
          id="signupEmail"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError("email");
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signupEmailError" : undefined}
        />

        {errors.email && (
          <p className="fieldError" id="signupEmailError">
            <AlertCircle size={15} />
            {errors.email}
          </p>
        )}
      </div>

      <div className={`inputGroup ${errors.password ? "hasError" : ""}`}>
        <label htmlFor="signupPassword">Password</label>

        <div className="passwordBox">
          <input
            id="signupPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError("password");
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "signupPasswordError" : undefined
            }
          />

          <button
            type="button"
            className="eyeButton"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="fieldError" id="signupPasswordError">
            <AlertCircle size={15} />
            {errors.password}
          </p>
        )}
      </div>

      <div
        className={`inputGroup ${
          errors.confirmPassword ? "hasError" : ""
        }`}
      >
        <label htmlFor="confirmPassword">Confirm Password</label>

        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            clearError("confirmPassword");
          }}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirmPasswordError" : undefined
          }
        />

        {errors.confirmPassword && (
          <p className="fieldError" id="confirmPasswordError">
            <AlertCircle size={15} />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button className="loginButton" type="submit">
        Create Account
      </button>

      <p className="authHint">
        <CheckCircle2 size={16} />
        Your profile opens instantly after signup.
      </p>
    </form>
  );
}