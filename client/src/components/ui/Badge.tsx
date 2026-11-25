import type { PropsWithChildren, ReactNode } from "react"
import { cn } from "src/utils/cn"
import type { Urgency } from "src/utils/dateUtils"

export type Tone = "neutral" | "accent" | "danger" | "warn" | "ok"

const tones: Record<Tone, string> = {
  neutral: "bg-raised text-muted",
  accent: "bg-accent-soft text-accent-soft-ink",
  danger: "bg-danger-soft text-danger",
  warn: "bg-warn-soft text-warn",
  ok: "bg-ok-soft text-ok",
}

export const urgencyTone: Record<Urgency, Tone> = {
  overdue: "danger",
  soon: "warn",
  later: "neutral",
}

type Props = {
  tone?: Tone
  icon?: ReactNode
  className?: string
}

const Badge = ({ tone = "neutral", icon, className, children }: PropsWithChildren<Props>) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
      tones[tone],
      className
    )}
  >
    {icon}
    {children}
  </span>
)

export default Badge
