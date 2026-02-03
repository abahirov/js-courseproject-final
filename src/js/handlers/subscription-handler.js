import { subscribe } from '../api/subscription-api.js';
import { validateEmail, showFieldError, clearFieldError } from '../utils/validation.js';

export function initSubscription() {
  const form = document.getElementById('subscription-form');
  if (!form) return;

  const emailInput = form.elements.email;
  
  // Clear error on input
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearFieldError(emailInput);
    });
  }

  form.addEventListener('submit', handleSubscription);
}

async function handleSubscription(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.elements.email;
  const email = emailInput.value.trim();

  // Validate email
  const validation = validateEmail(email);
  if (!validation.isValid) {
    showFieldError(emailInput, validation.error);
    return;
  }

  clearFieldError(emailInput);

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    await subscribe(email);
    
    showNotification('Successfully subscribed! Check your email.', 'success');
    
    form.reset();
  } catch (error) {
    showNotification(error.message || 'Failed to subscribe', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
