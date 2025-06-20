import React, { useEffect } from 'react'
import { tryPromisify } from 'cross-iframe-rpc'

export type Displayable = string | number

interface TranslationProps {
  i18nKey: string
  args?: Displayable[] | Displayable
}

const Translation:React.FC<TranslationProps> = (props) => {
  if (process.env.NODE_ENV === 'production') {
    return chrome.i18n.getMessage(props.i18nKey, props.args)
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [translation, setTranslation] = React.useState<string | null>(null)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const actualArgs = Array.isArray(props.args) ? props.args : [props.args]
    tryPromisify(chrome.i18n.getMessage(props.i18nKey, actualArgs)).then(r => {
      if (r === '') {
        setTranslation(`<!!${props.i18nKey}>`)
        console.warn('missing translation: ' + props.i18nKey)
      } else {
        setTranslation(r)
      }
    }).catch(e => {
      console.error(e)
      setTranslation(props.i18nKey)
    })
  }, [props.args, props.i18nKey])
  return (
    <span>{translation}</span>
  )
}

export default Translation