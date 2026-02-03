const FAVORITES_KEY = 'favoriteExercises';

export function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToFavorites(exercise) {
  const favorites = getFavorites();

  const exists = favorites.some(item => item._id === exercise._id);
  if (exists) return;

  favorites.push(exercise);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function removeFromFavorites(exerciseId) {
  const favorites = getFavorites();
  const filtered = favorites.filter(item => item._id !== exerciseId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(exerciseId) {
  const favorites = getFavorites();
  return favorites.some(item => item._id === exerciseId);
}