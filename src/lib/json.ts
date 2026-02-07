export type JsonPrimitive = string | number | boolean | null

export type JsonIterable = JsonValue[] | { [key: string]: JsonValue }

export type JsonValue = JsonPrimitive | JsonIterable

export const parseJson = (text: string): JsonValue => {
  return JSON.parse(text)
}

export function getJsonValueByPath(value: JsonValue, path: readonly string[]) {
  if (path.length === 0) {
    return value
  }

  const [currentKey, ...nextKeyPath] = path

  if (!value || typeof value !== "object" || value === null) {
    throw new Error(`Unable to traverse data: ${String(value)}`)
  }

  if (currentKey in (value as object) === false) {
    throw new Error(
      `Failed to find requested key "${currentKey}" in data: ${JSON.stringify(value)}`,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextData = (value as any)[currentKey]

  return getJsonValueByPath(nextData, nextKeyPath)
}
