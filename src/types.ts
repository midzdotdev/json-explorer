export type JsonPrimitive = string | number | boolean | null

export type JsonIterable = JsonValue[] | { [key: string]: JsonValue }

export type JsonValue = JsonPrimitive | JsonIterable
