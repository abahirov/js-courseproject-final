const STORAGE_KEY = 'quoteOfTheDay';

export function saveQuote(data) {
  const payload = {
    ...data,
    date: new Date().toISOString().split('T')[0],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadQuote() {
  const rawData = localStorage.getItem(STORAGE_KEY);

  if (!rawData) {
    return null;
  }

  return JSON.parse(rawData);
}

export function isQuoteActual(savedQuote) {
  const today = new Date().toISOString().split('T')[0];
  return savedQuote.date === today;
}
