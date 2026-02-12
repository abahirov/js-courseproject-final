import { getQuote } from './api.js';
import { renderQuote } from './dom.js';
import { STORAGE_KEYS } from './constants.js';
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
function getCachedQuote() {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.QUOTE);
    if (!cached) return null;
    const { quote, author, date } = JSON.parse(cached);
    const today = getTodayDate();
    if (date === today) {
      return { quote, author };
    }
    localStorage.removeItem(STORAGE_KEYS.QUOTE);
    return null;
  } catch (error) {
    return null;
  }
}
function cacheQuote(quote, author) {
  try {
    const data = {
      quote,
      author,
      date: getTodayDate(),
    };
    localStorage.setItem(STORAGE_KEYS.QUOTE, JSON.stringify(data));
  } catch (error) {
  }
}
export async function initQuote() {
  try {
    let quoteData = getCachedQuote();
    if (!quoteData) {
      quoteData = await getQuote();
      cacheQuote(quoteData.quote, quoteData.author);
    }
    renderQuote(quoteData);
  } catch (err) {
  }
}
