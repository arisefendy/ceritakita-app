import NotFoundPresenter from './not-found-presenter';

export default class NotFoundPage {
  #presenter = null;

  async render() {
    return `
      <section class="not-found container">
        <div class="not-found__content">
          <img src="/images/errors/not-found.svg" alt="Halaman tidak ditemukan" class="not-found__image" />
          <h1 class="not-found__title">Halaman Tidak Ditemukan</h1>
          <p class="not-found__message">
            Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
          </p>
          <a href="#/" class="btn btn-primary not-found__button">
            <i class="fas fa-home"></i> Kembali ke Beranda
          </a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NotFoundPresenter(this);
    await this.#presenter.init();
  }

  showNotFoundPage() {
    console.log('Not Found Page Loaded');
  }
}
