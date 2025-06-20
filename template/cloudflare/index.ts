import type { ExportedHandler,Response as CfResponse } from '@cloudflare/workers-types'
import crypto from 'node:crypto'

interface Env {
  AES_SECRET: string
  AES_IV: string
}


export default {
  async fetch(request, env): Promise<CfResponse> {
    const searchParams = new URL(request.url).searchParams
    const accountId = searchParams.get('accountId')
    const namespaceId = searchParams.get('namespaceId')
    const name = searchParams.get('name')
    const encryptedApiToken = searchParams.get('apiToken')

    const iv = Buffer.from(env.AES_IV, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-cbc', env.AES_SECRET, iv)
    let decryptedApiToken = decipher.update(encryptedApiToken, 'utf-8', 'utf-8')
    decryptedApiToken += decipher.final('utf-8')
    
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${name}`, {
      method: request.method,
      body: await request.text(),
      headers: {
        'Authorization': decryptedApiToken,
        'Content-Type': request.headers.get('Content-Type'),
      }
    })
    return new Response(await resp.text(), {
      status: resp.status,
      statusText: resp.statusText,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }) as unknown as CfResponse
  },
} satisfies ExportedHandler<Env>