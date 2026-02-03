const EMAIL_PATTERN = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

export function showFieldError(inputElement, errorMessage) {
  const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
  
  const existingError = formGroup.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }

  inputElement.classList.add('is-invalid');

  if (errorMessage) {
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = errorMessage;
    formGroup.appendChild(errorEl);
  }
}

export function clearFieldError(inputElement) {
  const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
  
  inputElement.classList.remove('is-invalid');

  const existingError = formGroup.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}
