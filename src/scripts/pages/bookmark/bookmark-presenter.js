import { storyMapper } from '../../data/api-mapper';
import { mapErrorMessage } from '../../utils/error-mapper';

export default class BookmarkPresenter {
  #view;
  #model;

  #stories = [];
  #keyword = '';
  #sortType = 'newest';

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
      const stories = await Promise.all(listOfStories.map(storyMapper));

      this.#stories = stories;

      this.#applyFilters();
    } catch (error) {
      console.error('initialStoriesAndMap: error:', error);
      this.#view.populateBookmarkedStoriesError(mapErrorMessage(error.message));
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }

  #applyFilters() {
    let result = [...this.#stories];

    if (this.#keyword) {
      result = result.filter((story) =>
        story.name.toLowerCase().includes(this.#keyword.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      if (this.#sortType === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    this.#view.populateBookmarkedStories(result);
  }

  setKeyword(keyword) {
    this.#keyword = keyword;
    this.#applyFilters();
  }

  setSortType(type) {
    this.#sortType = type;
    this.#applyFilters();
  }
}
