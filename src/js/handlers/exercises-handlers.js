import { fetchExercises } from '../api/exercises-api.js';
import {
  renderExercises,
  showExercisesSection,
  hideExercisesSection,
} from '../ui/render-exercises.js';
import { showExerciseModal } from '../ui/render-exercise-modal.js';
import { renderPagination } from '../ui/pagination.js';

let currentFilter = '';
let currentCategory = '';
let currentKeyword = '';
let currentPage = 1;
let totalPages = 1;
const ITEMS_PER_PAGE = 10;

export function initCategoryHandlers() {
  const categoriesList = document.getElementById('categories-list');

  if (!categoriesList) return;

  categoriesList.addEventListener('click', async event => {
    const categoryBtn = event.target.closest('.category-btn');

    if (!categoryBtn) return;

    const filter = categoryBtn.dataset.filter;
    const categoryName = categoryBtn.dataset.name;

    await loadExercisesByCategory(filter, categoryName);
  });
}

export function initBackButton() {
  const backBtn = document.getElementById('back-to-categories');

  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    hideExercisesSection();
    currentFilter = '';
    currentCategory = '';
    currentKeyword = '';
    currentPage = 1;
    totalPages = 1;
  });
}

export function initSearchForm() {
  const searchForm = document.getElementById('search-form');

  if (!searchForm) return;

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value.trim();

    currentKeyword = keyword;
    currentPage = 1;

    await loadExercises();
  });
}

export function initExerciseCardHandlers() {
  const exercisesList = document.getElementById('exercises-list');

  if (!exercisesList) return;

  exercisesList.addEventListener('click', event => {
    const startBtn = event.target.closest('.exercise-card-btn');

    if (!startBtn) return;

    const exerciseId = startBtn.dataset.id;
    if (exerciseId) {
      showExerciseModal(exerciseId);
    }
  });
}

async function loadExercisesByCategory(filter, categoryName) {
  try {
    currentFilter = filter;
    currentCategory = categoryName;
    currentKeyword = '';
    currentPage = 1;

    const titleEl = document.getElementById('exercises-title');
    if (titleEl) {
      titleEl.textContent = `Exercises / ${categoryName}`;
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }

    showExercisesSection();
    await loadExercises();
  } catch (error) {
    console.error('Failed to load exercises:', error);
    renderExercises([]);
  }
}

async function loadExercises() {
  try {
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    if (currentFilter === 'Muscles') {
      params.muscles = currentCategory;
    } else if (currentFilter === 'Body parts') {
      params.bodypart = currentCategory;
    } else if (currentFilter === 'Equipment') {
      params.equipment = currentCategory;
    }

    if (currentKeyword) {
      params.keyword = currentKeyword;
    }

    const data = await fetchExercises(params);
    
    if (!data) {
      throw new Error('No data received from API');
    }
    
    const exercises = data.results || [];
    renderExercises(exercises);
    
    if (data.totalPages) {
      totalPages = data.totalPages;
    } else if (data.total && ITEMS_PER_PAGE) {
      totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);
    } else {
      totalPages = 1;
    }
    
    renderPagination(currentPage, totalPages, handlePageChange);
  } catch (error) {
    console.error('Failed to load exercises:', error);
    renderExercises([]);
    renderPagination(1, 1, handlePageChange);
  }
}

function handlePageChange(page) {
  currentPage = page;
  loadExercises();
  
  const exercisesSection = document.getElementById('exercises-section');
  if (exercisesSection) {
    exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
