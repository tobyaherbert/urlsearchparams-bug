import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    const response = new Response('Internal Server Error', { status: 500 })
    event.respondWith(response)
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)

  if (url.pathname === '/mirror') {
    try {
      return new Response(JSON.stringify({
        contentType: event.request.headers.get('Content-Type')
      }))
    } catch (e) {
      return new Response(e.message || e.toString(), { status: 500 })
    }
  }

  try {
    const page = await getAssetFromKV(event, {})
    const response = new Response(page.body, page)
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'unsafe-url')
    return response
  } catch (e) {
    const response = await getAssetFromKV(event, {
      mapRequestToAsset: (request) => {
        const origin = new URL(request.url).origin
        return new Request(`${origin}/404.html`, request)
      }
    })

    return new Response(response.body, { ...response, status: 404 })
  }
}
