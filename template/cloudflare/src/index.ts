import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env): Promise<Response> {
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
        'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
      }
    })
    return new Response(await resp.text(), {
      status: resp.status,
      statusText: resp.statusText,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  },
} satisfies ExportedHandler<Env>
