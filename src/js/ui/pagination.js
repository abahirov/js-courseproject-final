export function renderPagination(currentPage, totalPages, onPageChange) {
  const container = document.getElementById('pagination-container');
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  const pages = generatePageNumbers(currentPage, totalPages);
  
  container.innerHTML = `
    <div class="pagination">
      <button 
        type="button" 
        class="pagination-btn pagination-prev" 
        ${currentPage === 1 ? 'disabled' : ''}
        data-page="${currentPage - 1}"
      >
        <svg width="16" height="16">
          <use href="img/sprite.svg#arrow-left"></use>
        </svg>
      </button>
      
      <div class="pagination-numbers">
        ${pages.map(page => {
          if (page === '...') {
            return '<span class="pagination-ellipsis">...</span>';
          }
          return `
            <button 
              type="button" 
              class="pagination-number ${page === currentPage ? 'is-active' : ''}"
              data-page="${page}"
              ${page === currentPage ? 'disabled' : ''}
            >
              ${page}
            </button>
          `;
        }).join('')}
      </div>
      
      <button 
        type="button" 
        class="pagination-btn pagination-next" 
        ${currentPage === totalPages ? 'disabled' : ''}
        data-page="${currentPage + 1}"
      >
        <svg width="16" height="16">
          <use href="img/sprite.svg#arrow-right"></use>
        </svg>
      </button>
    </div>
  `;

  container.querySelectorAll('[data-page]').forEach(btn => {
    if (!btn.disabled) {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        onPageChange(page);
      });
    }
  });
}

function generatePageNumbers(current, total) {
  const pages = [];
  const delta = 2;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(total - 1, current + delta);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < total - 1) {
      pages.push('...');
    }

    pages.push(total);
  }

  return pages;
}
