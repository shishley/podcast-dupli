export const isEpisodeInFavorites = (favorites, episode) => {
    return favorites.some((favorite) => favorite.id === episode.id);
  };