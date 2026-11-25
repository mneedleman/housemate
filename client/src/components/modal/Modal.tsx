import { Cross2Icon } from "@radix-ui/react-icons"
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react"
import { createPortal } from "react-dom"
import { IconButton } from "../ui/Button"

export const ModalContext = createContext({
  close: () => { }
})

export const useModal = () => {
  return useContext(ModalContext)
}

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
}

/**
 * Bottom sheet on phones, centred dialog from `sm` up.
 * Rendered in a portal so it is never clipped by a card's overflow or stacking context.
 */
const Modal = ({ open, onClose, title, description, children }: PropsWithChildren<Props>) => {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  // Callers pass inline closures; keep the latest without re-running the open/close effect
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current()
    document.addEventListener("keydown", onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>("input, textarea, select, button[type=submit]")?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <ModalContext.Provider value={{ close: onClose }}>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <div
          className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className="relative flex max-h-[92dvh] w-full animate-sheet-up flex-col rounded-t-3xl bg-surface shadow-pop sm:max-w-md sm:animate-pop-in sm:rounded-2xl"
        >
          {/* Grab handle — a visual cue that this is a sheet on mobile */}
          <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
          {title && (
            <div className="flex items-start gap-3 px-5 pt-3 sm:pt-5">
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-lg font-semibold tracking-tight">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>
              <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
                <Cross2Icon className="h-5 w-5" />
              </IconButton>
            </div>
          )}
          <div className="overflow-y-auto px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {children}
          </div>
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  )
}

export default Modal
