import { ChevronRight } from "lucide-react"
import { cn } from "tailwind-variants"

export const CollapseToggle = ({
  isOpen,
  setIsOpen,
  disabled,
  className,
}: {
  isOpen: boolean
  setIsOpen?: (isOpen: boolean) => void
  disabled?: boolean
  className?: string
}) => {
  return (
    <button
      onClick={() => setIsOpen?.(!isOpen)}
      disabled={disabled}
      className={cn(
        "cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <ChevronRight
        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
      />
    </button>
  )
}
