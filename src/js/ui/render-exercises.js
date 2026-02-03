export function renderExercises(exercises) {
  const listEl = document.getElementById('exercises-list');
  const emptyEl = document.getElementById('exercises-empty');

  if (!listEl) return;

  if (!exercises || exercises.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  listEl.innerHTML = exercises
    .map(
      exercise => `
      <li class="exercise-card" data-id="${exercise._id || ''}">
        <div class="exercise-card-header">
          <span class="exercise-badge">WORKOUT</span>
          <div class="exercise-rating">
            <span class="exercise-rating-value">${(exercise.rating || 0).toFixed(1)}</span>
            <svg width="16" height="16" class="exercise-rating-icon">
              <use href="img/sprite.svg#star"></use>
            </svg>
          </div>
        </div>

        <div class="exercise-card-body">
          <h3 class="exercise-card-title">${exercise.name || 'Exercise'}</h3>
          
          <ul class="exercise-card-info">
            <li class="exercise-card-info-item">
              <span class="exercise-card-info-label">Burned calories:</span>
              <span class="exercise-card-info-value">${exercise.burnedCalories || 0} / 3 min</span>
            </li>
            <li class="exercise-card-info-item">
              <span class="exercise-card-info-label">Body part:</span>
              <span class="exercise-card-info-value">${exercise.bodyPart || 'N/A'}</span>
            </li>
            <li class="exercise-card-info-item">
              <span class="exercise-card-info-label">Target:</span>
              <span class="exercise-card-info-value">${exercise.target || 'N/A'}</span>
            </li>
          </ul>
        </div>

        <button type="button" class="exercise-card-btn" data-id="${exercise._id || ''}">
          Start
          <svg width="16" height="16">
            <use href="img/sprite.svg#arrow-right"></use>
          </svg>
        </button>
      </li>
    `
    )
    .join('');
}

export function showExercisesSection() {
  const exercisesSection = document.querySelector('.exercises-section');
  const categoriesSection = document.querySelector('.categories-section');

  if (exercisesSection) exercisesSection.style.display = 'block';
  if (categoriesSection) categoriesSection.style.display = 'none';
}

export function hideExercisesSection() {
  const exercisesSection = document.querySelector('.exercises-section');
  const categoriesSection = document.querySelector('.categories-section');

  if (exercisesSection) exercisesSection.style.display = 'none';
  if (categoriesSection) categoriesSection.style.display = 'block';
}
