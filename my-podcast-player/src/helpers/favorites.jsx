export const isEpisodeInFavorites = (favorites, episode) => {
  return favorites.some((fav) => fav.episode.id === episode.id);
};