import { cn } from "src/utils/cn"
import { initials } from "src/utils/stringUtils"

// Stable pastel per person so the same housemate always gets the same colour
const palette = [
  "bg-[#dbeafe] text-[#1e40af]",
  "bg-[#fce7f3] text-[#9d174d]",
  "bg-[#ede9fe] text-[#5b21b6]",
  "bg-[#dcfce7] text-[#166534]",
  "bg-[#ffedd5] text-[#9a3412]",
  "bg-[#e0f2fe] text-[#075985]",
]

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

type Props = {
  name?: string | null
  email?: string | null
  size?: "sm" | "md"
  className?: string
}

const Avatar = ({ name, email, size = "md", className }: Props) => {
  const key = email || name || "?"
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs",
        palette[hash(key) % palette.length],
        className
      )}
    >
      {initials(name, email)}
    </span>
  )
}

export const AvatarStack = ({
  people,
  max = 4,
}: {
  people: { name?: string | null; email?: string | null }[]
  max?: number
}) => {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <div className="flex -space-x-1">
      {shown.map((p, i) => (
        <Avatar key={p.email || i} {...p} size="sm" className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-raised text-[11px] font-semibold text-muted ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  )
}

export default Avatar
