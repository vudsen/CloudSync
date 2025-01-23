import { supportedOSS } from '@/oss/factory.ts'
import { Select, SelectItem, Tooltip } from '@nextui-org/react'
import type { ChangeEventHandler } from 'react'
import React from 'react'
import type { OssType } from '@/oss/type.ts'


interface OssSelectorProps {
  ref?: React.Ref<HTMLSelectElement>
  onChange?: (ossType: OssType) => void
}

const OssSelector: React.FC<OssSelectorProps> = props => {

  const onSelect: ChangeEventHandler<unknown> = (e) => {
    // @ts-expect-error value not exist.
    const t = e.target.value as OssType
    props.onChange?.(t)
  }
  return (
    <Select items={supportedOSS} 
      label="Select a OSS Provider" 
      size="sm" 
      color="primary" 
      isRequired ref={props.ref}
      renderValue={ossItems => (
        <>
          {
            ossItems.map((oss) => (
              <span key={oss.key}>{oss.data?.name}</span>
            ))
          }
        </>
      )}
      onChange={onSelect}>
      {
        oss => (
          <SelectItem key={oss.name} classNames={{
            base: '[&>*:nth-child(1)]:overflow-hidden',
          }}>
            <Tooltip content={oss.description}>
              <div className="text-ellipsis overflow-hidden whitespace-nowrap mr-10">
                {oss.name}
                <span className="text-slate-500 ext-ellipsis text-xs"> {oss.description}</span>
              </div>
            </Tooltip>
          </SelectItem>
        )
      }
    </Select>
  )
}

export default OssSelector
