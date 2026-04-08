import LoginPresenter from './login-presenter';
import { StoryAPI } from '../../../data/api';
import * as AuthModel from '../../../utils/auth';
import * as alertUtils from '../../../utils/alert';
import { setFieldValidationMessage, resetValidation } from '../../../utils/validation';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
        <section class="login-container container">
          <article class="login-form-container">
            <h1 class="login__title">Masuk</h1>

            <form id="login-form" class="login-form" novalidate>
              <div class="form-control">
                <label for="email-input" class="login-form__email-title">Email</label>

                <div class="login-form__title-container">
                  <input 
                    id="email-input" 
                    type="email" 
                    name="email" 
                    placeholder="Contoh: nama@email.com"
                    aria-describedby="email-error"
                    required
                  >
                </div>
                <small id="email-error" class="input-error"></small>
              </div>
              <div class="form-control">
                <label for="password-input" class="login-form__password-title">Password</label>

                <div class="login-form__title-container password-wrapper">
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
                    aria-label="Tampilkan password"
                  >
                    <i class="fa-regular fa-eye-slash"></i>
                  </button>
                </div>
                <small id="password-error" class="input-error"></small>
              </div>
              <div class="form-buttons login-form__form-buttons">
                <div id="submit-button-container">
                  <button id="btn-login" class="btn btn-primary btn-block" type="submit" >Masuk</button>
                </div>
                <p class="login-form__register-link">
                  Belum punya akun? <a href="#/register">Daftar</a>
                </p>
              </div>
            </form>
          </article>
        </section>
      `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupValidation();
    this.#setupForm();
    this.#setupPasswordVisibilityToggle();
  }

  #setupForm() {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailInput = document.getElementById('email-input');
      const passwordInput = document.getElementById('password-input');

      form._validateAll();

      const isValid = emailInput.checkValidity() && passwordInput.checkValidity();

      if (!isValid) {
        if (!emailInput.checkValidity()) {
          emailInput.focus();
        } else {
          passwordInput.focus();
        }
        return;
      }

      const data = {
        email: emailInput.value,
        password: passwordInput.value,
      };

      await this.#presenter.login(data);
    });
  }

  #resetForm() {
    const form = document.getElementById('login-form');
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
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const validate = (input, errorEl, label) => {
      setFieldValidationMessage(input, { label: label });

      if (!input.validity.valid) {
        errorEl.textContent = input.validationMessage;
      } else {
        errorEl.textContent = '';
      }
    };

    emailInput.addEventListener('input', () => {
      validate(emailInput, emailError, 'Email');
    });

    passwordInput.addEventListener('input', () => {
      validate(passwordInput, passwordError, 'Password');
    });

    emailInput.addEventListener('blur', () => {
      validate(emailInput, emailError, 'Email');
    });

    passwordInput.addEventListener('blur', () => {
      validate(passwordInput, passwordError, 'Password');
    });

    document.getElementById('login-form')._validateAll = () => {
      validate(emailInput, emailError, 'Email');
      validate(passwordInput, passwordError, 'Password');
    };
  }

  #resetValidation() {
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    resetValidation([
      { input: emailInput, errorEl: emailError },
      { input: passwordInput, errorEl: passwordError },
    ]);
  }

  loginSuccessfully(message) {
    alertUtils.showSuccess(message);

    location.hash = '/';
  }

  loginFailed(message) {
    alertUtils.showError(message);
    this.#resetForm();
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
        <button class="btn btn-primary btn-block" type="submit" disabled>
          <i class="fas fa-spinner loader-button"></i> Memuat...
        </button>
      `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
        <button class="btn btn-primary btn-block" type="submit">Masuk</button>
      `;
  }
}
