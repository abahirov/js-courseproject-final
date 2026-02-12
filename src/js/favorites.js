import { loadTemplate, replacePlaceholders, runAfterLoad } from './dom.js';
import { initQuote } from './quote.js';
import { renderPagination, setupPagination } from './pagination.js';
import { openExerciseModal } from './exercise-controller.js';
import { getFavoriteIds, removeFavorite } from './favorites-service.js';
import { getExerciseById } from './api.js';
import { BREAKPOINTS, LIMITS, DEBOUNCE_MS } from './constants.js';
export { getFavoriteIds, addFavorite, removeFavorite, isFavorite, toggleFavorite } from './favorites-service.js';
const state = {
  page: 1,
  exercises: [], 
};
function getPerPage() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.DESKTOP) return Infinity;
  if (width >= BREAKPOINTS.TABLET) return LIMITS.EXERCISES_TABLET;
  return LIMITS.EXERCISES_MOBILE;
}
function usePagination() {
  return window.innerWidth < BREAKPOINTS.DESKTOP;
}
async function renderEmptyState(container) {
  const template = await loadTemplate('favorites-empty');
  container.innerHTML = template;
}
async function fetchFavoritesData() {
  const favoriteIds = getFavoriteIds();
  if (favoriteIds.length === 0) {
    state.exercises = [];
    return;
  }
  const exercisePromises = favoriteIds.map(async (id) => {
    try {
      return await getExerciseById(id);
    } catch (err) {
      removeFavorite(id);
      return null;
    }
  });
  const exercises = await Promise.all(exercisePromises);
  state.exercises = exercises.filter(Boolean); 
}
async function renderFavorites() {
  const container = document.getElementById('favorites-container');
  if (!container) return;
  const paginationContainer = document.getElementById('favorites-pagination');
  if (state.exercises.length === 0) {
    await renderEmptyState(container);
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
    }
    return;
  }
  const perPage = getPerPage();
  const shouldPaginate = usePagination();
  const totalPages = shouldPaginate ? Math.ceil(state.exercises.length / perPage) : 1;
  if (state.page > totalPages) {
    state.page = totalPages;
  }
  const startIndex = shouldPaginate ? (state.page - 1) * perPage : 0;
  const endIndex = shouldPaginate ? startIndex + perPage : state.exercises.length;
  const favorites = state.exercises.slice(startIndex, endIndex);
  const cardTemplate = await loadTemplate('exercise-card');
  const cardsHtml = favorites
    .map(exercise => {
      return replacePlaceholders(cardTemplate, {
        id: exercise._id,
        name: exercise.name,
        burnedCalories: exercise.burnedCalories || 0,
        time: exercise.time || 0,
        bodyPart: exercise.bodyPart || 'N/A',
        target: exercise.target || 'N/A',
        rating: exercise.rating || 0,
        ratingFormatted: exercise.rating ? exercise.rating.toFixed(1) : '0.0',
        cardClass: 'is-favorite',
      });
    })
    .join('');
  container.className = 'favorites-grid';
  container.innerHTML = cardsHtml;
  if (shouldPaginate) {
    renderPagination(state.page, totalPages, 'favorites-pagination');
  } else if (paginationContainer) {
    paginationContainer.innerHTML = '';
  }
}
function handlePageChange(newPage) {
  if (newPage && newPage !== state.page) {
    state.page = newPage;
    renderFavorites();
  }
}
function setupResizeListener() {
  let timeoutId;
  let currentPerPage = getPerPage();
  window.addEventListener('resize', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const newPerPage = getPerPage();
      if (newPerPage !== currentPerPage) {
        currentPerPage = newPerPage;
        state.page = 1;
        renderFavorites();
      }
    }, DEBOUNCE_MS);
  });
}
function setupEventHandlers() {
  const container = document.getElementById('favorites-container');
  if (!container) return;
  if (container.dataset.listenerAttached === 'true') return;
  container.dataset.listenerAttached = 'true';
  container.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.favorite-delete-btn');
    if (deleteBtn) {
      e.stopPropagation();
      const exerciseId = deleteBtn.dataset.id;
      if (exerciseId) {
        removeFavorite(exerciseId);
        state.exercises = state.exercises.filter(ex => ex._id !== exerciseId);
        await renderFavorites();
      }
      return;
    }
    const startBtn = e.target.closest('.exercise-start-btn');
    if (startBtn) {
      e.stopPropagation();
      const exerciseId = startBtn.dataset.id;
      if (!exerciseId) return;
      await openExerciseModal(exerciseId, {
        isFavoritesPage: true,
        onRemoveFavorite: async () => {
          state.exercises = state.exercises.filter(ex => ex._id !== exerciseId);
          await renderFavorites();
        },
      });
    }
  });
}
export function initFavoritesPage() {
  const favoritesPage = document.querySelector('.favorites-page');
  setupEventHandlers();
  setupPagination(handlePageChange, 'favorites-pagination');
  setupResizeListener();
  if (favoritesPage) {
    favoritesPage.classList.add('loaded');
  }
  runAfterLoad(async () => {
    try {
      await initQuote();
      await fetchFavoritesData();
      await renderFavorites();
    } catch (err) {
    }
  });
}
