import RegisterPresenter from './register-presenter';
import { StoryAPI } from '../../../data/api';
import * as alertUtils from '../../../utils/alert';
import { setFieldValidationMessage, resetValidation } from '../../../utils/validation';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container container">
        <article class="register-form-container">
          <h1 class="register__title">Daftar Akun</h1>

          <form id="register-form" class="register-form" novalidate>
            <div class="form-control">
              <label for="name-input" class="register-form__name-title">Nama</label>

              <div class="register-form__title-container">
                <input 
                  id="name-input" 
                  type="text" 
                  name="name" 
                  placeholder="Masukkan nama Anda"
                  aria-describedby="name-error"
                  required
                >
              </div>
              <small id="name-error" class="input-error" aria-live="polite"></small>
            </div>
            <div class="form-control">
              <label for="email-input" class="register-form__email-title">Email</label>

              <div class="register-form__title-container">
                <input 
                  id="email-input" 
                  type="email" 
                  name="email" 
                  placeholder="Contoh: nama@email.com"
                  aria-describedby="email-error"
                  required
                >
              </div>
              <small id="email-error" class="input-error" aria-live="polite"></small>
            </div>
            <div class="form-control">
              <label for="password-input" class="register-form__password-title">Password</label>

              <div class="register-form__title-container password-wrapper">
                <input 
                  id="password-input" 
                  type="password" 
                  name="password" 
                  minlength="8"
                  placeholder="Masukkan password Anda"
                  aria-describedby="password-error"
                  required
                >
                <button 
                  type="button" 
                  id="toggle-password"
                  class="toggle-password-btn"
                  aria-controls="password-input"
                  aria-label="Tampilkan password"
                >
                  <i class="fa-regular fa-eye-slash" aria-hidden="true"></i>
                </button>
              </div>
              <small id="password-error" class="input-error" aria-live="polite"></small>
            </div>
            <div class="form-buttons register-form__form-buttons">
              <div id="submit-button-container">
                <button id="btn-register" class="btn btn-primary btn-block" type="submit">Daftar</button>
              </div>
              <p class="register-form__login-link">
                Sudah punya akun? <a href="#/login" aria-label="Masuk ke akun">Masuk</a>
              </p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupValidation();
    this.#setupForm();
    this.#setupPasswordVisibilityToggle();
  }

  #setupForm() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('name-input');
      const emailInput = document.getElementById('email-input');
      const passwordInput = document.getElementById('password-input');

      form._validateAll();

      const isValid =
        nameInput.checkValidity() && emailInput.checkValidity() && passwordInput.checkValidity();

      if (!isValid) {
        if (!nameInput.checkValidity()) {
          nameInput.focus();
        } else if (!emailInput.checkValidity()) {
          emailInput.focus();
        } else {
          passwordInput.focus();
        }
        return;
      }

      const data = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };

      await this.#presenter.register(data);
    });
  }

  #resetForm() {
    const form = document.getElementById('register-form');
    form.reset();

    this.#resetValidation();
  }

  #setupPasswordVisibilityToggle() {
    const input = document.getElementById('password-input');
    const toggle = document.getElementById('toggle-password');
    const icon = toggle.querySelector('i');

    toggle.addEventListener('click', () => {
      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';

      if (isHidden) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        toggle.setAttribute('aria-label', 'Sembunyikan password');
      } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        toggle.setAttribute('aria-label', 'Tampilkan password');
      }
    });
  }

  #setupValidation() {
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const validate = (input, errorEl, label) => {
      setFieldValidationMessage(input, { label: label });

      if (!input.validity.valid) {
        input.setAttribute('aria-invalid', 'true');
        errorEl.textContent = input.validationMessage;
      } else {
        input.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
      }
    };

    nameInput.addEventListener('input', () => {
      validate(nameInput, nameError, 'Nama');
    });

    emailInput.addEventListener('input', () => {
      validate(emailInput, emailError, 'Email');
    });

    passwordInput.addEventListener('input', () => {
      validate(passwordInput, passwordError, 'Password');
    });

    nameInput.addEventListener('blur', () => {
      validate(nameInput, nameError, 'Nama');
    });

    emailInput.addEventListener('blur', () => {
      validate(emailInput, emailError, 'Email');
    });

    passwordInput.addEventListener('blur', () => {
      validate(passwordInput, passwordError, 'Password');
    });

    document.getElementById('register-form')._validateAll = () => {
      validate(nameInput, nameError, 'Nama');
      validate(emailInput, emailError, 'Email');
      validate(passwordInput, passwordError, 'Password');
    };
  }

  #resetValidation() {
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    resetValidation([
      { input: nameInput, errorEl: nameError },
      { input: emailInput, errorEl: emailError },
      { input: passwordInput, errorEl: passwordError },
    ]);
  }

  registeredSuccessfully(message) {
    alertUtils.showSuccess(message);

    location.hash = '/login';
  }

  registeredFailed(message) {
    alertUtils.showError(message);
    this.#resetForm();
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit" disabled>
        <i class="fas fa-spinner loader-button" aria-hidden="true"></i> Memuat...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit">Daftar</button>
    `;
  }
}
