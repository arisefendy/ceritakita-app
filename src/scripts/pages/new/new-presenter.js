import Database from '../../data/database';
import { mapErrorMessage, mapCameraError } from '../../utils/error-mapper';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
      this.#view.showMapError(error.message);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, lat = null, lon = null }) {
    this.#view.showSubmitLoadingButton();

    const pendingId = crypto.randomUUID();

    const data = {
      description: description,
      photo: photo,
      lat: lat,
      lon: lon,
    };

    try {
      if (!navigator.onLine) {
        await Database.putPendingStory({ ...data, id: pendingId });
        this.#view.storeSuccessfully('Disimpan offline, data akan dikirim saat online');

        return;
      }

      const response = await this.#model.addStory(data);

      if (!response.ok) {
        console.error('postNewStory: error:', response.message);
        this.#view.storeFailed(mapErrorMessage(response.message));
        return;
      }

      this.#view.storeSuccessfully('Berhasil membuat cerita');
    } catch (error) {
      console.error('postNewStory: error:', error);

      if (error instanceof TypeError) {
        await Database.putPendingStory({ ...data, id: pendingId });
        this.#view.storeSuccessfully('Disimpan offline, data akan dikirim saat online');
      } else {
        this.#view.storeFailed(mapErrorMessage(error.message));
      }
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  async startCamera(cameraInstance) {
    try {
      await cameraInstance.launch();
      return true;
    } catch (error) {
      console.error('startCamera: error:', error);

      const message = mapCameraError(error);

      this.#view.showCameraError(message);
      this.#view.hideCameraContainer();
      return false;
    }
  }
}
