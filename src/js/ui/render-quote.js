
export function renderQuote({ quote, author }) {
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');

  if (!quoteTextEl || !quoteAuthorEl) return;

  quoteTextEl.textContent = quote;
  quoteAuthorEl.textContent = author ? `— ${author}` : '';
}