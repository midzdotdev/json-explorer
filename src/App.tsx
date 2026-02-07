import { useEffect } from "react"
import { TabManager } from "./components/TabManager"
import { addTabsFromClipboardEvent } from "./lib/tabs"

const handlePaste = (e: ClipboardEvent) => {
  const target = e.target as HTMLElement

  const isEditable =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable

  if (isEditable) return

  try {
    addTabsFromClipboardEvent(e)
    e.preventDefault()
  } catch {
    // Not valid JSON, let default paste happen
  }
}

export default function App() {
  useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <TabManager />
    </div>
  )
}
