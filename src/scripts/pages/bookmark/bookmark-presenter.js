import { storyMapper } from '../../data/api-mapper';
import { mapErrorMessage } from '../../utils/error-mapper';

export default class BookmarkPresenter {
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
    this.#view.showStoriesListLoading();

    try {
      await this.showStoriesMap();

      const listOfStories = await this.#model.getAllStories();
      console.log('RAW from DB:', listOfStories);

      const stories = await Promise.all(listOfStories.map(storyMapper));
      console.log('Mapped stories:', stories);

      const message = 'Berhasil mendapatkan daftar cerita tersimpan';
      this.#view.populateBookmarkedStories(message, stories);
    } catch (error) {
      console.error('initialStoriesAndMap: error:', error);
      this.#view.populateBookmarkedStoriesError(mapErrorMessage(error.message));
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
}
