export function setAuthValidationMessage(input, label) {
  input.setCustomValidity('');

  if (input.validity.valueMissing) {
    input.setCustomValidity(`${label} wajib diisi`);
    return;
  }

  if (input.validity.typeMismatch) {
    input.setCustomValidity(`Format ${label.toLowerCase()} tidak valid`);
    return;
  }

  if (input.validity.tooShort) {
    input.setCustomValidity(`${label} minimal ${input.minLength} karakter`);
    return;
  }
}

export function resetValidation(fields) {
  fields.forEach(({ input, errorEl }) => {
    input.setCustomValidity('');
    if (errorEl) errorEl.textContent = '';
  });
}
