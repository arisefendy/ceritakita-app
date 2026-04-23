import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

// Do precaching
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching
registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
    );
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://tile.openstreetmap.org';
  },
  new CacheFirst({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === self.location.origin && url.pathname.includes('marker-icon');
  },
  new CacheFirst({
    cacheName: 'marker-icons',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('unpkg.com') || url.origin.includes('leaflet');
  },
  new CacheFirst({
    cacheName: 'leaflet-assets',
  }),
);

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    let data = {
      title: 'Notifikasi Baru',
      options: {},
    };

    if (event.data) {
      try {
        data = await event.data.json();
      } catch (error) {
        console.warn('Invalid JSON:', error.message);
      }
    }

    const storyId = data?.options?.data?.id;

    const options = {
      body: data.options?.body || 'Ada pembaruan baru',
      icon: '/images/logo.png',
      data: { storyId },
      actions: [
        {
          action: 'open-detail',
          type: 'button',
          title: 'Lihat Detail',
          icon: '/images/icons/file-x128.png',
        },
      ],
    };

    await self.registration.showNotification(data.title || 'Notifikasi Baru', options);
  }

  event.waitUntil(chainPromise());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetUrl = data.storyId ? `/#/stories/${data.storyId}` : '/#/';

  event.waitUntil(
    (async () => {
      const clientsList = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        if (client.url.includes(self.location.origin)) {
          await client.focus();
          return client.navigate(targetUrl);
        }
      }

      await clients.openWindow(targetUrl);
    })(),
  );
});
