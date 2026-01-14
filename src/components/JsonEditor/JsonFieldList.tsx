import { Box, Hash, List, Power, Slash, Type } from "lucide-react"
import { useCallback, useMemo, useState, type ReactNode } from "react"
import type { JsonValue } from "../../types"
import { CollapseToggle } from "./CollapseToggle"

type TypedJsonValue =
  | { type: "null"; value: null }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "object"; value: { [key: string]: JsonValue } }
  | { type: "array"; value: JsonValue[] }

function getTypedJsonValue(value: JsonValue): TypedJsonValue {
  switch (true) {
    case value === null:
      return { type: "null", value }
    case value instanceof Array:
      return { type: "array", value }
    case typeof value === "object":
      return { type: "object", value }
    case typeof value === "string":
      return { type: "string", value }
    case typeof value === "number":
      return { type: "number", value }
    case typeof value === "boolean":
      return { type: "boolean", value }
    default:
      throw new Error(`Unexpected JSON value: ${String(value)}`)
  }
}

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
}: {
  value: JsonValue
  onNavigateField: (path: string[]) => void
  depth?: number
  fieldKey?: string | null
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const typedValue = getTypedJsonValue(value)

  const fields = getJsonFields(value)

  const isExpandable =
    typedValue.type === "object" || typedValue.type === "array"

  const detailText = useMemo(
    () =>
      fields === null
        ? String(value)
        : `${fields.length} item${fields.length !== 1 ? "s" : ""}`,
    [fields, value],
  )

  const Icon = {
    null: Slash,
    string: Type,
    number: Hash,
    boolean: Power,
    object: Box,
    array: List,
  }[typedValue.type]

  const getNestedFields = useCallback((): ReactNode => {
    return (fields ?? []).map(([key, value]) => {
      return (
        <JsonFieldList
          key={key}
          value={value}
          depth={depth + 1}
          fieldKey={key}
          onNavigateField={(path) => onNavigateField([key, ...path])}
        />
      )
    })
  }, [fields, onNavigateField, depth])

  const KeyTag = isExpandable ? "button" : "span"

  if (depth === 0) {
    return getNestedFields()
  }

  return (
    <>
      <div className="flex h-10 flex-row items-stretch gap-2 border-b border-divider">
        <div
          className="flex w-3/5 items-center gap-2"
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          {!isExpandable ? (
            <div className="h-4 w-4" />
          ) : (
            <CollapseToggle isOpen={isExpanded} setIsOpen={setIsExpanded} />
          )}
          <KeyTag
            className="font-mono [button]:cursor-pointer [button]:hover:underline"
            onClick={isExpandable ? () => onNavigateField([]) : undefined}
          >
            {fieldKey}
          </KeyTag>
        </div>

        <div className="flex w-2/5 items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" strokeWidth={3.5} />
          <span className="font-mono">{detailText}</span>
        </div>
      </div>

      {isExpanded ? getNestedFields() : false}
    </>
  )
}
