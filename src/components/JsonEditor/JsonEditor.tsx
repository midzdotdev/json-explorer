import { useMemo, useState } from "react"
import type { JsonValue } from "../../types"
import { getJsonValueByPath } from "./utils/traversal"
import { intersperse } from "../../utils/intersperse"
import { Button } from "@heroui/react"
import { ChevronRight } from "lucide-react"
import { JsonFieldList } from "./JsonFieldList"

export const JsonEditor = ({ data }: { data: JsonValue }) => {
  const [path, setPath] = useState<string[]>([])

  const currentValue = useMemo(
    () => getJsonValueByPath(data, path),
    [data, path],
  )

  return (
    <div>
      <div className="flex items-center overflow-x-auto p-3">
        {intersperse(
          [
            <Button
              key={`segment-root`}
              as="button"
              variant="light"
              className="cursor-pointer"
              onPress={() => setPath([])}
            >
              root
            </Button>,
            ...path.map((key, index) => (
              <Button
                key={`segment-${index}`}
                as="button"
                variant="light"
                className="cursor-pointer"
                onPress={() => setPath(path.slice(0, index + 1))}
              >
                {key}
              </Button>
            )),
          ],
          (index) => (
            <ChevronRight
              key={index}
              className="flex-none text-xl text-default-500"
            />
          ),
        )}
      </div>

      <JsonFieldList
        value={currentValue}
        onNavigateField={(subpath) => setPath([...path, ...subpath])}
      />
    </div>
  )
}
