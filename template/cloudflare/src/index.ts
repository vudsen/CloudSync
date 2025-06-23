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
    const authorization = request.headers.get('Authorization')
    if (!authorization || authorization !== env.TOKEN) {
      // TODO, denied
    }
    const sp = new URL(request.url).searchParams
    const key = sp.get('key')
    if (!key) {
      return new Response('Key not specified', {
        status: 400
      })
    }
    switch (request.method) {
    case 'GET' : return new Response(await env.CloudSync.get(key))
    case 'POST' : {
      await env.CloudSync.put(key, await request.text())
      return new Response()
    }
    case 'DELETE': {
      await env.CloudSync.delete(key)
      return new Response()
    }
    default: return new Response('Unsupported method', {
      status: 400
    })
    }
  },
} satisfies ExportedHandler<Env>
