export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const handleEscape = event => {
    if (event.key === 'Escape') {
      closeModal(modalId);
    }
  };

  const handleBackdropClick = event => {
    if (event.target === modal) {
      closeModal(modalId);
    }
  };

  document.addEventListener('keydown', handleEscape);
  modal.addEventListener('click', handleBackdropClick);

  modal.dataset.escapeListener = 'true';
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';

  document.removeEventListener('keydown', handleEscape);
  modal.removeEventListener('click', handleBackdropClick);
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    const modal = document.querySelector('.modal-overlay[style*="flex"]');
    if (modal) {
      closeModal(modal.id);
    }
  }
}

function handleBackdropClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal(event.target.id);
  }
}