import type { BaseOSSConfig, OSS, OSSUIProps } from '../type.ts'
import { OssType } from '../type.ts'
import { useImperativeHandle } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { Input, Switch } from '@heroui/react'

const CONSTANT_ID = '_$local' 

export type LocalOSSConfig = BaseOSSConfig & {
  useSync: boolean
}

export function createLocalConfig(useSync: boolean): LocalOSSConfig {
  return {
    useSync,
    id: CONSTANT_ID,
    name: 'Local',
    type: OssType.ACCOUNT
  }
}

type Inputs = {
  name: string
  useSync: boolean
}

export const LocalOSSUI: React.FC<OSSUIProps> = props => {
  const conf = props.oldConfig as LocalOSSConfig | undefined
  const {
    register,
    handleSubmit,
    getValues
  } = useForm<Inputs>({
    values: conf ? {
      name: conf.name,
      useSync: conf.useSync,
    } : undefined
  })

  useImperativeHandle(props.ref, () => ({
    apply(): LocalOSSConfig | undefined {
      const values = getValues()
      return {
        useSync: values.useSync,
        name: values.name,
        type: OssType.ACCOUNT,
        id: conf ? conf.id : Date.now().toString(10),
      }
    }
  }))
  
  const onSubmit: SubmitHandler<Inputs> = (data, evt) => {
    console.log(data)
    getValues()
    evt?.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" isRequired {...register('name')}/>
      <Switch {...register('useSync')}>Sync to cloud</Switch>
    </form>
  )
}



export class LocalOSS implements OSS {
  
  private storage: chrome.storage.StorageArea

  private readonly KEY_VALUE_PREFIX
  
  private readonly config: LocalOSSConfig
  
  constructor(useSync: boolean) {
    this.storage = useSync ? chrome.storage.sync : chrome.storage.local
    this.KEY_VALUE_PREFIX = 'local:key:'
    this.config = createLocalConfig(useSync)
  }

  isUnique(): boolean {
    return true
  }

  usedBytes(): Promise<number> {
    return this.storage.getBytesInUse()
  }


  async update(name: string, data: string): Promise<void> {
    await this.storage.set({ [this.KEY_VALUE_PREFIX + name]: data })
  }
  async delete(name: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    await this.storage.remove(k)
  }
  async query(name: string): Promise<string | undefined> {
    const o = await this.storage.get(this.KEY_VALUE_PREFIX + name)
    return o[this.KEY_VALUE_PREFIX + name]
  }
  async insert(name: string, data: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    await this.storage.set({
      [k]: data,
    })
  }
  getConfig(): BaseOSSConfig {
    return this.config
  }
  
}