import AuthLayout from "../components/auth/AuthLayout";
import AuthLeft from "../components/auth/AuthLeft";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      left={<AuthLeft />}
      right={<LoginForm />}
    />
  );
}
