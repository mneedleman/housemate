import { cn } from "src/utils/cn"
import { labelClass as baseLabelClass } from "./fieldStyles"

export type LabelProps = {
  label?: string
  labelClass?: string
  onClick?: () => void
  htmlFor?: string
}

const Label = ({
  label, labelClass, onClick, htmlFor
}: LabelProps) => (
  <label htmlFor={htmlFor} className={cn(baseLabelClass, labelClass)} onClick={onClick}>{label}</label>
)

export default Label
