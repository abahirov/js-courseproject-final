const BASE_URL = 'https://your-energy.b.goit.study/api';

/**
 * Subscribe user email to newsletter
 * @param {string} email - User email address
 * @returns {Promise<Object>}
 */
export async function subscribe(email) {
  const response = await fetch(`${BASE_URL}/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Subscription failed');
  }

  return response.json();
}