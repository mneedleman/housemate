import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "src/utils/cn"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover shadow-card",
  secondary: "bg-surface text-ink border border-line hover:bg-raised",
  ghost: "text-ink hover:bg-raised",
  danger: "bg-danger text-white hover:opacity-90 shadow-card",
}

// Mobile-first: md is a 44px touch target
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-4 text-[15px] gap-2 rounded-xl",
  lg: "h-12 px-5 text-base gap-2 rounded-xl",
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  block?: boolean
  loading?: boolean
}

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  block,
  loading,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center font-medium whitespace-nowrap select-none",
      "transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      block && "w-full",
      className
    )}
    {...rest}
  >
    {loading ? <Spinner /> : icon}
    {children}
  </button>
)

export const IconButton = ({
  label,
  className,
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(
      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted",
      "transition-colors hover:bg-raised hover:text-ink",
      className
    )}
    {...rest}
  >
    {children}
  </button>
)

export const Spinner = () => (
  <span
    aria-hidden
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
  />
)

export default Button
