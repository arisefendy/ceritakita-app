import { showFormattedDate } from './utils';

export function loaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function loaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function mainNavigationTemplate() {
  return `
    <li class="nav-item">
      <a href="#/" class="nav-link">Daftar Cerita</a>
    </li>
    <li class="nav-item">
      <a href="#/bookmark" class="nav-link">Cerita Tersimpan</a>
    </li>
  `;
}

export function unauthenticatedNavigationTemplate() {
  return `
    <li class="nav-item push-notification-tools"></li>
    <li class="nav-item">
      <a href="#/login" class="nav-link">Masuk</a>
    </li>
    <li class="nav-item">
      <a href="#/register" class="nav-link">Daftar</a>
    </li>
  `;
}

export function authenticatedNavigationTemplate() {
  return `
    <li class="nav-item push-notification-tools"></li>
    <li class="nav-item">
      <a href="#/add-story" class="nav-link primary">
        Buat Cerita <i class="fas fa-plus"></i>
      </a>
    </li>
    <li class="nav-item">
      <a id="logout-button" class="nav-link danger" href="#/logout">
        <i class="fas fa-sign-out-alt"></i> Keluar
      </a>
    </li>
  `;
}

export function storiesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list-empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita yang dapat ditampilkan.</p>
    </div>
  `;
}

export function storiesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list-error">
      <h2>Terjadi kesalahan dalam pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function storyItemTemplate({ id, name, description, photoUrl, createdAt, lat, lon }) {
  return `
    <article class="story-item" data-storyid="${id}">
      <img 
        class="story-item__image" 
        src="${photoUrl}" 
        alt="Foto cerita dari ${name}" 
        loading="lazy"
      />

      <div class="story-item__content">
        <h3 class="story-item__name">${name}</h3>
        <p class="story-item__description">
          ${description}
        </p>
        <div class="story-item__meta">
          <span class="story-item__date">
            <i class="fas fa-calendar-alt"></i>
            ${showFormattedDate(createdAt, 'id-ID')}
          </span>
          ${
            lat && lon
              ? `
                  <span class="story-item__location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${lat.toFixed(3)}, ${lon.toFixed(3)}
                  </span>
                `
              : `
                  <span class="story-item__location">
                    <i class="fas fa-map-marker-alt"></i>
                    Tidak ada lokasi
                  </span>
                `
          }
        </div>
        <a class="story-item__read-more btn btn-primary" href="#/stories/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `;
}
