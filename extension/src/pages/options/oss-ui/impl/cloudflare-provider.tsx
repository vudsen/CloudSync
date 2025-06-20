import type { OssUiProvider } from '../types.ts'
import type { ReactNode } from 'react'
import { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@heroui/react'
import type { CloudflareOSSConfig } from '@/oss/remote/cloudflare.tsx'
import Translation from '@/component/Translation.tsx'
import { OssType } from '@/oss/type.ts'
import { registerUiProvider } from '../factory.ts'

type Inputs = {
  name: string
  apiToken: string
  namespaceId: string
  accountId: string
}

const cloudflareProvider: OssUiProvider = {
  isSupported(): Promise<ReactNode> {
    return Promise.resolve(null)
  },
  ConfigFormComponent: (props) => {
    const entity = props.oldEntity as CloudflareOSSConfig | undefined
    const {
      register,
      getValues
    } = useForm<Inputs>()

    useImperativeHandle(props.ref, () => ({
      apply() {
        const values = getValues()
        return {
          ...props.oldEntity,
          ...values,
          id: props.oldEntity?.id ?? Date.now().toString(10),
          type: OssType.CLOUDFLARE_KV
        } satisfies CloudflareOSSConfig
      }
    }))

    return (
      <div className="my-3">
        <Input isRequired label={<Translation i18nKey="name"/>} {...register('name')} defaultValue={entity?.name} classNames={{ base: 'my-2' }}/>
        <Input isRequired label="Api Token" {...register('apiToken')} defaultValue={entity?.apiToken} classNames={{ base: 'my-2' }}/>
        <Input isRequired label="Namespace Id" {...register('namespaceId')} defaultValue={entity?.namespaceId} classNames={{ base: 'my-2' }}/>
        <Input isRequired label="Account Id" {...register('accountId')} defaultValue={entity?.accountId} classNames={{ base: 'my-2' }}/>
      </div>
    )
  }
}

registerUiProvider(OssType.CLOUDFLARE_KV, cloudflareProvider)