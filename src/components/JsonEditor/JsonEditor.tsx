import { useMemo } from "react"
import type { JsonValue } from "../../types"
import { getJsonValueByPath } from "./utils/traversal"
import { setTabPath, useTab } from "../../stores/tabs"
import { JsonFieldList } from "./JsonFieldList"
import { EditorPath } from "./EditorPath"

export const JsonEditor = ({
  tabId,
  data,
}: {
  tabId: string
  data: JsonValue
}) => {
  const tab = useTab(tabId)!

  const setPath = (newPath: string[]) => {
    setTabPath(tabId, newPath)
  }

  const currentValue = useMemo(
    () => getJsonValueByPath(data, tab.path),
    [data, tab.path],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <EditorPath
        path={tab.path}
        value={data}
        onNavigate={setPath}
        className="mx-2 border-b border-divider"
      />

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <JsonFieldList
          value={currentValue}
          onNavigateField={(subpath) => setPath([...tab.path, ...subpath])}
        />
      </div>
    </div>
  )
}
