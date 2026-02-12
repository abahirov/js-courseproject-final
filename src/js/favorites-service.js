import { STORAGE_KEYS } from './constants.js';

export function getFavoriteIds() {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!favorites) return [];
    return JSON.parse(favorites);
  } catch (err) {
    return [];
  }
}

export function addFavorite(exerciseId) {
  try {
    const favorites = getFavoriteIds();
    if (favorites.includes(exerciseId)) return false;
    favorites.push(exerciseId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  } catch (err) {
    return false;
  }
}

export function removeFavorite(exerciseId) {
  try {
    const favorites = getFavoriteIds();
    const filtered = favorites.filter(id => id !== exerciseId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return true;
  } catch (err) {
    return false;
  }
}

export function isFavorite(exerciseId) {
  return getFavoriteIds().includes(exerciseId);
}

export function toggleFavorite(exerciseId) {
  if (isFavorite(exerciseId)) return removeFavorite(exerciseId);
  return addFavorite(exerciseId);
}
