import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardBody, cn } from "@heroui/react"
import { FileText, Upload } from "lucide-react"
import type { DroppedFile } from "../types"

export function readFileAsJson(file: File): Promise<DroppedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onabort = () => reject(new Error("aborted"))
    reader.onerror = () => reject(new Error("read failed"))
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("expected string"))
        return
      }
      resolve({ name: file.name, json: reader.result })
    }
    reader.readAsText(file)
  })
}

export const JsonFileDropzone = ({
  onFilesLoaded,
}: {
  onFilesLoaded: (files: DroppedFile[]) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsDragging(false)
      const results = await Promise.all(
        acceptedFiles.map((f) => readFileAsJson(f).catch(() => null)),
      )
      const files = results.filter((f): f is DroppedFile => f != null)
      if (files.length) onFilesLoaded(files)
    },
    [onFilesLoaded],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    multiple: true,
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <Card
          className={cn(
            "transition-all duration-150",
            isDragging && "scale-105 border-primary",
          )}
          shadow="lg"
        >
          <CardBody className="flex flex-col items-center justify-center gap-4 p-12">
            <div
              className={`rounded-full p-4 transition-colors ${
                isDragging
                  ? "bg-primary-100 text-primary"
                  : "bg-default-100 text-default-500"
              }`}
            >
              {isDragging ? (
                <Upload className="h-10 w-10" strokeWidth={2} />
              ) : (
                <FileText className="h-10 w-10" strokeWidth={2} />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                Drop JSON files here, or click to select
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
