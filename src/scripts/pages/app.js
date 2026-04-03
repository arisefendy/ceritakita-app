import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getAccessToken } from '../utils/auth';
import {
  mainNavigationTemplate,
  unauthenticatedNavigationTemplate,
  authenticatedNavigationTemplate,
} from '../template';

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
    logoutButton.addEventListener('click', () => {
      alert('Logout button diklik');
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route();
    if (!page) {
      location.reload();
    }

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    scrollTo({ top: 0, behavior: 'instant' });
    this.#setupNavigationList();
  }
}

export default App;
