export const isEpisodeInFavorites = (favorites, episode) => {
  const result = favorites.some(
    (fav) =>
      fav.episode === episode &&
      fav.showId === episode.showId &&
      fav.seasonId === episode.seasonId
  );

  console.log("isEpisodeInFavorites returns:", result);
  return result;
};