import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginErrors {
  email?: string;
  password?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getUsernameFromEmail = (emailValue: string) => {
  const localPart = emailValue.trim().split("@")[0] || "Researcher";
  const readableName = localPart.replace(/[._-]+/g, " ");

  return readableName
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = () => {
    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateField = (field: keyof LoginErrors) => {
    if (field === "email") {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          email: "Email is required.",
        }));
      } else if (!emailPattern.test(trimmedEmail)) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          email: "Enter a valid email address.",
        }));
      }
    }

    if (field === "password") {
      if (!password) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          password: "Password is required.",
        }));
      } else if (password.length < 6) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          password: "Password must be at least 6 characters.",
        }));
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      localStorage.setItem(
        "username",
        getUsernameFromEmail(email)
      );

      navigate("/dashboard");
    }
  };

  const clearError = (field: keyof LoginErrors) => {
    if (!errors[field]) {
      return;
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  return (
    <form className="loginCard" noValidate onSubmit={handleSubmit}>
      <div className="loginHeader">
        <h2>Welcome Back</h2>

        <p className="loginSubtitle">
          Sign in to continue exploring papers, insights, and research gaps.
        </p>
      </div>

      <div className={`inputGroup ${errors.email ? "hasError" : ""}`}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError("email");
          }}
          onBlur={() => validateField("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "emailError" : undefined}
        />

        {errors.email && (
          <p className="fieldError" id="emailError">
            <AlertCircle size={15} />
            {errors.email}
          </p>
        )}
      </div>

      <div className={`inputGroup ${errors.password ? "hasError" : ""}`}>
        <label htmlFor="password">Password</label>

        <div className="passwordBox">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError("password");
            }}
            onBlur={() => validateField("password")}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "passwordError" : undefined}
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
          <p className="fieldError" id="passwordError">
            <AlertCircle size={15} />
            {errors.password}
          </p>
        )}
      </div>

      <div className="loginOptions">
        <label className="remember">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>

        <button className="forgotButton" type="button">
          Forgot password?
        </button>
      </div>

      <button className="loginButton" type="submit">
        Sign In
      </button>

      <div className="divider">OR</div>

      <button
        className="signupButton"
        type="button"
        onClick={() => navigate("/signup")}
      >
        Create Account
      </button>
    </form>
  );
}