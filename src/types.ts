export type JsonPrimitive = string | number | boolean | null

export type JsonIterable = JsonValue[] | { [key: string]: JsonValue }

export type JsonValue = JsonPrimitive | JsonIterable

export type JsonTypedValue =
  | { type: "null"; value: null }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "object"; value: { [key: string]: JsonValue } }
  | { type: "array"; value: JsonValue[] }

export type JsonDatatype = JsonTypedValue["type"]

export interface Tab {
  id: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  path: string[]
}

export interface DroppedFile {
  name: string
  json: string
}
