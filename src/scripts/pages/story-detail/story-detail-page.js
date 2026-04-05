import {
  loaderAbsoluteTemplate,
  removeStoryButtonTemplate,
  saveStoryButtonTemplate,
  storyDetailErrorTemplate,
  storyDetailTemplate,
} from '../../template';
import StoryDetailPresenter from './story-detail-presenter';
import { StoryAPI } from '../../data/api';
import { parseActivePathname } from '../../routes/url-parser';

export default class StoryDetailPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetail(message, story) {
    document.getElementById('story-detail').innerHTML = storyDetailTemplate({
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
    });

    // Map
    await this.#presenter.showStoryDetailMap(story);

    // Bookmark button
    this.#presenter.showSaveButton();
  }

  async populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = storyDetailErrorTemplate(message);
  }

  async initialMap() {
    // todo
  }

  renderSaveButton() {
    document.getElementById('bookmark-container').innerHTML = saveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      alert('Fitur simpan akan segera hadir');
    });
  }

  renderRemoveButton() {
    document.getElementById('bookmark-container').innerHTML = removeStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      alert('Fitur simpan akan segera hadir');
    });
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
