import { cn } from "tailwind-variants"
import { datatypeColors } from "./utils/datatypes"
import type { JsonDatatype } from "../../types"
import { memo } from "react"
import {
  CircleSlash2,
  Type,
  Hash,
  Power,
  Box,
  List,
  type LucideIcon,
} from "lucide-react"

const datatypeIcons = {
  null: CircleSlash2,
  string: Type,
  number: Hash,
  boolean: Power,
  object: Box,
  array: List,
} satisfies Record<JsonDatatype, LucideIcon>

export const JsonFieldIcon = memo(
  ({ type, className }: { type: JsonDatatype; className?: string }) => {
    const Icon = datatypeIcons[type]
    const color = datatypeColors[type]

    return <Icon className={cn(`size-4 ${color} flex-none`, className)} />
  },
)
