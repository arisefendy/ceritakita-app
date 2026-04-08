export function setFieldValidationMessage(input, options = {}) {
  const { label = 'Field', maxFileSize, fileBlob } = options;

  input.setCustomValidity('');

  if (input.type !== 'file') {
    // Check required
    if (input.validity.valueMissing) {
      input.setCustomValidity(`${label} wajib diisi`);
      return;
    }

    // Type mismatch
    if (input.validity.typeMismatch) {
      input.setCustomValidity(`Format ${label.toLowerCase()} tidak valid`);
      return;
    }

    // Min length
    if (input.validity.tooShort) {
      input.setCustomValidity(`${label} minimal ${input.minLength} karakter`);
      return;
    }
  }

  // Input file
  if (input.type === 'file') {
    let fileToCheck = fileBlob || (input.files.length > 0 ? input.files[0] : null);

    if (!fileToCheck) {
      input.setCustomValidity(`${label} wajib diisi`);
      return;
    }

    if (maxFileSize && fileToCheck.size > maxFileSize) {
      input.setCustomValidity(`Ukuran ${label.toLowerCase()} maksimal ${maxFileSize / 1000000}MB`);
      return;
    }
  }
}

export function resetValidation(fields) {
  fields.forEach(({ input, errorEl }) => {
    input.setCustomValidity('');
    if (errorEl) errorEl.textContent = '';
  });
}
