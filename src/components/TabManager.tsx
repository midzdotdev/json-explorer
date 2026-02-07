import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Tabs, Tab, Button, cn } from "@heroui/react"
import {
  ClipboardPaste,
  Download,
  FileText,
  Pencil,
  Plus,
  X,
} from "lucide-react"
import {
  addTabsFromClipboard,
  addTabsFromFiles,
  removeTab,
  setActiveTab,
  tabsState,
  type Tab as TabType,
} from "../lib/tabs"
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

  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: addTabsFromFiles,
    accept: { "application/json": [".json"] },
    multiple: true,
    noKeyboard: true,
    noClick: tabs.length > 0,
    onDragEnter: () => setIsDraggingOver(true),
    onDragLeave: () => setIsDraggingOver(false),
    onDropAccepted: () => setIsDraggingOver(false),
    onDropRejected: () => setIsDraggingOver(false),
  })

  if (tabs.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={cn(
          "relative flex h-screen flex-col bg-content1",
          isDraggingOver && "border-b transition-colors",
        )}
      >
        <input {...getInputProps()} className="hidden" />

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-all",
            isDraggingOver && "pointer-events-none scale-110 opacity-100",
          )}
          aria-hidden
        >
          <div className="rounded-full bg-primary-100 p-[2svh] text-primary">
            <Download className="size-[13svh]" strokeWidth={2} />
          </div>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-4",
          )}
        >
          <div className="rounded-full bg-default-100 p-4 text-default-500">
            <FileText className="h-10 w-10" strokeWidth={2} />
          </div>

          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-3xl font-medium">Drop JSON files here</p>
            <p className="text-default-500">or press to open the file picker</p>
          </div>
        </div>
      </div>
    )
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
          Load file
        </Button>

        <Button
          variant="light"
          aria-label="Load from clipboard"
          onPress={addTabsFromClipboard}
        >
          <ClipboardPaste className="size-5" />
          Load from clipboard
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
