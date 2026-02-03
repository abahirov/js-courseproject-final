const BASE_URL = 'https://your-energy.b.goit.study/api';

/**
 * Fetch quote of the day from backend
 * @returns {Promise<{ quote: string, author: string }>}
 */
export async function fetchQuote() {
  const response = await fetch(`${BASE_URL}/quote`);

  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }

  return response.json();
}