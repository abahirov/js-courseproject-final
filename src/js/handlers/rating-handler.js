import { rateExercise } from '../api/exercises-api.js';
import { openModal, closeModal } from '../ui/modal.js';
import { validateEmail, showFieldError, clearFieldError } from '../utils/validation.js';

let currentExerciseId = null;

export function initRatingModal() {
  const ratingModal = document.getElementById('rating-modal');
  if (!ratingModal) return;

  const closeBtn = document.getElementById('rating-modal-close');
  const form = document.getElementById('rating-form');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeRatingModal());
  }

  if (form) {
    const emailInput = form.elements.email;
    
    // Clear error on input
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        clearFieldError(emailInput);
      });
    }
    
    form.addEventListener('submit', handleRatingSubmit);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ratingModal.style.display === 'flex') {
      closeRatingModal();
    }
  });

  ratingModal.addEventListener('click', (e) => {
    if (e.target === ratingModal) {
      closeRatingModal();
    }
  });
}

export function openRatingModal(exerciseId) {
  currentExerciseId = exerciseId;
  
  closeModal('exercise-modal');
  
  const ratingModal = document.getElementById('rating-modal');
  if (ratingModal) {
    ratingModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeRatingModal() {
  const ratingModal = document.getElementById('rating-modal');
  const form = document.getElementById('rating-form');
  
  if (ratingModal) {
    ratingModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  if (form) {
    form.reset();
    // Clear any validation errors
    const emailInput = form.elements.email;
    if (emailInput) {
      clearFieldError(emailInput);
    }
  }
  
  if (currentExerciseId) {
    openModal('exercise-modal');
  }
}

async function handleRatingSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const rating = parseInt(formData.get('rating'));
  const email = formData.get('email').trim();
  const emailInput = form.elements.email;

  // Validate email
  const validation = validateEmail(email);
  if (!validation.isValid) {
    showFieldError(emailInput, validation.error);
    return;
  }

  clearFieldError(emailInput);

  if (!currentExerciseId) {
    showNotification('Exercise ID not found', 'error');
    return;
  }

  if (!rating || rating < 1 || rating > 5) {
    showNotification('Please select a rating', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    await rateExercise(currentExerciseId, rating, email);
    
    showNotification('Rating submitted successfully!', 'success');
    
    closeRatingModal();
  } catch (error) {
    showNotification(error.message || 'Failed to submit rating', 'error');
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
