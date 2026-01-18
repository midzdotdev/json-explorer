import { useEffect, useRef } from "react"
import { Button } from "@heroui/react"
import { intersperse } from "../../utils/intersperse"
import { ChevronRight } from "lucide-react"
import { getJsonValueType } from "./utils/datatypes"
import { getJsonValueByPath } from "./utils/traversal"
import type { JsonValue, JsonDatatype } from "../../types"
import { JsonFieldIcon } from "./JsonFieldIcon"

interface PathSegment {
  type: JsonDatatype
  text: string
  path: string[]
}

const rootSegment: PathSegment = {
  type: "object",
  text: "root",
  path: [],
}

export const EditorPath = ({
  value,
  path,
  onNavigate,
}: {
  value: JsonValue
  path: string[]
  onNavigate: (path: string[]) => void
}) => {
  const pathScrollRef = useRef<HTMLDivElement>(null)

  const segments: PathSegment[] = [
    rootSegment,
    ...path.map<PathSegment>((key, index) => {
      const segmentPath = path.slice(0, index + 1)
      const segmentValue = getJsonValueByPath(value, segmentPath)
      const segmentType = getJsonValueType(segmentValue)

      return {
        type: segmentType,
        text: key,
        path: segmentPath,
      }
    }),
  ]

  useEffect(() => {
    const scrollContainer = pathScrollRef.current
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth
    }
  }, [path])

  return (
    <div className="overflow-hidden rounded-xl bg-content1">
      <div
        ref={pathScrollRef}
        className="flex flex-row items-center overflow-x-auto p-3"
      >
        {intersperse(
          segments.map(({ text, type, path }, index) => (
            <Button
              key={`segment-${index}`}
              as="button"
              size="sm"
              variant="light"
              className="min-w-0 flex-none cursor-pointer font-mono"
              onPress={() => onNavigate(path)}
              startContent={<JsonFieldIcon type={type} />}
              disabled={index === segments.length - 1}
            >
              {text}
            </Button>
          )),
          (index) => (
            <ChevronRight
              key={index}
              className="size-4 flex-none text-default-500"
            />
          ),
        )}
      </div>
    </div>
  )
}
