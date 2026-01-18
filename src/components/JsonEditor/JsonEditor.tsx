import { useMemo, useState } from "react"
import type { JsonValue } from "../../types"
import { getJsonValueByPath } from "./utils/traversal"
import { Card, CardBody } from "@heroui/react"
import { JsonFieldList } from "./JsonFieldList"
import { EditorPath } from "./EditorPath"

export const JsonEditor = ({ data }: { data: JsonValue }) => {
  const [path, setPath] = useState<string[]>([])

  const currentValue = useMemo(
    () => getJsonValueByPath(data, path),
    [data, path],
  )

  return (
    <div className="flex flex-col gap-4">
      <EditorPath path={path} value={data} onNavigate={setPath} />

      <Card shadow="sm" className="overflow-hidden">
        <CardBody className="p-0">
          <JsonFieldList
            value={currentValue}
            onNavigateField={(subpath) => setPath([...path, ...subpath])}
          />
        </CardBody>
      </Card>
    </div>
  )
}
