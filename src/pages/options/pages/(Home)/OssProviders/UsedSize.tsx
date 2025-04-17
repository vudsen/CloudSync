import type React from 'react'
import { useEffect, useState } from 'react'
import type { BaseOSSConfig } from '@/oss/type.ts'
import { createOSSInstance } from '@/oss/factory.ts'
import { Skeleton } from '@nextui-org/react'

interface UsedSizeProps {
  config: BaseOSSConfig
}

export const UsedSize: React.FC<UsedSizeProps> = (props) => {
  const [size, setSize] = useState<number | undefined>()
  useEffect(() => {
    const oss = createOSSInstance(props.config)
    oss.usedBytes().then(r => {
      setSize(r)
    }).catch(e => {
      console.log(e)
    })
  }, [props.config])
  if (size === undefined) {
    return (
      <Skeleton className="w-16 rounded-lg">
        <div className="h-3 w-16 rounded-lg bg-default-300" />
      </Skeleton>
    )
  }
  return (
    <div>
      {size} byte
    </div>
  )
}