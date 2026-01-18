import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardBody } from "@heroui/react"
import { FileText, Upload } from "lucide-react"

export const JsonFileDropzone = ({
  onChange,
}: {
  onChange: (json: string) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false)
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log("file reading was aborted")
        reader.onerror = () => console.log("file reading has failed")
        reader.onload = () => {
          if (typeof reader.result !== "string") return

          onChange(reader.result)
        }

        reader.readAsText(file)
      })
    },
    [onChange],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <Card
          className={`transition-all ${
            isDragging ? "scale-105 border-primary" : ""
          }`}
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
                Drag &apos;n&apos; drop a JSON file here, or click to select
              </p>
              <p className="mt-2 text-sm text-default-500">
                Supports .json files
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
