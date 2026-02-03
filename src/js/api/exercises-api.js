const BASE_URL = 'https://your-energy.b.goit.study/api';

export async function fetchExercises(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.bodypart) queryParams.append('bodypart', params.bodypart);
  if (params.muscles) queryParams.append('muscles', params.muscles);
  if (params.equipment) queryParams.append('equipment', params.equipment);
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);

  const url = `${BASE_URL}/exercises?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch exercises');
  }

  return response.json();
}

export async function fetchExerciseById(exerciseId) {
  const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch exercise details');
  }

  return response.json();
}

export async function rateExercise(exerciseId, rating, email) {
  const response = await fetch(`${BASE_URL}/exercises/${exerciseId}/rating`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, email }),
  });

  if (!response.ok) {
    throw new Error('Failed to rate exercise');
  }

  return response.json();
}