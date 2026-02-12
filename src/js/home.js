import { getFilters, getExercises } from './api.js';
import { renderCategories, renderExercises, renderSkeleton, runAfterLoad } from './dom.js';
import {
  renderPagination,
  setupPagination as setupPaginationListeners,
  scrollToTop,
} from './pagination.js';
import { openExerciseModal } from './exercise-controller.js';
import { initQuote } from './quote.js';
import { BREAKPOINTS, LIMITS, DEBOUNCE_MS } from './constants.js';
const appState = {
  view: 'categories', 
  filter: 'Muscles',  
  category: null,     
  categoryFilter: null, 
  keyword: '',
  page: 1
};
const getLimit = () => {
  const width = window.innerWidth;
  if (appState.view === 'categories') {
    return width < BREAKPOINTS.TABLET ? LIMITS.CATEGORIES_MOBILE : LIMITS.CATEGORIES_DESKTOP;
  } else {
    return width < BREAKPOINTS.TABLET ? LIMITS.EXERCISES_MOBILE : LIMITS.EXERCISES_TABLET;
  }
};
export function initHomePage() {
  const mainContent = document.querySelector('.main-content');
  const initialLimit = getLimit();
  renderSkeleton(appState.view, 'exercises-container', initialLimit);
  setupFilterTabs();
  setupExerciseCards();
  setupPaginationListeners(handlePageChange);
  setupResizeListener();
  if (mainContent) {
    mainContent.classList.add('loaded');
  }
  runAfterLoad(async () => {
    try {
      await initQuote();
      await fetchAndRender();
    } catch (err) {
    }
  });
}
function setupResizeListener() {
  let timeoutId;
  let currentLimit = getLimit();
  window.addEventListener('resize', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const newLimit = getLimit();
      if (newLimit !== currentLimit) {
        currentLimit = newLimit;
        appState.page = 1;
        fetchAndRender();
      }
    }, DEBOUNCE_MS);
  });
}
async function fetchAndRender() {
  const container = document.getElementById('exercises-container');
  try {
    const limit = getLimit();
    renderSkeleton(appState.view, 'exercises-container', limit);
    if (appState.view === 'categories') {
      const filters = await getFilters({
        filter: appState.filter,
        page: appState.page,
        limit
      });
      renderCategories(filters.results, 'exercises-container');
      renderPagination(filters.page ? Number(filters.page) : 1, filters.totalPages || 1);
    } else {
      const params = {
        limit,
        page: appState.page
      };
      if (appState.categoryFilter === 'Muscles') params.muscles = appState.category.toLowerCase();
      else if (appState.categoryFilter === 'Body parts') params.bodypart = appState.category.toLowerCase();
      else if (appState.categoryFilter === 'Equipment') params.equipment = appState.category.toLowerCase();
      if (appState.keyword) params.keyword = appState.keyword;
      const exercises = await getExercises(params);
      renderExercises(exercises.results, 'exercises-container');
      renderPagination(exercises.page ? Number(exercises.page) : 1, exercises.totalPages || 1);
    }
  } catch (err) {
    if (container) container.innerHTML = '<p class="error-message">Failed to load data. Please try again.</p>';
  }
}
function handlePageChange(newPage) {
  if (newPage && newPage !== appState.page) {
    appState.page = newPage;
    fetchAndRender();
    scrollToTop();
  }
}
function setupFilterTabs() {
  const filterTabs = document.getElementById('filter-tabs');
  if (!filterTabs) return;
  if (filterTabs.dataset.listenerAttached === 'true') return;
  filterTabs.dataset.listenerAttached = 'true';
  filterTabs.addEventListener('click', async e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.remove('active');
    });
    btn.classList.add('active');
    appState.filter = btn.dataset.filter;
    appState.view = 'categories';
    appState.page = 1;
    appState.keyword = '';
    appState.category = null;
    hideExercisesHeader();
    try {
      await fetchAndRender();
    } catch (err) {
    }
  });
}
function setupExerciseCards() {
  const exercisesContainer = document.getElementById('exercises-container');
  if (!exercisesContainer) return;
  if (exercisesContainer.dataset.listenerAttached === 'true') return;
  exercisesContainer.dataset.listenerAttached = 'true';
  exercisesContainer.addEventListener('click', async e => {
    const categoryCard = e.target.closest('.category-card');
    if (categoryCard) {
      e.preventDefault();
      const categoryName = categoryCard.dataset.name;
      const categoryFilter = categoryCard.dataset.filter;
      if (!categoryName) return;
      appState.view = 'exercises';
      appState.category = categoryName;
      appState.categoryFilter = categoryFilter; 
      appState.page = 1;
      appState.keyword = '';
      showExercisesHeader(categoryName);
      setupExerciseSearch(); 
      try {
        await fetchAndRender();
      } catch (err) {
      }
      return;
    }
    const startBtn = e.target.closest('.exercise-start-btn');
    if (startBtn) {
      const exerciseId = startBtn.dataset.id;
      if (!exerciseId) return;
      await openExerciseModal(exerciseId);
    }
  });
}
function showExercisesHeader(categoryName) {
  const sectionTitle = document.getElementById('section-title');
  const searchForm = document.getElementById('exercise-search-form');
  if (sectionTitle) {
    sectionTitle.innerHTML = `Exercises / <span class="category-name">${categoryName}</span>`;
  }
  if (searchForm) {
    searchForm.classList.remove('hidden');
  }
}
function hideExercisesHeader() {
  const sectionTitle = document.getElementById('section-title');
  const searchForm = document.getElementById('exercise-search-form');
  const searchInput = document.getElementById('exercise-search-input');
  const clearBtn = document.getElementById('exercise-clear-btn');
  if (sectionTitle) {
    sectionTitle.textContent = 'Exercises';
  }
  if (searchForm) {
    searchForm.classList.add('hidden');
  }
  if (searchInput) {
    searchInput.value = '';
  }
  if (clearBtn) {
    clearBtn.classList.add('hidden');
  }
}
function setupExerciseSearch() {
  const searchForm = document.getElementById('exercise-search-form');
  const searchInput = document.getElementById('exercise-search-input');
  const clearBtn = document.getElementById('exercise-clear-btn');
  if (!searchForm || !searchInput) return;
  if (searchForm.dataset.listenerAttached === 'true') return;
  searchForm.dataset.listenerAttached = 'true';
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  });
  clearBtn.addEventListener('click', async () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    searchInput.focus();
    appState.keyword = '';
    appState.page = 1;
    try {
      await fetchAndRender();
    } catch (err) {
    }
  });
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const keyword = searchInput.value.trim();
    appState.keyword = keyword;
    appState.page = 1;
    try {
      await fetchAndRender();
    } catch (err) {
    }
  });
}
