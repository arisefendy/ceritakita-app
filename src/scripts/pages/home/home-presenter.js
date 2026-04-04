export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialStoriesAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesMap();

      const response = await this.#model.getStories();

      if (!response || response.length === 0) {
        this.#view.populateStoriesListEmpty();
        return;
      }

      this.#view.populateStoriesList('Berhasil mendapatkan daftar cerita', response.listStory);
    } catch (error) {
      console.error('initialStoryListAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
