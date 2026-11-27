import { CheckCircledIcon } from "@radix-ui/react-icons"
import type { PropsWithChildren, ReactNode } from "react"
import Logo from "../layout/Logo"

const perks = [
  "Never miss a recurring chore",
  "Know what's in the fridge before it turns",
  "Share it all with the people you live with",
]

type Props = {
  title: ReactNode
  subtitle?: ReactNode
}

/** Brand panel (large screens) beside a narrow column for auth forms. */
const AuthLayout = ({ title, subtitle, children }: PropsWithChildren<Props>) => (
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
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>

          {children}
        </div>
      </section>
    </div>
)

export default AuthLayout
