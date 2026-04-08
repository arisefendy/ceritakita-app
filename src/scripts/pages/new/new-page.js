import NewPresenter from './new-presenter';
import { StoryAPI } from '../../data/api';
import Map from '../../utils/map';
import Camera from '../../utils/camera';
import * as alertUtils from '../../utils/alert';
import { loaderAbsoluteTemplate } from '../../template';
import { setFieldValidationMessage, resetValidation } from '../../utils/validation';

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhoto = null;
  #map = null;

  async render() {
    return `
      <section class="new-story__header">
        <div class="container">
          <h1 class="new-story__header__title">Buat Cerita Baru</h1>
          <p class="new-story__header__description">
            Unggah cerita menarik yang terjadi di sekitar Anda.
          </p>
        </div>
      </section>

      <section class="new-story__content container">
        <form id="new-story-form" class="new-form" novalidate>
          <div class="form-control">
            <label for="description-input">Deskripsi Cerita</label>
            <textarea
              name="description"
              id="description-input"
              placeholder="Tulis cerita Anda... "
              required
            ></textarea>
            <small id="description-error" class="input-error"></small>
          </div>

          <div class="form-control">
            <label for="photo-input" class="new-form__photo__title">Foto Cerita</label>
            <div id="photo-more-info" class="new-form__help">
              Anda dapat menyertakan foto sebagai dokumentasi. Maksimal ukuran 1MB.
            </div>

            <div class="new-form__photo__container">
              <input
                type="file"
                name="photo"
                id="photo-input"
                accept="image/*"
                hidden
              />

              <div class="photo__actions">
                <button type="button" id="gallery-button" class="btn btn-outline btn-outline-primary">
                  Pilih dari Galeri
                </button>

                <button type="button" id="camera-button" class="btn btn-outline btn-outline-primary">
                  Buka Kamera
                </button>
              </div>

              <div id="camera-container" class="new-form__camera__container">
                <video id="camera-video" class="new-form__camera__video">
                  Video stream not available.
                </video>
                <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>

                <div class="new-form__camera__tools">
                  <select id="camera-select"></select>
                  <div class="new-form__camera__tools__buttons">
                    <button type="button" id="camera-take-button" class="btn btn-primary">
                      Ambil Foto
                    </button>
                  </div>
                </div>
              </div>

              <div id="photo-preview" class="new-form__photo__preview"></div>
            </div>
            <small id="photo-error" class="input-error"></small>
          </div>

          <div class="form-control">
            <label for="map" class="new-form__location__title">Lokasi</label>
            <p id="map-more-info" class="new-form__help">Klik pada peta untuk menentukan lokasi.</p>
            <div class="new-form__location__map__container">
              <div id="map" class="new-form__location__map" aria-describedby="map-more-info"></div>
              <div id="map-loading-container"></div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-control">
              <label for="latitude">Latitude</label>
              <input type="text" name="latitude" id="latitude" disabled />
            </div>

            <div class="form-control">
              <label for="longitude">Longitude</label>
              <input type="text" name="longitude" id="longitude" disabled />
            </div>
          </div>

          <div class="new-form__actions">
            <span id="submit-button-container">
              <button type="submit" class="btn btn-primary btn-block">Kirim Cerita</button>
            </span>
            <a class="btn btn-outline-danger" href="#/">Batal</a>
          </div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('new-story-form');
    const cameraContainer = document.getElementById('camera-container');
    const cameraButton = document.getElementById('camera-button');

    this.#setupValidation();

    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.#form._validateAll();

      const firstInvalid = this.#form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const latValue = this.#form.elements.namedItem('latitude').value;
      const lonValue = this.#form.elements.namedItem('longitude').value;

      const data = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#takenPhoto,
        lat: latValue ? parseFloat(latValue) : null,
        lon: lonValue ? parseFloat(lonValue) : null,
      };

      await this.#presenter.postNewStory(data);
    });

    document.getElementById('gallery-button').addEventListener('click', () => {
      if (this.#isCameraOpen) {
        this.#closeCamera(cameraButton, cameraContainer);
      }

      this.#form.elements.namedItem('photo').click();
    });

    cameraButton.addEventListener('click', async (event) => {
      const button = event.currentTarget;

      if (!this.#isCameraOpen) {
        await this.#openCamera(button, cameraContainer);
      } else {
        this.#closeCamera(button, cameraContainer);
      }
    });
  }

  #setupValidation() {
    const descriptionInput = document.getElementById('description-input');
    const photoInput = document.getElementById('photo-input');

    const descriptionError = document.getElementById('description-error');
    const photoError = document.getElementById('photo-error');

    const validate = (input, errorEl, options = {}) => {
      setFieldValidationMessage(input, options);
      errorEl.textContent = input.validationMessage;

      if (input.validationMessage) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorEl.focus({ preventScroll: true });
      }
    };

    descriptionInput.addEventListener('input', () => {
      validate(descriptionInput, descriptionError, { label: 'Deskripsi' });
    });

    photoInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) {
        this.#removePicture();
        validate(photoInput, photoError, { label: 'Foto', maxFileSize: 1000000 });
        return;
      }

      this.#takenPhoto = await this.#addTakenPicture(file);
      validate(photoInput, photoError, {
        label: 'Foto',
        maxFileSize: 1000000,
        fileBlob: this.#takenPhoto,
      });
    });

    this.#form._validateAll = () => {
      validate(descriptionInput, descriptionError, { label: 'Deskripsi' });
      validate(photoInput, photoError, {
        label: 'Foto',
        maxFileSize: 1000000,
        fileBlob: this.#takenPhoto,
      });
    };
  }

  #resetValidation() {
    const descriptionInput = document.getElementById('description-input');
    const photoInput = document.getElementById('photo-input');

    const descriptionError = document.getElementById('description-error');
    const photoError = document.getElementById('photo-error');

    resetValidation([
      { input: descriptionInput, errorEl: descriptionError },
      { input: photoInput, errorEl: photoError },
    ]);
  }

  async initialMap() {
    const permission = await navigator.permissions.query({
      name: 'geolocation',
    });

    if (permission.state === 'denied') {
      this.#showLocationDeniedPlaceholder();
      return;
    }

    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: true },
    );

    draggableMarker.addEventListener('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlng);

      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('latitude').value = latitude;
    this.#form.elements.namedItem('longitude').value = longitude;
  }

  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      video: document.getElementById('camera-video'),
      cameraSelect: document.getElementById('camera-select'),
      canvas: document.getElementById('camera-canvas'),
    });

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
    });
  }

  async #openCamera(button, cameraContainer) {
    this.#setupCamera();

    const isSuccess = await this.#presenter.startCamera(this.#camera);
    if (!isSuccess) return;

    cameraContainer.classList.add('open');
    this.#isCameraOpen = true;

    button.textContent = 'Tutup Kamera';
    button.classList.remove('btn-outline-primary');
    button.classList.add('btn-danger');
  }

  #closeCamera(button, cameraContainer) {
    if (this.#camera) {
      this.#camera.stop();
    }

    cameraContainer.classList.remove('open');
    this.#isCameraOpen = false;

    if (button) {
      button.textContent = 'Buka Kamera';
      button.classList.remove('btn-danger');
      button.classList.add('btn-outline-primary');
    }
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (typeof image === 'string') {
      const response = await fetch(image);
      blob = await response.blob();
    }

    this.#takenPhoto = blob;
    this.#showPhotoPreview(blob);

    return blob;
  }

  async #showPhotoPreview(blob) {
    const previewContainer = document.getElementById('photo-preview');
    const imageUrl = URL.createObjectURL(blob);

    previewContainer.innerHTML = `
      <div class="new-form__photo__preview__wrapper">
        <img src="${imageUrl}" alt="Preview Foto" />

        <button
          type="button"
          id="remove-photo-button"
          class="btn btn-outline btn-outline-danger"
        >
          Hapus Foto
        </button>
      </div>
    `;

    document.getElementById('remove-photo-button').addEventListener('click', () => {
      this.#removePicture();
    });
  }

  #removePicture() {
    this.#takenPhoto = null;

    document.getElementById('photo-preview').innerHTML = '';
    document.getElementById('photo-error').textContent = '';
    document.getElementById('photo-input').value = null;
  }

  #showLocationDeniedPlaceholder() {
    const mapContainer = document.getElementById('map');

    mapContainer.innerHTML = `
      <div class="new-form__map-placeholder">
        <i class="fa-solid fa-location-dot"></i>
        <p>Lokasi tidak diaktifkan</p>
        <small>
          Anda tetap bisa mengirim cerita tanpa lokasi.<br>
          Aktifkan izin lokasi di pengaturan browser jika diperlukan.
        </small>
      </div>
    `;
  }

  showMapError() {
    this.#showLocationDeniedPlaceholder();
  }

  showCameraError(message) {
    alertUtils.showError(message);
  }

  hideCameraContainer() {
    const cameraContainer = document.getElementById('camera-container');
    cameraContainer.classList.remove('open');
    this.#isCameraOpen = false;
  }

  storeSuccessfully(message) {
    alertUtils.showSuccess(message);
    this.clearForm();

    setTimeout(() => {
      location.href = '/';
    }, 1500);
  }

  storeFailed(message) {
    alertUtils.showError(message);
  }

  clearForm() {
    this.#form.reset();
    this.#resetValidation();
    this.#removePicture();
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = loaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Mengirim...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit">Kirim Cerita</button>
    `;
  }
}
