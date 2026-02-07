import type { JsonValue } from "../../../lib/json"
import type { JsonDatatype, JsonTypedValue } from "../../../types"

export const getJsonValueType = (value: JsonValue) => {
  switch (true) {
    case value === null:
      return "null"
    case value instanceof Array:
      return "array"
    case typeof value === "object":
      return "object"
    case typeof value === "string":
      return "string"
    case typeof value === "number":
      return "number"
    case typeof value === "boolean":
      return "boolean"
    default:
      throw new Error(`Unexpected JSON value: ${String(value)}`)
  }
}

export function getTypedJsonValue(value: JsonValue): JsonTypedValue {
  return {
    type: getJsonValueType(value),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: value as any,
  }
}

export const datatypeColors = {
  null: "text-null-foreground",
  string: "text-string-foreground",
  number: "text-number-foreground",
  boolean: "text-boolean-foreground",
  object: "text-object-foreground",
  array: "text-array-foreground",
} satisfies Record<JsonDatatype, `text-${JsonDatatype}-foreground`>
