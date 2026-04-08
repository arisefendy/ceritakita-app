import { storyMapper } from '../../data/api-mapper';
import { mapErrorMessage } from '../../utils/error-mapper';

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #model;

  constructor(storyId, { view, model }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
  }

  async showStoryDetailMap(story) {
    if (!story?.lat || !story?.lon) return;

    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#model.getStoryById(this.#storyId);

      if (!response.ok) {
        console.error('showStoryDetail: error:', response.message);
        this.#view.populateStoryDetailError(mapErrorMessage(response.message), 'not-found');
        return;
      }

      const story = await storyMapper(response.story);

      this.#view.populateStoryDetail(response.message, story);
    } catch (error) {
      console.error('showStoryDetail: error:', error);
      this.#view.populateStoryDetailError(mapErrorMessage(error.message));
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  showSaveButton() {
    if (this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  #isStorySaved() {
    return false;
  }
}
