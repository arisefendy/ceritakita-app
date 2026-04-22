// CSS imports
import '../styles/styles.css';
import '../styles/responsive.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app';
import Camera from './utils/camera';
import Database from './data/database';
import { registerServiceWorker } from './utils';
import { syncPendingStories } from './utils/sync';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector('#skip-link'),
  });
  await app.renderPage();

  await registerServiceWorker();

  if (navigator.onLine) {
    await syncPendingStories();
  }

  let isSyncing = false;
  window.addEventListener('online', async () => {
    if (isSyncing) return;

    isSyncing = true;
    await syncPendingStories();

    isSyncing = false;
  });

  window.addEventListener('data-synced', async () => {
    setTimeout(async () => {
      await app.renderPage();
    }, 300);
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    // Stop all active media
    Camera.stopAllStreams();
  });
});
