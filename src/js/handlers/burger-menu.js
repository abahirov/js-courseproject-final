export function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener('click', toggleMobileMenu);

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      closeMobileMenu();
    }
  });

  const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.burger-btn');
  
  if (!mobileMenu || !burgerBtn) return;

  const isHidden = mobileMenu.hidden;
  
  if (isHidden) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
}

function openMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.burger-btn');
  
  if (!mobileMenu || !burgerBtn) return;

  mobileMenu.hidden = false;
  burgerBtn.setAttribute('aria-expanded', 'true');
  burgerBtn.setAttribute('aria-label', 'Close navigation menu');
  document.body.style.overflow = 'hidden';
  
  const icon = burgerBtn.querySelector('use');
  if (icon) {
    icon.setAttribute('href', 'img/sprite.svg#close');
  }
}

function closeMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.burger-btn');
  
  if (!mobileMenu || !burgerBtn) return;

  mobileMenu.hidden = true;
  burgerBtn.setAttribute('aria-expanded', 'false');
  burgerBtn.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
  
  const icon = burgerBtn.querySelector('use');
  if (icon) {
    icon.setAttribute('href', 'img/sprite.svg#menu');
  }
}
