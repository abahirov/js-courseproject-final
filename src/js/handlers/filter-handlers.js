import { fetchFilters } from '../api/filters-api.js';
import { renderCategories } from '../ui/render-categories.js';

let activeFilter = 'Muscles';

export async function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');

  if (buttons.length === 0) {
    return;
  }

  // Set initial active button
  buttons.forEach(btn => {
    if (btn.dataset.filter === activeFilter) {
      btn.classList.add('is-active');
    }
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      if (filter === activeFilter) {
        return;
      }

      activeFilter = filter;
      updateActiveButton(buttons, btn);
      loadCategories();
    });
  });

  // Load initial categories
  loadCategories();
}

function updateActiveButton(buttons, activeBtn) {
  buttons.forEach(btn => btn.classList.remove('is-active'));
  activeBtn.classList.add('is-active');
}

async function loadCategories() {
  try {
    const data = await fetchFilters(activeFilter);
    renderCategories(data.results, activeFilter);
  } catch (error) {
    console.error(error);
    renderCategories([], activeFilter);
  }
}
