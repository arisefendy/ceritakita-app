self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    const data = await event.data.json();

    const options = {
      body: data.options?.body || 'Ada pembaruan baru',
      icon: '/images/logo.png',
    };

    await self.registration.showNotification(data.title || 'Notifikasi', options);
  }

  event.waitUntil(chainPromise());
});
