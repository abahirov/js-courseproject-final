import exerciseCardTemplate from '../partials/exercise-card.html?raw';
import categoryCardTemplate from '../partials/category-card.html?raw';
import favoritesEmptyTemplate from '../partials/favorites-empty.html?raw';
import paginationTemplate from '../partials/pagination.html?raw';

const templates = {
  'exercise-card': exerciseCardTemplate,
  'category-card': categoryCardTemplate,
  'favorites-empty': favoritesEmptyTemplate,
  'pagination': paginationTemplate,
};

export const loadTemplate = async templateName => {
  return templates[templateName] || '';
};

export const replacePlaceholders = (template, data) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return data[key] !== undefined ? data[key] : '';
  });
};

export const renderQuote = quoteData => {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  if (quoteText && quoteData.quote) quoteText.textContent = quoteData.quote;
  if (quoteAuthor && quoteData.author) quoteAuthor.textContent = quoteData.author;
};

export const renderExercises = async (exercises, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (exercises.length === 0) {
    container.innerHTML = '<p class="no-results">No exercises found. Try another filter.</p>';
    return;
  }
  const template = await loadTemplate('exercise-card');
  const exercisesHtml = exercises
    .map(exercise => replacePlaceholders(template, {
      id: exercise._id,
      rating: exercise.rating || 0,
      ratingFormatted: exercise.rating ? exercise.rating.toFixed(1) : '0.0',
      cardClass: '',
      name: exercise.name,
      burnedCalories: exercise.burnedCalories || 0,
      time: exercise.time || 0,
      bodyPart: exercise.bodyPart || 'N/A',
      target: exercise.target || 'N/A',
    }))
    .join('');
  container.className = 'exercises-grid';
  container.innerHTML = exercisesHtml;
};

export const renderCategories = async (categories, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (categories.length === 0) {
    container.innerHTML = '<p class="no-results">No categories found.</p>';
    return;
  }
  const template = await loadTemplate('category-card');
  const categoriesHtml = categories
    .map(cat => replacePlaceholders(template, {
      filter: cat.filter,
      name: cat.name,
      imgURL: cat.imgURL || '',
    }))
    .join('');
  container.className = 'categories-grid';
  container.innerHTML = categoriesHtml;
};

export const renderSkeleton = (view, containerId, count = 9) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (view === 'categories') {
    container.className = 'categories-grid';
    container.innerHTML = Array(count)
      .fill('<li class="category-skeleton skeleton-shimmer"></li>')
      .join('');
  } else {
    const item = `
      <li class="exercise-skeleton">
        <div class="shimmer-header">
           <div class="shimmer-badge skeleton-shimmer"></div>
           <div class="shimmer-badge skeleton-shimmer"></div>
        </div>
        <div class="shimmer-title skeleton-shimmer"></div>
        <div class="shimmer-line skeleton-shimmer"></div>
        <div class="shimmer-line skeleton-shimmer"></div>
      </li>
    `;
    container.className = 'exercises-grid';
    container.innerHTML = Array(count).fill(item).join('');
  }
};

export const renderExerciseSkeleton = () => {
  const gifElement = document.getElementById('modal-exercise-gif');
  const titleElement = document.getElementById('modal-exercise-title');
  const ratingElement = document.getElementById('modal-exercise-rating');
  const targetElement = document.getElementById('modal-target');
  const bodyPartElement = document.getElementById('modal-bodypart');
  const equipmentElement = document.getElementById('modal-equipment');
  const popularElement = document.getElementById('modal-popular');
  const caloriesElement = document.getElementById('modal-calories');
  const descriptionElement = document.getElementById('modal-description');

  if (gifElement) gifElement.src = 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3C/svg%3E';
  if (titleElement) titleElement.textContent = 'Loading...';
  if (ratingElement) ratingElement.innerHTML = '<div class="skeleton-shimmer" style="width: 100px; height: 20px; border-radius: 4px;"></div>';
  const skeletonText = '<span class="skeleton-shimmer" style="display: inline-block; width: 60px; height: 14px; border-radius: 2px;"></span>';
  if (targetElement) targetElement.innerHTML = skeletonText;
  if (bodyPartElement) bodyPartElement.innerHTML = skeletonText;
  if (equipmentElement) equipmentElement.innerHTML = skeletonText;
  if (popularElement) popularElement.innerHTML = skeletonText;
  if (caloriesElement) caloriesElement.innerHTML = skeletonText;
  if (descriptionElement) {
    descriptionElement.innerHTML = `
      <div class="skeleton-shimmer" style="width: 100%; height: 14px; border-radius: 2px; margin-bottom: 8px;"></div>
      <div class="skeleton-shimmer" style="width: 90%; height: 14px; border-radius: 2px; margin-bottom: 8px;"></div>
      <div class="skeleton-shimmer" style="width: 40%; height: 14px; border-radius: 2px;"></div>
    `;
  }
};

export function runAfterLoad(task, { timeout = 2000 } = {}) {
  const run = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => task(), { timeout });
    } else {
      setTimeout(() => task(), 1);
    }
  };
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run, { once: true });
  }
}
