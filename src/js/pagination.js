import { loadTemplate } from './dom.js';
export const renderPagination = async (currentPage, totalPages, containerId = 'pagination-container') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  if (!container.querySelector('.pagination-list')) {
    const template = await loadTemplate('pagination');
    container.innerHTML = template;
  }
  const firstLink = container.querySelector('.pagination-first');
  const prevLink = container.querySelector('.pagination-prev');
  const nextLink = container.querySelector('.pagination-next');
  const lastLink = container.querySelector('.pagination-last');
  const pagesContainer = container.querySelector('.pagination-numbers');
  updateLinkState(firstLink, currentPage === 1, 1);
  updateLinkState(prevLink, currentPage === 1, currentPage - 1);
  updateLinkState(nextLink, currentPage === totalPages, currentPage + 1);
  updateLinkState(lastLink, currentPage === totalPages, totalPages);
  const pages = generatePageNumbers(currentPage, totalPages);
  const pagesHtml = pages
    .map(page => {
      if (page === '...') {
        return `<li aria-hidden="true"><span class="pagination-dots">...</span></li>`;
      }
      const isActive = page === currentPage;
      if (isActive) {
        return `<li><a href="#" class="pagination-number current" aria-current="page">${page}</a></li>`;
      }
      return `<li><a href="#" class="pagination-number" data-page="${page}">${page}</a></li>`;
    })
    .join('');
  pagesContainer.innerHTML = pagesHtml;
};
function updateLinkState(link, isDisabled, page) {
  if (isDisabled) {
    link.classList.add('disabled');
    link.setAttribute('aria-disabled', 'true');
    link.removeAttribute('data-page');
  } else {
    link.classList.remove('disabled');
    link.removeAttribute('aria-disabled');
    link.dataset.page = page;
  }
}
function generatePageNumbers(currentPage, totalPages) {
  const pages = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  let start, end;
  if (currentPage === 1) {
    start = 1;
    end = 3;
  } else if (currentPage === totalPages) {
    start = totalPages - 2;
    end = totalPages;
  } else {
    start = currentPage - 1;
    end = currentPage + 1;
  }
  if (start > 1) {
    pages.push('...');
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < totalPages) {
    pages.push('...');
  }
  return pages;
}
export function setupPagination(onPageChange, containerId = 'pagination-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (container.dataset.listenerAttached === 'true') return;
  container.dataset.listenerAttached = 'true';
  container.addEventListener('click', e => {
    const link = e.target.closest('.pagination-number, .pagination-btn');
    if (!link) return;
    if (link.classList.contains('disabled') || link.classList.contains('current')) return;
    e.preventDefault();
    const newPage = Number(link.dataset.page);
    if (newPage && !isNaN(newPage)) {
      onPageChange(newPage);
    }
  });
}
export function scrollToTop(targetId = 'exercises-header') {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    document.querySelector('.exercises-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}
