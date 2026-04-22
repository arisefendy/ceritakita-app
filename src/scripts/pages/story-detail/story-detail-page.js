import {
  loaderAbsoluteTemplate,
  removeStoryButtonTemplate,
  saveStoryButtonTemplate,
  storyDetailErrorTemplate,
  storyDetailTemplate,
} from '../../template';
import StoryDetailPresenter from './story-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import { StoryAPI } from '../../data/api';
import Database from '../../data/database';
import * as alertUtils from '../../utils/alert';

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail" aria-live="polite"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetail(message, story) {
    document.getElementById('story-detail').innerHTML = storyDetailTemplate({
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      location: story.placeName,
    });

    // Map
    await this.#presenter.showStoryDetailMap(story);
    if (this.#map && story.lat && story.lon) {
      const coordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };

      this.#map.changeCamera(coordinate);
      this.#map.addMarker(coordinate, markerOptions, popupOptions, false);
    }

    // Bookmark button
    this.#presenter.showSaveButton();
  }

  async populateStoryDetailError(message, type) {
    document.getElementById('story-detail').innerHTML = storyDetailErrorTemplate(message, type);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    document.getElementById('bookmark-container').innerHTML = saveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    alertUtils.showSuccess(message);
  }

  saveToBookmarkFailed(message) {
    alertUtils.showError(message);
  }

  renderRemoveButton() {
    document.getElementById('bookmark-container').innerHTML = removeStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    alertUtils.showSuccess(message);
  }

  removeFromBookmarkFailed(message) {
    alertUtils.showError(message);
  }

  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    const containerEl = document.getElementById('map-loading-container');
    if (!containerEl) return;
    containerEl.innerHTML = loaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}
