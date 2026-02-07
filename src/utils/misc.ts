export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined
}

export function readBlobAsText(blob: Blob, encoding?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onabort = () => reject(new Error("aborted"))
    reader.onerror = () => reject(new Error("read failed"))
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("expected string"))
        return
      }
      resolve(reader.result)
    }

    reader.readAsText(blob, encoding)
  })
}

export function promisify<T, This>(
  fn: (callback: (result: T) => void) => void,
  thisArg?: This,
): Promise<T> {
  return new Promise<T>((resolve) => {
    if (thisArg !== undefined) {
      fn.call(thisArg, (result: T) => resolve(result))
    } else {
      fn((result: T) => resolve(result))
    }
  })
}
