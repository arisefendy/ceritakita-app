import { routes, notFoundRoute } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getAccessToken, logout } from '../utils/auth';
import {
  mainNavigationTemplate,
  unauthenticatedNavigationTemplate,
  authenticatedNavigationTemplate,
  subscribeButtonTemplate,
  unsubscribeButtonTemplate,
} from '../template';
import * as alertUtils from '../utils/alert';
import { isServiceWorkerAvailable, setupSkipToContent, transitionHelper } from '../utils';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../utils/notification-helper';

class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #skipLinkButton;

  constructor({ content, drawerButton, navigationDrawer, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.classList.toggle('active');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.classList.remove('active');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.classList.remove('active');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#navigationDrawer.children.namedItem('navlist-main');
    const navList = this.#navigationDrawer.children.namedItem('navlist');

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = unauthenticatedNavigationTemplate();
      return;
    }

    navListMain.innerHTML = mainNavigationTemplate();
    navList.innerHTML = authenticatedNavigationTemplate();

    const logoutButton = document.querySelector('#logout-button');
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const result = await alertUtils.showConfirm('Apakah Anda yakin ingin keluar?');

      if (!result.isConfirmed) return;

      logout();

      alertUtils.showSuccess('Anda telah keluar dari akun');
      location.hash = '/login';
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    if (!pushNotificationTools) return;

    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = unsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = subscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route ? route() : notFoundRoute();
    if (!page) {
      location.reload();
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(async () => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable() && getAccessToken()) {
        try {
          await navigator.serviceWorker.ready;
          await this.#setupPushNotification();
        } catch (error) {
          console.warn('Service worker belum ready:', error);
        }
      }
    });
  }
}

export default App;
