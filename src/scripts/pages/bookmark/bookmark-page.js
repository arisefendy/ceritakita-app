import {
  loaderAbsoluteTemplate,
  storiesListEmptyTemplate,
  storiesListErrorTemplate,
  storyItemTemplate,
} from '../../template';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

export default class BookmarkPage {
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
        <h1 class="section-title">Daftar Cerita Tersimpan</h1>
 
        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialStoriesAndMap();
  }

  populateBookmarkedStories(message, stories) {
    if (stories.length <= 0) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story.lat && story.lon) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = {
          content: `
            <b>${story.name}</b><br/>
            <small>${story.description.slice(0, 50)}...</small>
          `,
        };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(storyItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateBookmarkedStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = storiesListEmptyTemplate();
  }

  populateBookmarkedStoriesError(message) {
    document.getElementById('stories-list').innerHTML = storiesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}
