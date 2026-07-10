import AuthLayout from "../components/auth/AuthLayout";
import AuthLeft from "../components/auth/AuthLeft";
import LoginForm from "../components/auth/LoginForm";

interface LoginProps {
  next: (username: string) => void;
  createAccount: () => void;
}

export default function Login({ next, createAccount }: LoginProps) {
  return (
    <AuthLayout
      left={<AuthLeft />}
      right={<LoginForm next={next} createAccount={createAccount} />}
    />
  );
}
