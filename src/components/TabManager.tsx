import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Tabs, Tab, Button, cn } from "@heroui/react"
import { Pencil, Plus, X } from "lucide-react"
import type { DroppedFile, Tab as TabType } from "../types"
import {
  addTabsFromFiles,
  removeTab,
  setActiveTab,
  tabsState,
} from "../stores/tabs"
import { JsonFileDropzone, readFileAsJson } from "./JsonFileDropzone"
import { TabContent } from "./TabContent"
import { RenameTabModal } from "./RenameTabModal"
import { useSnapshot, type Snapshot } from "valtio"

function TabTitle({
  tab,
  onRename,
  onClose,
}: {
  tab: Snapshot<TabType>
  onRename: () => void
  onClose: () => void
}) {
  return (
    <>
      <span className="max-w-[120px] truncate font-semibold">{tab.name}</span>

      <div
        className="flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="Rename tab"
          onPress={onRename}
          className="flex-none data-[hover=true]:bg-[oklch(1_0_0/.1)]"
        >
          <Pencil className="size-3" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="Close tab"
          onPress={onClose}
          className="flex-none data-[hover=true]:bg-[oklch(1_0_0/.1)]"
        >
          <X className="size-3" />
        </Button>
      </div>
    </>
  )
}

export function TabManager() {
  const { tabs, activeTabId } = useSnapshot(tabsState)
  const [renameTabId, setRenameTabId] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const results = await Promise.all(
      acceptedFiles.map((f) => readFileAsJson(f).catch(() => null)),
    )
    const files = results.filter((f): f is DroppedFile => f != null)
    if (files.length) addTabsFromFiles(files)
  }, [])

  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setIsDraggingOver(true),
    onDragLeave: () => setIsDraggingOver(false),
    onDropAccepted: () => setIsDraggingOver(false),
    onDropRejected: () => setIsDraggingOver(false),
  })

  if (tabs.length === 0) {
    return <JsonFileDropzone onFilesLoaded={addTabsFromFiles} />
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex max-h-screen min-h-screen flex-1 flex-col bg-content1",
        isDraggingOver && "border-b transition-colors",
      )}
    >
      <input {...getInputProps()} className="hidden" />

      <div className="flex flex-none items-center gap-2 p-2">
        <Button
          variant="light"
          aria-label="Add JSON file as new tab"
          onPress={open}
        >
          <Plus className="size-5" />
          Load File
        </Button>
      </div>

      <Tabs
        selectedKey={activeTabId ?? undefined}
        onSelectionChange={(k) => setActiveTab(k as string)}
        variant="solid"
        fullWidth
        placement="top"
        classNames={{
          tabWrapper: "min-h-0 flex flex-col flex-1",
          tabList: "rounded-none bg-content1 flex-none",
          cursor: "bg-content1",
          tab: "h-auto w-auto",
          tabContent: "flex flex-none items-center gap-1",
          panel: "min-h-0 flex flex-1",
        }}
        size="md"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            as={"a"}
            title={
              <TabTitle
                tab={tab}
                onRename={() => setRenameTabId(tab.id)}
                onClose={() => removeTab(tab.id)}
              />
            }
            titleValue={tab.name}
          >
            <TabContent tab={tab} />
          </Tab>
        ))}
      </Tabs>

      <RenameTabModal
        tabId={renameTabId}
        onClose={() => setRenameTabId(null)}
      />
    </div>
  )
}
