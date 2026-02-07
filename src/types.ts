import type { JsonValue } from "./lib/json"

export type JsonTypedValue =
  | { type: "null"; value: null }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "object"; value: { [key: string]: JsonValue } }
  | { type: "array"; value: JsonValue[] }

export type JsonDatatype = JsonTypedValue["type"]
