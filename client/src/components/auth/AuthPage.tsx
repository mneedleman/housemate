import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Navigate, type To } from "react-router"
import useToggle from "../../hooks/useToggle";
import Logo from "../layout/Logo";
import { cn } from "src/utils/cn";
import { useAuth } from "./AuthProvider";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Props = {
  to: To
}

const perks = [
  "Never miss a recurring chore",
  "Know what's in the fridge before it turns",
  "Share it all with the people you live with",
]

const AuthPage = ({ to }: Props) => {
  const [signup, toggleSignup, setSignup] = useToggle(false)
  const { token } = useAuth()

  if (token) {
    return <Navigate to={to} replace />
  }

  return (
    <div className="flex min-h-dvh">
      {/* Brand panel: only where there's room for it */}
      <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-accent p-12 text-accent-ink lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" aria-hidden />
        <div className="relative">
          <span className="text-lg font-semibold tracking-tight">Housemate</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Run your home together, without the group chat.
          </h2>
          <ul className="mt-8 space-y-3 text-[15px] opacity-90">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckCircledIcon className="h-5 w-5 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm opacity-70">Built for shared homes.</p>
      </section>

      <section className="pt-safe pb-safe flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="lg:hidden"><Logo /></span>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight lg:mt-0">
              {signup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {signup ? "It takes less than a minute." : "Log in to see what's going on at home."}
            </p>
          </div>

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
        </div>
      </section>
    </div>
  )
}

export default AuthPage;
