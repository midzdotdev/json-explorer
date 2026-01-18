/**
 * Pluralizes a word based on a count.
 * @param count - The count to check for pluralization
 * @param singular - The singular form of the word
 * @param plural - Optional plural form. If not provided, defaults to singular + "s"
 * @returns A string with the count and correctly pluralized word
 *
 * @example
 * pluralize(1, "item") // "1 item"
 * pluralize(2, "item") // "2 items"
 * pluralize(1, "child", "children") // "1 child"
 * pluralize(2, "child", "children") // "2 children"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = count === 1 ? singular : plural ?? `${singular}s`
  return `${count} ${word}`
}
