import { useDisclosure } from '@nextui-org/react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useImperativeHandle, useState } from 'react'

type DialogConfig = {
  title: string
  message: string
  confirmBtnText?: string
  cancelBtnText?: string
  onConfirm?: () => void
  onCancel?: () => void
  color?: 'primary' | 'danger'
}

export interface ConfirmDialogRef {
  showDialog: (config: DialogConfig) => void
}

interface ConfirmDialogProps {
  ref: React.RefObject<ConfirmDialogRef | null>
}


const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const [config, setConfig] = useState<DialogConfig>({
    title: '',
    cancelBtnText: 'Cancel',
    confirmBtnText: 'Confirm',
    message: ''
  })
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

  const onConfirm = () => {
    onClose()
    config.onConfirm?.()
  }

  useImperativeHandle(props.ref, () => ({
    showDialog(config) {
      setConfig({
        cancelBtnText: 'Cancel',
        confirmBtnText: 'Confirm',
        ...config,
      })
      onOpen()
    }
  }))
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              <div className="text-primary text-lg font-bold">
                {config.title}
              </div>
            </ModalHeader>
            <ModalBody>
              {config.message}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" color="primary" onPress={onClose}>
                {config.cancelBtnText}
              </Button>
              <Button variant="solid" color={config.color} onPress={onConfirm}>
                {config.confirmBtnText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ConfirmDialog
