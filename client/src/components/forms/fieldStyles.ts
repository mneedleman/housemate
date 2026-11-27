/** Shared look for every text-like control so forms stay consistent. */
export const fieldClass =
  "block w-full h-11 rounded-xl border border-line bg-raised/60 px-3.5 text-[15px] text-ink " +
  "placeholder:text-muted/80 transition-colors outline-none " +
  "hover:border-muted/40 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15"

export const labelClass = "mb-1.5 block text-sm font-medium text-ink"
export const descriptionClass = "mb-1.5 block text-xs text-muted"
