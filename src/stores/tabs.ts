import { proxy, useSnapshot } from "valtio"
import type { TabInit, JsonValue, Tab } from "../types"

type TabsState = {
  tabs: Tab[]
  activeTabId: string | null
}

export const tabsState = proxy<TabsState>({
  tabs: [],
  activeTabId: null,
})

export const addTabsFromFiles = (files: TabInit[]) => {
  const newTabs = files.map(({ name, text }) =>
    proxy<Tab>({
      id: `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      data: JSON.parse(text) as JsonValue,
      path: [],
    }),
  )

  tabsState.tabs.push(...newTabs)

  if (newTabs.length > 0) {
    // Switch to the first new tab (when adding first file or adding more)
    tabsState.activeTabId = newTabs[0].id
  }
}

export const addTabFromUrl = async (url: string, name?: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  const text = await response.text()

  return addTabsFromFiles([
    {
      name: name ?? "URL",
      text,
    },
  ])
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
