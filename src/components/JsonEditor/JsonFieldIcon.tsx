import { cn } from "tailwind-variants"
import { getDatatypeColor, getDatatypeIcon } from "./utils/datatypes"
import { useMemo } from "react"
import type { JsonDatatype } from "../../types"

export const JsonFieldIcon = ({
  type,
  className,
}: {
  type: JsonDatatype
  className?: string
}) => {
  const Icon = useMemo(() => getDatatypeIcon(type), [type])
  const color = getDatatypeColor(type)

  return (
    // eslint-disable-next-line react-hooks/static-components
    <Icon className={cn(`size-4 ${color} flex-none`, className)} />
  )
}
