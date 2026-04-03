import { mapErrorMessage } from '../../../utils/error-mapper';

export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async login({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.login({ email, password });

      if (!response.ok) {
        console.error('login: response:', response);
        this.#view.loginFailed(mapErrorMessage(response.message));
        return;
      }

      const responseData = response.loginResult;
      const message = 'Berhasil masuk. Selamat Datang!';

      this.#authModel.putAccessToken(responseData.token);

      this.#view.loginSuccessfully(message, responseData);
    } catch (error) {
      console.error('login: error:', error);
      this.#view.loginFailed(mapErrorMessage(error.message));
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
