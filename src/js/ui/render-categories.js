function createPlaceholder(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, '#242424');
  gradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);
  
  ctx.fillStyle = '#f4f4f4';
  ctx.font = '24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name || 'Exercise', 200, 150);
  
  return canvas.toDataURL('image/png');
}

export function renderCategories(categories, filter) {
  const listEl = document.getElementById('categories-list');
  
  if (!listEl) {
    return;
  }

  if (!categories || !categories.length) {
    listEl.innerHTML = '<li>No categories found</li>';
    return;
  }

  listEl.innerHTML = categories
    .map(
      item => {
        const name = item.name || 'Category';
        const hasValidImage = item.imgUrl && !item.imgUrl.includes('ftp.goit.study');
        const imgUrl = hasValidImage ? item.imgUrl : createPlaceholder(name);
        
        return `
      <li class="category-card">
        <button 
          type="button" 
          class="category-btn" 
          data-filter="${filter}"
          data-name="${name}"
        >
          <img 
            src="${imgUrl}" 
            alt="${name}" 
            loading="lazy"
          />
          <div class="category-info">
            <h3>${name}</h3>
            <p>${filter}</p>
          </div>
        </button>
      </li>
    `;
      }
    )
    .join('');
}
