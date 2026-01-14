export function intersperse<T, U>(
  arr: T[],
  getSeparator: (index: number) => U,
): (T | U)[] {
  if (arr.length < 2) return arr;

  const output: (T | U)[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    output.push(getSeparator(output.length), arr[i]);
  }

  return output;
}
