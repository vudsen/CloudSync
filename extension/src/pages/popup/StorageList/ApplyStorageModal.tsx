import React, { useImperativeHandle, useState } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import type { HostData } from '@/store/oss/ossSlice.ts'
import createOssTemplate from '@/oss/template.ts'
import store from '@/store'
import { addToast } from '@heroui/toast'
import { sendMessageToBackground } from '@/util/extension.ts'
import Translation from '@/component/Translation.tsx'

export interface ApplyStorageModalRef {
  apply: (data: HostData) => void
}

export interface ApplyStorageModalProps {
  ref: React.RefObject<ApplyStorageModalRef | null>
}

const ApplyStorageModal: React.FC<ApplyStorageModalProps> = (props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [data, setData] = useState<HostData>()
  
  useImperativeHandle(props.ref, () => ({
    apply: (data: HostData) => {
      setData(data)
      onOpen()
    }
  }))

  const doApply = () => {
    if (!data) {
      console.error('Data is null')
      return
    }
    const state = store.store.getState()
    const ossConfig = state.oss.configs.find(c => c.id === data.ossId)
    if (!ossConfig) {
      addToast({
        title: 'Failed To Apply',
        description: 'OSS config not found',
        color: 'danger',
      })
      return
    }
    const oss = createOssTemplate(ossConfig)
    ;(async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      const tab = tabs[0]
      if (!tab|| !tab.id) {
        addToast({
          title: 'Failed To Apply',
          description: 'No tab available',
          color: 'danger',
        })
        return
      }
      const items = await oss.queryStorages(data.remoteKey)
      await sendMessageToBackground('SynchronousStorage', {
        tabId: tab.id,
        items
      })
    })().catch(e => {
      console.error(e)
      addToast({
        title: 'Failed To Apply',
        description: e.message,
        color: 'danger',
      })
    }).finally(() => {
      onClose()
    })
  }
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {
          (onClose) => (
            <>
              <ModalHeader>
                <Translation i18nKey="applyStorage"/>
              </ModalHeader>
              <ModalBody>
                <Translation i18nKey="applyStorageMsg"/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  <Translation i18nKey="cancel"/>
                </Button>
                <Button color="primary" onPress={doApply}>
                  <Translation i18nKey="confirm"/>
                </Button>
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default ApplyStorageModal