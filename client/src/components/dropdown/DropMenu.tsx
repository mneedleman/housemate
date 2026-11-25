import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ReactNode, useEffect, useRef } from "react"
import useToggle from "src/hooks/useToggle"
import { cn } from "src/utils/cn"

export type Option = {
  label: string
  onSelect: VoidFunction
  icon?: ReactNode
  tone?: "default" | "danger"
}

type Props = {
  options: Option[]
  label?: string
  className?: string
  /** Custom trigger content; defaults to a "…" icon */
  trigger?: ReactNode
  triggerClass?: string
  /** Optional content above the options, e.g. the signed-in user */
  header?: ReactNode
  align?: "left" | "right"
}

const DropMenu = ({
  options,
  label = "More options",
  className,
  trigger,
  triggerClass,
  header,
  align = "right",
}: Props) => {
  const [open, toggleOpen, setOpen] = useToggle(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          toggleOpen()
        }}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink",
          open && "bg-raised text-ink",
          triggerClass
        )}
      >
        {trigger ?? <DotsHorizontalIcon className="h-5 w-5" />}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-40 mt-1.5 min-w-48 origin-top animate-pop-in overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-pop",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {header && <div className="border-b border-line px-3 py-2.5 mb-1">{header}</div>}
          {options.map(({ label, onSelect, icon, tone }, i) => (
            <button
              key={`${label}-${i}`}
              type="button"
              role="menuitem"
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-raised",
                tone === "danger" ? "text-danger" : "text-ink"
              )}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                onSelect()
              }}
            >
              {icon && <span className="text-muted [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropMenu
