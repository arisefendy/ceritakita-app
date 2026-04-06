import { storyMapper } from '../../data/api-mapper';

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

      const stories = response.listStory;
      const mappedStories = await Promise.all(stories.map((story) => storyMapper(story)));

      this.#view.populateStoriesList(response.message, mappedStories);
    } catch (error) {
      console.error('initialStoryListAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
