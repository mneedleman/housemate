type ClassValue = string | false | null | undefined

/** Join class names, skipping falsy values. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(" ")
