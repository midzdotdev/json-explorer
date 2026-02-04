import type { Snapshot } from "valtio"
import type { Tab } from "../types"
import { JsonEditor } from "./JsonEditor/JsonEditor"

export function TabContent({ tab }: { tab: Snapshot<Tab> }) {
  return (
    <>
      {tab.data != null ? (
        <JsonEditor tabId={tab.id} data={tab.data} />
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center text-default-400">
          Load a JSON file to view
        </div>
      )}
    </>
  )
}
