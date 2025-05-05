// 这是一个基本的Service Worker，用于缓存应用资源
const CACHE_NAME = "yipin-cache-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/yellow-paint-splatter.png",
  "/user-avatar.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果找到缓存的响应，则返回缓存
      if (response) {
        return response
      }

      // 否则，获取网络响应
      return fetch(event.request).then((response) => {
        // 检查是否是有效的响应
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // 克隆响应，因为响应是流，只能使用一次
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除不在白名单中的缓存
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
