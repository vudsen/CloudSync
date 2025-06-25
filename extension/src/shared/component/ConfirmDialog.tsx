import { useDisclosure } from '@heroui/react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React, { useImperativeHandle, useState } from 'react'
import getTranslation from '@/util/getTranslation'

export type DialogConfig = {
  title: React.ReactNode
  message?: React.ReactNode
  confirmBtnText?: string
  cancelBtnText?: string
  onConfirm?: () => void
  onCancel?: () => void
  color?: 'primary' | 'danger'
  hideCancel?: boolean
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
    cancelBtnText: getTranslation('cancel'),
    confirmBtnText: getTranslation('confirm'),
  })
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

  const onConfirm = () => {
    config.onConfirm?.()
    onClose()
  }

  useImperativeHandle(props.ref, () => ({
    showDialog(config) {
      setConfig({
        cancelBtnText: getTranslation('cancel'),
        confirmBtnText: getTranslation('confirm'),
        hideCancel: false,
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
              <div className={`text-lg font-bold ${config.color === 'danger' ? 'text-danger' : 'text-primary'}`}>
                {config.title}
              </div>
            </ModalHeader>
            <ModalBody>
              {config.message}
            </ModalBody>
            <ModalFooter>
              { config.hideCancel ?
                null :
                <Button variant="light" color="primary" onPress={onClose}>
                  {config.cancelBtnText}
                </Button>
              }
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
