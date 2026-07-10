import { ReactNode } from "react";
import "../../styles/auth.css";

interface AuthLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function AuthLayout({ left, right }: AuthLayoutProps) {
  return (
    <div className="authPage">
      <div className="authContainer">
        <aside className="authLeft">{left}</aside>
        <main className="authRight">{right}</main>
      </div>
    </div>
  );
}
