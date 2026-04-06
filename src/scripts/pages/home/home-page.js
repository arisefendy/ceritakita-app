import {
  loaderAbsoluteTemplate,
  storiesListEmptyTemplate,
  storiesListErrorTemplate,
  storyItemTemplate,
} from '../../template';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import { StoryAPI } from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
    
      <section class="container">
        <h1 class="section-title">Cerita dari Pengguna</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialStoriesAndMap();
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story.lat && story.lon) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(storyItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = storiesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = storiesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
