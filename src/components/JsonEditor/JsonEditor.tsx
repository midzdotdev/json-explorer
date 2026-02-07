import { useCallback, useMemo } from "react"
import { getJsonValueByPath, type JsonValue } from "../../lib/json"
import { addTabFromLink, setTabPath, useTab } from "../../lib/tabs"
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

  const onValuePress = useCallback(
    async (path: string[]) => {
      const value = getJsonValueByPath(data, [...tab.path, ...path])

      let hasLoadedLink = false

      if (typeof value === "string" && URL.canParse(value)) {
        const response = await fetch(value)

        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          await addTabFromLink(tabId, path, response)
          hasLoadedLink = true
        }
      }

      if (!hasLoadedLink) {
        await navigator.clipboard.writeText(JSON.stringify(value))
      }
    },
    [data, tabId, tab.path],
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
          onValuePress={onValuePress}
        />
      </div>
    </div>
  )
}
