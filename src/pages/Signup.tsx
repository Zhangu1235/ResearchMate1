import AuthLayout from "../components/auth/AuthLayout";
import AuthLeft from "../components/auth/AuthLeft";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      left={<AuthLeft />}
      right={<SignupForm />}
    />
  );
}