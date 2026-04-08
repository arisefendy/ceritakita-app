import { routes, notFoundRoute } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getAccessToken, logout } from '../utils/auth';
import {
  mainNavigationTemplate,
  unauthenticatedNavigationTemplate,
  authenticatedNavigationTemplate,
} from '../template';
import { showConfirm, showSuccess } from '../utils/alert';
import { transitionHelper } from '../utils';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

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

      const result = await showConfirm('Apakah Anda yakin ingin keluar?');

      if (!result.isConfirmed) return;

      logout();

      showSuccess('Anda telah keluar dari akun');
      location.hash = '/login';
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
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
    });
  }
}

export default App;
