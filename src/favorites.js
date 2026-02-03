import { fetchQuote } from './js/api/quote-api.js';
import {
  loadQuote,
  saveQuote,
  isQuoteActual,
} from './js/storage/quote-storage.js';
import { renderQuote } from './js/ui/render-quote.js';

async function initQuote() {
  try {
    const savedQuote = loadQuote();

    if (savedQuote && isQuoteActual(savedQuote)) {
      renderQuote(savedQuote);
      return;
    }

    const data = await fetchQuote();
    saveQuote(data);
    renderQuote(data);
  } catch (error) {
    console.error('Quote initialization failed:', error);
  }
}

initQuote();

import { getFavorites } from './js/storage/favorites-storage.js';
import { showExerciseModal } from './js/ui/render-exercise-modal.js';
import { removeFromFavorites } from './js/storage/favorites-storage.js';

function renderFavorites() {
  const container = document.getElementById('favorites-container');
  if (!container) return;

  const favorites = getFavorites();

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <p class="empty-favorites-text">Your favorites list is empty</p>
        <p class="empty-favorites-subtitle">Add exercises to see them here</p>
        <a href="/index.html" class="empty-favorites-link">Browse Exercises</a>
      </div>
    `;
    return;
  }

  container.innerHTML = favorites.map(exercise => createFavoriteCard(exercise)).join('');
  
  initFavoriteHandlers();
}

function createFavoriteCard(exercise) {
  return `
    <div class="favorite-card" data-id="${exercise._id}">
      <div class="favorite-card-header">
        <span class="favorite-card-badge">WORKOUT</span>
        <button 
          type="button" 
          class="favorite-card-delete" 
          data-id="${exercise._id}"
          aria-label="Remove from favorites"
        >
          <svg width="16" height="16">
            <use href="img/sprite.svg#trash"></use>
          </svg>
        </button>
      </div>

      <button 
        type="button" 
        class="favorite-card-start" 
        data-id="${exercise._id}"
      >
        Start
        <svg width="16" height="16">
          <use href="img/sprite.svg#arrow"></use>
        </svg>
      </button>

      <div class="favorite-card-info">
        <h3 class="favorite-card-name">${exercise.name}</h3>
        <ul class="favorite-card-details">
          <li>
            <span class="favorite-card-detail-label">Burned calories:</span>
            <span class="favorite-card-detail-value">${exercise.burnedCalories} / 3 min</span>
          </li>
          <li>
            <span class="favorite-card-detail-label">Body part:</span>
            <span class="favorite-card-detail-value">${exercise.bodyPart}</span>
          </li>
          <li>
            <span class="favorite-card-detail-label">Target:</span>
            <span class="favorite-card-detail-value">${exercise.target}</span>
          </li>
        </ul>
      </div>
    </div>
  `;
}

function initFavoriteHandlers() {
  const container = document.getElementById('favorites-container');
  if (!container) return;

  container.querySelectorAll('.favorite-card-start').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exerciseId = e.currentTarget.dataset.id;
      showExerciseModal(exerciseId);
    });
  });

  container.querySelectorAll('.favorite-card-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exerciseId = e.currentTarget.dataset.id;
      removeFromFavorites(exerciseId);
      renderFavorites();
    });
  });
}

renderFavorites();

import { initSubscription } from './js/handlers/subscription-handler.js';
initSubscription();

import { initRatingModal } from './js/handlers/rating-handler.js';
initRatingModal();
import { initBurgerMenu } from './js/handlers/burger-menu.js';
initBurgerMenu();
