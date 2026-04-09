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
    <li class="nav-item">
      <a href="#/new" class="nav-link btn-block primary">
        Buat Cerita <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </a>
    </li>
    <li class="nav-item">
      <a id="logout-button" class="nav-link danger" href="#/logout">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Keluar
      </a>
    </li>
  `;
}

export function storiesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list-placeholder" aria-live="polite">
      <img src="images/errors/empty-list.svg" alt="Tidak ada cerita" class="stories-list-placeholder__image">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita yang dapat ditampilkan.</p>
    </div>
  `;
}

export function storiesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list-placeholder" aria-live="assertive">
      <img src="images/errors/network-error.svg" alt="Terjadi kesalahan" class="stories-list-placeholder__image">
      <h2>Terjadi kesalahan dalam pengambilan daftar cerita</h2>
      <p>${message ? message : 'Periksa koneksi internet atau coba lagi nanti.'}</p>
    </div>
  `;
}

export function storyItemTemplate({ id, name, description, photoUrl, createdAt, placeName }) {
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img 
        class="story-item__image" 
        src="${photoUrl}" 
        alt="Foto cerita dari ${name}" 
        loading="lazy"
      />

      <div class="story-item__content">
        <h2 class="story-item__name">${name}</h2>
        <p class="story-item__description">
          ${description}
        </p>
        <div class="story-item__meta">
          <span class="story-item__date">
            <i class="fa-solid fa-calendar" aria-hidden="true"></i>
            ${showFormattedDate(createdAt, 'id-ID')}
          </span>
          <div class="story-item__location">
            <i class="fa-solid fa-map" aria-hidden="true"></i>
            <span 
              class="story-item__location__text" 
              title="${placeName || 'Tanpa lokasi'}"
            >
              ${placeName || 'Tanpa lokasi'}
            </span>
          </div>
        </div>
        <a class="story-item__read-more btn btn-primary" href="#/stories/${id}" aria-label="Lihat detail cerita dari ${name} pada ${showFormattedDate(createdAt, 'id-ID')}">
          Selengkapnya <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  `;
}

export function storyDetailErrorTemplate(message, type = 'server') {
  let imageSrc = 'images/errors/network-error.svg';
  let altText = 'Terjadi kesalahan';

  if (type === 'not-found') {
    imageSrc = 'images/errors/not-found.svg';
    altText = 'Cerita tidak ditemukan';
  }

  return `
    <div class="story-detail__error" aria-live="assertive">
      <img src=${imageSrc}
           alt=${altText}
           class="story-detail__error__image">
      <h2>Gagal memuat detail cerita</h2>
      <p>${message || 'Silakan coba lagi nanti atau gunakan jaringan lain.'}</p>
      <a href="#/" class="btn btn-primary" aria-label="Kembali ke daftar cerita">
        <i class="fas fa-arrow-left" aria-hidden="true"></i> Kembali
      </a>
    </div>
  `;
}

export function storyDetailImageTemplate({ photoUrl = null, name = '' }) {
  if (!photoUrl) {
    return `
    <div class="story-detail__image-wrapper">
      <img 
        class="story-detail__image" 
        src="images/placeholder-photo.jpg" 
        alt="Gambar placeholder karena tidak ada foto cerita" 
        loading="lazy"
      />
    </div>
  `;
  }

  return `
    <div class="story-detail__image-wrapper">
      <img 
        class="story-detail__image" 
        src="${photoUrl}" 
        alt="Foto cerita dari ${name}"
        loading="lazy"
      />
    </div>
  `;
}

export function storyDetailTemplate({ name, description, photoUrl, createdAt, location }) {
  return `
    <div class="story-detail__card">
      ${storyDetailImageTemplate({ photoUrl, name })}

      <div class="story-detail__content">
        <div class="story-detail__header">
          <h2 class="story-detail__title">${name}</h2>
          <div id="bookmark-container" class="story-detail__action"></div>
        </div>

        <div class="story-detail__meta">
          <span>
            <i class="fas fa-calendar-alt" aria-hidden="true"></i>
            ${showFormattedDate(createdAt, 'id-ID')}
          </span>
          <span>
            <i class="fa-solid fa-map" aria-hidden="true"></i>
            ${location ? `${location}` : 'Tanpa lokasi'}
          </span>
        </div>

        <p class="story-detail__description">
          ${description}
        </p>

        <div class="story-detail__map-section">
          <h3 class="story-detail__map-title">Lokasi Cerita</h3>
          <div class="story-detail__map__container">
            ${
              location
                ? `
                  <div id="map" class="story-detail__map"></div>
                  <div id="map-loading-container"></div>
                `
                : `
                  <div class="story-detail__map--placeholder">
                    <i class="fa-solid fa-map" aria-hidden="true"></i>
                    <p>Lokasi tidak ditambahkan pada cerita ini</p>
                  </div>
                `
            }
          </div>
        </div>

        <a href="#/" class="btn btn-primary" aria-label="Kembali ke daftar cerita">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Kembali
        </a>
      </div>
    </div>
  `;
}

export function saveStoryButtonTemplate() {
  return `
    <button 
      id="story-detail-save" 
      class="btn btn-transparent story-detail__bookmark-btn"
      aria-label="Simpan cerita"
    >
      <i class="fa-regular fa-bookmark" aria-hidden="true"></i> Simpan
    </button>
  `;
}

export function removeStoryButtonTemplate() {
  return `
    <button 
      id="story-detail-remove" 
      class="btn btn-success story-detail__bookmark-btn"
      aria-label="Hapus dari tersimpan"
    >
      <i class="fa-regular fa-circle-check" aria-hidden="true"></i> Tersimpan
    </button>
  `;
}
