export default class NotFoundPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async init() {
    this.#view.showNotFoundPage();
  }
}
