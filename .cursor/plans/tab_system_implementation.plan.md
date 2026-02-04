---
name: ""
overview: ""
todos: []
isProject: false
---

# Tab System Implementation Plan (Updated)

## Decisions Summary

- **Initial state (B):** No tabs until first load. Show dropzone in main area until first file is loaded.
- **State management (A):** Global state with a React Context provider per tab.
- **Closing last tab:** Allowed; closing the last tab returns to the initial dropzone.
- **Tab naming:** Default to uploaded filename; add a button that opens a modal to change the name.
- **File loading:** When no tabs exist, dropping opens the file in the first tab. When tabs exist, dropping opens the file in a new tab.
- **Multiple files:** Support dropping multiple files to create multiple new tabs; drop if it becomes too complex.

---

## Current Architecture

- [src/App.tsx](src/App.tsx) holds a single document state (`data`).
- Shows [JsonFileDropzone](src/components/JsonFileDropzone.tsx) when no data is loaded.
- Shows [JsonEditor](src/components/JsonEditor/JsonEditor.tsx) when data exists.
- JsonEditor manages its own navigation path state internally.

## Proposed Architecture

### 1. Tab Data Structure

```typescript
// src/types.ts
export interface Tab {
  id: string
  name: string
  data: JsonValue | null
  path: string[]
}
```

### 2. State Management (Option A)

- **Global state:** Array of tabs and active tab ID (and “no tabs” when array is empty).
- **Per-tab context:** Each tab’s content is wrapped in a provider that supplies tab-specific state (e.g. path, setPath) so JsonEditor and children can use context instead of local state.

### 3. Initial State and File Loading

- **No tabs:** Render only the dropzone (full-area, same as today).
- **First drop (no tabs):** Create a single tab with that file’s data and filename; show tab bar + that tab’s content.
- **Drop when tabs exist:** Create a new tab per dropped file; support multiple files → multiple new tabs. If multi-file turns out too complex, implement single-file only and skip multi-file.
- **Close last tab:** Remove the tab; tab list becomes empty; show the initial dropzone again.

### 4. Tab Naming and Rename Modal

- **Default name:** Use the uploaded file’s name (e.g. from `File.name` when loading).
- **Rename:** A button (e.g. on the tab or in the tab bar) opens a modal with an input; on confirm, update that tab’s `name`.
- New component: e.g. `RenameTabModal` (HeroUI Modal + Input).

### 5. Component Structure

```
App.tsx
├── No tabs: JsonFileDropzone (with logic: onDrop → create first tab or new tabs)
├── Has tabs: TabManager
│   ├── HeroUI Tabs (headers + panels)
│   ├── Per-tab: TabContext.Provider
│   │   └── Tab content: JsonEditor (data from tab)
│   ├── Tab bar: New tab button, close per tab, rename button → RenameTabModal
│   └── Dropzone: When tabs exist, dropping adds new tab(s) (or integrate dropzone so it can add tabs)
```

- **TabManager** owns: `tabs`, `activeTabId`, `addTab`, `removeTab`, `setActiveTab`, `updateTabName`, and passes “current tab” (and maybe `onDrop`) so the first drop creates the first tab and later drops create new tabs.

### 6. Implementation Steps

1. **Types:** Add `Tab` interface in [src/types.ts](src/types.ts).
2. **TabContext:** Create `src/contexts/TabContext.tsx` for tab-specific state (path, setPath) used by JsonEditor.
3. **TabsContext:** Create `src/contexts/TabsContext.tsx` for global tab list, active tab, and operations (addTab, removeTab, setActiveTab, updateTabName).
4. **TabManager:** Create `src/components/TabManager.tsx`: render HeroUI Tabs, tab list from context, “new tab” and close buttons; when no tabs, render dropzone; when tabs, render panels with TabContext + JsonEditor per tab.
5. **Dropzone behavior:**

- Used in two places: (a) initial view when no tabs, (b) optionally when there are tabs (e.g. “add from file” or accept drop on a dedicated area).
- On drop with no tabs: create one tab (or multiple if multi-file) and set active.
- On drop with tabs: create new tab(s) for each file and set active to the first new tab.

6. **TabContent:** Create `src/components/TabContent.tsx`: wraps one tab’s content in TabContext, renders JsonEditor with `data={tab.data}`; path from context.
7. **JsonEditor:** Update [src/components/JsonEditor/JsonEditor.tsx](src/components/JsonEditor/JsonEditor.tsx) to read path/setPath from TabContext instead of local state.
8. **RenameTabModal:** Create `src/components/RenameTabModal.tsx`: modal with input, confirm/cancel; calls `updateTabName(tabId, newName)` from context.
9. **App.tsx:** Replace single-document state with TabsContext provider and either dropzone-only (no tabs) or TabManager (has tabs).

### 7. File Loading and Multi-File

- **Single file:** One tab created; name from `file.name`.
- **Multiple files (if implemented):** Loop over `acceptedFiles`, create one tab per file, names from `file.name`; set active tab to the first new tab. If this complicates state or UX too much, revert to single-file only and document “multiple files” as a future enhancement.

### 8. HeroUI Usage

- Use HeroUI `Tabs`, `Tab`, `TabPanel` for the tab bar and content panels.
- Use HeroUI `Modal` and `Input` for the rename tab modal.
- Keep existing Card/dropzone styling.

### 9. Edge Cases

- **Empty “new tab”:** If you add a “New tab” button, it can create a tab with `data: null` and `name: "Untitled"`; content can show a dropzone or placeholder until a file is loaded. (Optional for later.)
- **Rename modal:** Validate non-empty name; optional duplicate-name warning.
- **Close last tab:** No confirmation required; just clear tabs and show initial dropzone.

---

## Todos (for implementation)

- Add `Tab` interface to [src/types.ts](src/types.ts)
- Create `src/contexts/TabContext.tsx` (per-tab state: path)
- Create `src/contexts/TabsContext.tsx` (tab list, active, add/remove/rename)
- Create `src/components/TabManager.tsx` (Tabs UI, dropzone when no tabs, panels when tabs)
- Create `src/components/TabContent.tsx` (TabContext + JsonEditor)
- Implement dropzone logic: no tabs → first tab(s); has tabs → new tab(s); multi-file if feasible
- Update JsonEditor to use TabContext for path
- Create `src/components/RenameTabModal.tsx` and wire rename button
- Update [src/App.tsx](src/App.tsx) to use TabsContext and TabManager / dropzone
