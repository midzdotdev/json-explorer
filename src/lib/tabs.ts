import { proxy, useSnapshot } from "valtio"
import { parseJson, type JsonValue } from "./json"
import { isNonNullable, promisify, readBlobAsText } from "../utils/misc"

export interface TextTabSource {
  type: "text"
}

export interface FileTabSource {
  type: "file"
  name: string
}

export interface URLTabSource {
  type: "url"
  url: string
}

export interface LinkedURLTabSource {
  type: "link"
  parentTabId: string
  path: string[]
}

export type TabSource =
  | TextTabSource
  | FileTabSource
  | URLTabSource
  | LinkedURLTabSource

export interface Tab {
  id: string
  name: string
  source: TabSource
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  path: string[]
}

export interface TabInit {
  name: string
  text: string
}

type TabsState = {
  tabs: Tab[]
  activeTabId: string | null
}

export const tabsState = proxy<TabsState>({
  tabs: [],
  activeTabId: null,
})

const makeTabProxy = (init: {
  id?: string
  name?: string
  source: TabSource
  data: JsonValue
  path?: string[]
}) => {
  return proxy<Tab>({
    id: init.id ?? `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: init.name ?? "New Tab",
    source: init.source,
    data: init.data,
    path: init.path ?? [],
  })
}

const addTabs = (tabs: Tab[]) => {
  tabsState.tabs.push(...tabs)

  if (tabs.length > 0) {
    // Switch to the first new tab (when adding first file or adding more)
    tabsState.activeTabId = tabs[0].id
  }
}

export const addTabsFromFiles = async (files: File[]) => {
  const newTabs = await Promise.all(
    files.map(async (file) => {
      const text = await readBlobAsText(file)
      const data = parseJson(text)

      return makeTabProxy({
        name: file.name,
        source: { type: "file", name: file.name },
        data,
      })
    }),
  )

  addTabs(newTabs)
}

export const addTabFromLink = async (
  tabId: string,
  path: string[],
  response: Response,
) => {
  const text = await response.text()
  const data = parseJson(text)

  const newTab = makeTabProxy({
    name: path.slice(-3).join("."),
    source: { type: "link", parentTabId: tabId, path },
    data,
  })

  addTabs([newTab])
}

export const addTabFromUrl = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  const text = await response.text()
  const data = parseJson(text)

  const newTab = makeTabProxy({
    name: url,
    source: { type: "url", url },
    data,
  })

  addTabs([newTab])
}

export const addTabsFromClipboard = async () => {
  const items = await navigator.clipboard.read()

  const newTabs = await Promise.all(
    items.map(async (item) => {
      const blob = await item.getType("text/plain")
      const text = await readBlobAsText(blob)

      return makeTabProxy({
        name: "Clipboard",
        source: { type: "text" },
        data: parseJson(text),
      })
    }),
  )

  addTabs(newTabs)
}

export const addTabsFromClipboardEvent = async (e: ClipboardEvent) => {
  const items = e.clipboardData?.items

  if (!items) return

  const newTabs = (
    await Promise.all(
      Array.from(items).map(async (item) => {
        if (item.type !== "text/plain") return null

        const text = await promisify(item.getAsString, item)

        if (!text) return null

        return makeTabProxy({
          name: "Clipboard",
          source: { type: "text" },
          data: parseJson(text),
        })
      }),
    )
  ).filter(isNonNullable)

  addTabs(newTabs)
}

export const removeTab = (id: string) => {
  const idx = tabsState.tabs.findIndex((t) => t.id === id)
  if (idx === -1) return

  tabsState.tabs.splice(idx, 1)

  if (tabsState.activeTabId === id) {
    if (tabsState.tabs.length === 0) {
      tabsState.activeTabId = null
    } else {
      const nextIdx = Math.min(Math.max(0, idx), tabsState.tabs.length - 1)
      tabsState.activeTabId = tabsState.tabs[nextIdx]?.id ?? null
    }
  }
}

export const setActiveTab = (id: string | null) => {
  tabsState.activeTabId = id
}

export const updateTabName = (id: string, name: string) => {
  const trimmed = name.trim()
  const tab = tabsState.tabs.find((t) => t.id === id)
  if (tab) {
    tab.name = trimmed || tab.name
  }
}

export const updateTab = (
  id: string,
  patch: Partial<Pick<Tab, "path" | "data" | "name">>,
) => {
  const tab = tabsState.tabs.find((t) => t.id === id)
  if (tab) {
    Object.assign(tab, patch)
  }
}

export const setTabPath = (id: string, path: string[]) => {
  const tab = tabsState.tabs.find((t) => t.id === id)
  if (tab) {
    tab.path = path
  }
}

export const useTab = (id: string | null) => {
  const tabs = useSnapshot(tabsState).tabs

  if (id === null) return null

  return tabs.find((t) => t.id === id)!
}
