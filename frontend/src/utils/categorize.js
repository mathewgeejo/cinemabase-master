export default function (allMovies, genre) {
  if (!allMovies || !Array.isArray(allMovies)) return [];
  if (genre === "All") return allMovies;
  else
    return allMovies.filter((movie) =>
      movie.genre && movie.genre.some((g) => g.name === genre)
    );
}
