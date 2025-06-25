const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*'
}


export default {
  async fetch(request, env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeader
      })
    }

    const authorization = request.headers.get('Authorization')
    if (!authorization || authorization !== env.TOKEN || env.TOKEN === undefined) {
      return new Response('Unauthorized', {
        status: 401,
        headers: corsHeader
      })
    }
    const sp = new URL(request.url).searchParams
    const key = sp.get('key')
    if (!key) {
      return new Response('Key not specified', {
        status: 400,
        headers: corsHeader
      })
    }
    switch (request.method) {
    case 'GET' : return new Response(await env.CloudSync.get(key), {
      headers: corsHeader
    })
    case 'PUT' : {
      await env.CloudSync.put(key, await request.text())
      return new Response(null, {
        headers: corsHeader
      })
    }
    case 'DELETE': {
      await env.CloudSync.delete(key)
      return new Response(null, {
        headers: corsHeader
      })
    }
    default: return new Response('Unsupported method', {
      status: 400
    })
    }
  },
} satisfies ExportedHandler<Env>
