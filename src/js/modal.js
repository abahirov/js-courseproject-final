export const openModal = modalId => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.showModal();
    if (modal.dataset.backdropListener !== 'true') {
      let mouseDownTarget = null;
      modal.addEventListener('mousedown', e => {
        mouseDownTarget = e.target;
      });
      modal.addEventListener('click', e => {
        if (e.target === modal && mouseDownTarget === modal) {
          modal.close();
        }
        mouseDownTarget = null;
      });
      modal.dataset.backdropListener = 'true';
    }
  }
};
export const closeModal = modalId => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.close();
  }
};
export const renderExerciseModal = exercise => {
  if (!exercise) return;
  const gifElement = document.getElementById('modal-exercise-gif');
  if (gifElement) {
    gifElement.src = exercise.gifUrl || '';
    gifElement.alt = exercise.name || 'Exercise';
  }
  const titleElement = document.getElementById('modal-exercise-title');
  if (titleElement) {
    titleElement.textContent = exercise.name || 'Exercise';
  }
  const ratingElement = document.getElementById('modal-exercise-rating');
  if (ratingElement) {
    const rating = exercise.rating || 0;
    const fullStars = Math.floor(rating);
    ratingElement.innerHTML = `
      <span class="rating-value">${rating.toFixed(1)}</span>
      <div class="rating-stars">
        ${Array.from({ length: 5 }, (_, i) => {
          const filled = i < fullStars ? 'filled' : '';
          return `<svg class="star ${filled}" width="18" height="18" aria-hidden="true">
            <use href="#icon-star"></use>
          </svg>`;
        }).join('')}
      </div>
    `;
  }
  const targetElement = document.getElementById('modal-target');
  if (targetElement) targetElement.textContent = exercise.target || 'N/A';
  const bodyPartElement = document.getElementById('modal-bodypart');
  if (bodyPartElement) bodyPartElement.textContent = exercise.bodyPart || 'N/A';
  const equipmentElement = document.getElementById('modal-equipment');
  if (equipmentElement) equipmentElement.textContent = exercise.equipment || 'N/A';
  const popularElement = document.getElementById('modal-popular');
  if (popularElement) popularElement.textContent = exercise.popularity || '0';
  const caloriesElement = document.getElementById('modal-calories');
  if (caloriesElement) {
    caloriesElement.textContent = `${exercise.burnedCalories || 0}/${exercise.time || 0} min`;
  }
  const descriptionElement = document.getElementById('modal-description');
  if (descriptionElement) {
    descriptionElement.textContent = exercise.description || 'No description available.';
  }
  const modal = document.getElementById('exercise-modal');
  if (modal) {
    modal.dataset.exerciseId = exercise._id;
  }
};
let currentExerciseIdForRating = null;
export const showRatingModal = exerciseId => {
  const ratingModal = document.getElementById('rating-modal');
  currentExerciseIdForRating = exerciseId;
  closeModal('exercise-modal');
  if (ratingModal && ratingModal.dataset.closeListener !== 'true') {
    ratingModal.addEventListener('close', () => {
      resetRatingForm();
      if (currentExerciseIdForRating) {
        reopenExerciseModal(currentExerciseIdForRating);
        currentExerciseIdForRating = null;
      }
    });
    ratingModal.dataset.closeListener = 'true';
  }
  openModal('rating-modal');
  resetRatingForm();
  initRatingStars();
};
const reopenExerciseModal = () => {
  openModal('exercise-modal');
};
export const hideRatingModal = () => {
  closeModal('rating-modal');
};
const resetRatingForm = () => {
  const ratingForm = document.getElementById('rating-form');
  const ratingValue = document.getElementById('rating-display-value');
  if (ratingForm) ratingForm.reset();
  if (ratingValue) ratingValue.textContent = '0.0';
};
export const initRatingStars = () => {
  const starsContainer = document.getElementById('rating-stars');
  const ratingValue = document.getElementById('rating-display-value');
  if (!starsContainer) return;
  if (starsContainer.dataset.listenerAttached === 'true') return;
  starsContainer.dataset.listenerAttached = 'true';
  starsContainer.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      const selectedRating = parseFloat(e.target.value);
      if (ratingValue) {
        ratingValue.textContent = selectedRating.toFixed(1);
      }
    }
  });
};
export const getCurrentRating = () => {
  const checkedRadio = document.querySelector('#rating-stars input[name="rating"]:checked');
  return checkedRadio ? parseFloat(checkedRadio.value) : 0;
};
