import { tryPromisify } from 'cross-iframe-rpc'
import type { Displayable } from '@/component/Translation.tsx'
import Translation from '@/component/Translation.tsx'

type GetTranslation = typeof chrome.i18n.getMessage

let getTranslation: GetTranslation

if (import.meta.env.PROD) {
  getTranslation = chrome.i18n.getMessage
} else {
  const translationMap = new Map<string, string>()
  getTranslation = (arg0, arg1) => {
    const key = arg0 + ':' + JSON.stringify(arg1)
    const cur = translationMap.get(key)
    if (cur) {
      return cur
    }
    tryPromisify(chrome.i18n.getMessage(arg0, arg1)).then(r => {
      translationMap.set(key, r)
    }).catch(e => {
      console.error(e)
    })
    return `<${arg0}>`
  }

  // load all necessary messages
  getTranslation('error')
  getTranslation('deleteOssTip')
  getTranslation('delete')
  getTranslation('ossAlreadyExists')
  getTranslation('createFailed')
  getTranslation('cancel')
  getTranslation('confirm')
  getTranslation('storageReady')
  getTranslation('deleteTip')
}



type GetTranslationAsReactNode = (key: string, args?: Displayable | Displayable[]) => React.ReactNode

let getTranslationAsReactNode0: GetTranslationAsReactNode

if (import.meta.env.PROD) {
  getTranslationAsReactNode0 = chrome.i18n.getMessage
} else {
  getTranslationAsReactNode0 = (arg0, arg1) => {
    return (<Translation i18nKey={arg0} args={arg1} />)
  }
}

export const getTranslationAsReactNode = getTranslationAsReactNode0
export default getTranslation