import { useCallback, useState, type ReactNode } from "react"
import { pluralize } from "../../utils/pluralize"
import { CollapseToggle } from "./CollapseToggle"
import { cn } from "@heroui/react"
import { JsonFieldIcon } from "./JsonFieldIcon"
import { datatypeColors, getTypedJsonValue } from "./utils/datatypes"
import type { JsonValue } from "../../lib/json"

const INDENT_WIDTH = 16

function getJsonFields(value: JsonValue) {
  if (value === null || typeof value !== "object") {
    return null
  }

  return Object.entries(value)
}

export const JsonFieldList = ({
  value,
  depth = 0,
  fieldKey = null,
  onNavigateField,
  onValuePress,
}: {
  value: JsonValue
  onNavigateField: (path: string[]) => void
  onValuePress: (path: string[]) => void
  depth?: number
  fieldKey?: string | null
}) => {
  const fields = getJsonFields(value)

  const [isExpanded, setIsExpanded] = useState(
    fields !== null && fields.length === 1,
  )

  const typedValue = getTypedJsonValue(value)

  const isExpandable =
    typedValue.type === "object" || typedValue.type === "array"

  const typeColor = datatypeColors[typedValue.type]

  const getNestedFields = useCallback((): ReactNode => {
    return (fields ?? []).map(([key, value]) => {
      return (
        <JsonFieldList
          key={key}
          value={value}
          depth={depth + 1}
          fieldKey={key}
          onNavigateField={(path) => onNavigateField([key, ...path])}
          onValuePress={(path) => onValuePress([key, ...path])}
        />
      )
    })
  }, [fields, onNavigateField, onValuePress, depth])

  const KeyTag = isExpandable ? "button" : "span"

  if (depth === 0) {
    return getNestedFields()
  }

  return (
    <>
      <div
        className={cn(
          "group flex h-10 flex-row items-stretch gap-2 border-b border-divider bg-content1 transition-colors hover:bg-default-50",
          isExpandable && "sticky",
        )}
        style={{
          top: isExpandable ? (depth - 1) * 40 : undefined,
        }}
      >
        <div
          className="flex w-3/5 items-center gap-2"
          style={{ paddingLeft: `${depth * INDENT_WIDTH}px` }}
        >
          {!isExpandable ? (
            <div className="size-4 flex-none" />
          ) : (
            <CollapseToggle isOpen={isExpanded} setIsOpen={setIsExpanded} />
          )}

          <JsonFieldIcon type={typedValue.type} />

          <KeyTag
            className={cn(
              "truncate font-mono transition-colors",
              isExpandable && "cursor-pointer hover:underline",
            )}
            onClick={isExpandable ? () => onNavigateField([]) : undefined}
          >
            {fieldKey}
          </KeyTag>
        </div>

        <div className="flex w-2/5 items-center gap-2">
          <span
            className={cn(
              "cursor-pointer truncate font-mono",
              fields ? "text-default-400 italic" : typeColor,
            )}
            onClick={() => onValuePress([])}
          >
            {fields
              ? pluralize(fields.length, "item")
              : JSON.stringify(typedValue.value)}
          </span>
        </div>
      </div>

      {isExpanded ? (
        <div className="transition-all">{getNestedFields()}</div>
      ) : (
        false
      )}
    </>
  )
}
