const BASE_URL = 'https://your-energy.b.goit.study/api';

export async function fetchFilters(filter) {
  const url = `${BASE_URL}/filters?filter=${encodeURIComponent(filter)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Failed to fetch filters:', error);
    return { results: [], page: 1, perPage: 0, totalPages: 0 };
  }
}
