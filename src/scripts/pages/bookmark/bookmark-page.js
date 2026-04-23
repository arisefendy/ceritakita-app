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
 
        <div class="bookmark-tools">
          <div class="bookmark-field">
            <label for="search-bookmark" class="bookmark-label">Cari Cerita</label>
            <div class="input-icon-wrapper">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input 
                type="search" 
                id="search-bookmark" 
                class="bookmark-search"
                placeholder="Contoh: John, Jane, Doe"
                aria-describedby="search-hint"
              />
            </div>
            <small id="search-hint">Masukkan nama pembuat cerita</small>
          </div>

          <div class="bookmark-field">
            <label for="sort-bookmark" class="bookmark-label">Urutkan</label>
            <div class="bookmark-sort-wrapper">
              <select id="sort-bookmark" class="bookmark-sort">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>

              <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </div>
            <small id="sort-hint">Pilih cara pengurutan cerita</small>
          </div>
        </div>
        
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

    this.#initTools();
  }

  #initTools() {
    const searchInput = document.getElementById('search-bookmark');
    const sortSelect = document.getElementById('sort-bookmark');

    searchInput.addEventListener('input', (event) => {
      this.#presenter.setKeyword(event.target.value);
    });

    sortSelect.addEventListener('change', (event) => {
      this.#presenter.setSortType(event.target.value);
    });
  }

  populateBookmarkedStories(stories, resetMap) {
    if (resetMap) {
      this.#map.clearMarkers();
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

  populateBookmarkedStoriesListEmpty(context, keyword) {
    if (this.#map) {
      this.#map.clearMarkers();
    }

    document.getElementById('stories-list').innerHTML = storiesListEmptyTemplate(context, keyword);
  }

  populateBookmarkedStoriesListError(message, context) {
    if (this.#map) {
      this.#map.clearMarkers();
    }

    document.getElementById('stories-list').innerHTML = storiesListErrorTemplate(message, context);
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
