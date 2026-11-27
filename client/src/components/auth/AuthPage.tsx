import { Navigate, type To } from "react-router"
import useToggle from "../../hooks/useToggle";
import AuthLayout from "./AuthLayout";
import { cn } from "src/utils/cn";
import { useAuth } from "./AuthProvider";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Props = {
  to: To
}


const AuthPage = ({ to }: Props) => {
  const [signup, toggleSignup, setSignup] = useToggle(false)
  const { token } = useAuth()

  if (token) {
    return <Navigate to={to} replace />
  }

  return (
    <AuthLayout
      title={signup ? "Create your account" : "Welcome back"}
      subtitle={signup ? "It takes less than a minute." : "Log in to see what's going on at home."}
    >
      <div role="tablist" aria-label="Account" className="mb-6 grid grid-cols-2 rounded-xl bg-raised p-1 text-sm font-medium">
        {[
          { label: "Log in", active: !signup, onClick: () => setSignup(false) },
          { label: "Sign up", active: signup, onClick: () => setSignup(true) },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={tab.active}
            onClick={tab.onClick}
            className={cn(
              "h-9 rounded-lg transition-all",
              tab.active ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {signup
        ? <SignupForm to={to} toggleSignup={toggleSignup} />
        : <LoginForm to={to} toggleSignup={toggleSignup} />}
    </AuthLayout>
  )
}

export default AuthPage;
