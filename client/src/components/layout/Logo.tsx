import { Link } from "react-router"

const Mark = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
    <rect width="32" height="32" rx="9" className="fill-accent" />
    <path d="M8 15.5 16 9l8 6.5V23a1 1 0 0 1-1 1h-4.5v-5h-5v5H9a1 1 0 0 1-1-1z" className="fill-accent-ink" />
  </svg>
)

const Logo = ({ compact }: { compact?: boolean }) => (
  <Link to="/dashboard" className="inline-flex items-center gap-2.5" aria-label="Housemate home">
    <Mark />
    {!compact && <span className="text-lg font-semibold tracking-tight">Housemate</span>}
  </Link>
)

export default Logo
