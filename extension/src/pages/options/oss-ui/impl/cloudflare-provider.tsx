import type { OssUiProvider } from '../types.ts'
import type { ReactNode } from 'react'
import { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import type { CloudflareOSSConfig } from '@/oss/remote/cloudflare.tsx'
import Translation from '@/component/Translation.tsx'
import { OssType } from '@/oss/type.ts'
import { registerUiProvider } from '../factory.ts'
import ControlledInput from '@/component/validation/ControlledInput.tsx'
import {Link} from "@heroui/react";

type Inputs = {
  name: string
  endpoint: string
  token: string
}


const cloudflareProvider: OssUiProvider = {
  isSupported(): Promise<ReactNode> {
    return Promise.resolve(null)
  },
  ConfigFormComponent: (props) => {
    const entity = props.oldEntity as CloudflareOSSConfig | undefined
    const {
      getValues,
      trigger,
      control,
    } = useForm<Inputs>()

    useImperativeHandle(props.ref, () => ({
      async apply() {
        const r = await trigger()
        if (!r) {
          return
        }
        const values = getValues()
        return {
          ...props.oldEntity,
          ...values,
          id: props.oldEntity?.id ?? Date.now().toString(10),
          type: OssType.CLOUDFLARE_KV
        } satisfies CloudflareOSSConfig
      }
    }))

    const gotoDocumentation = () => {
      chrome.tabs.create({ url: 'https://github.com/vudsen/CloudSync/tree/master/template/cloudflare' })
    }

    return (
      <form className="my-3 space-y-3">
        <ControlledInput
          rules={{ required: true }}
          control={control}
          name="name"
          inputProps={{ label: <Translation i18nKey="name"/>, isRequired: true, defaultValue: entity?.name }}
        />
        <ControlledInput
          rules={{ required: true }}
          control={control}
          name="endpoint"
          inputProps={{ label: 'Endpoint', isRequired: true, defaultValue: entity?.endpoint, placeholder: 'https://<namespace_name>.<username>.workers.dev' }}
        />
        <ControlledInput
          control={control}
          name="token"
          rules={{ required: true }}
          inputProps={{ label: 'Token', isRequired: true, defaultValue: entity?.token }}
        />
        <Link size="sm" color="primary" isBlock showAnchorIcon className="cursor-pointer" onPress={gotoDocumentation}>
          <Translation i18nKey="documentation"/>
        </Link>
      </form>
    )
  }
}

registerUiProvider(OssType.CLOUDFLARE_KV, cloudflareProvider)