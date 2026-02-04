import { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react"
import { updateTabName, useTab } from "../stores/tabs"

export function RenameTabModal({
  tabId,
  onClose,
}: {
  tabId: string | null
  onClose: () => void
}) {
  const tab = useTab(tabId)

  const isOpen = tabId != null && tab != null

  if (!isOpen) return null

  return (
    <RenameTabModalInner
      tabId={tabId!}
      onClose={onClose}
      updateTabName={updateTabName}
    />
  )
}

function RenameTabModalInner({
  tabId,
  onClose,
  updateTabName,
}: {
  tabId: string | null
  onClose: () => void
  updateTabName: (id: string, name: string) => void
}) {
  const tab = useTab(tabId)

  const [nameInput, setNameInput] = useState("")

  const displayedName = tab?.name ?? nameInput
  const newName = displayedName.trim()

  const handleConfirm = () => {
    if (newName.length === 0) return

    updateTabName(tab!.id, newName)
    onClose()
  }

  return (
    <Modal
      isOpen={tabId !== null}
      onClose={onClose}
      placement="center"
      size="md"
    >
      <ModalContent>
        <ModalHeader>Rename tab</ModalHeader>
        <ModalBody>
          <Input
            label="Tab name"
            value={displayedName}
            onValueChange={setNameInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleConfirm()
              }
            }}
            autoFocus
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isDisabled={newName.length === 0}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
