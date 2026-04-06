import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const API_KEY = "3f296dbb199f47b68a129a2983ee378a"; 
  const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;

  // Fetch games from RAWG
  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setGames(data.results);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGames();
  }, []);

  // Filtered list based on search & genre
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter
      ? game.genres.some((g) => g.name === genreFilter)
      : true;
    return matchesSearch && matchesGenre;
  });

  // Summary stats
  const totalGames = games.length;
  const averageRating =
    games.reduce((sum, g) => sum + g.rating, 0) / (games.length || 1);

  // Most common genre
  const genreCounts = {};
  games.forEach((game) =>
    game.genres.forEach((g) => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    })
  );
  const mostCommonGenre = Object.entries(genreCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Unique genres for filter dropdown
  const uniqueGenres = [
    ...new Set(games.flatMap((game) => game.genres.map((g) => g.name))),
  ];

  return (
    <div className="dashboard">
      <h1>RAWG Game Dashboard</h1>

      {/* Summary statistics */}
      <div className="stats">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p>{totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{averageRating.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Most Common Genre</h3>
          <p>{mostCommonGenre || "N/A"}</p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Game list */}
      <div className="game-list">
        {filteredGames.length === 0 && <p>No games found.</p>}
        {filteredGames.map((game) => (
          <div className="game-row" key={game.id}>
            <img src={game.background_image} alt={game.name} />
            <div className="game-info">
              <h3>{game.name}</h3>
              <p>Rating: {game.rating}</p>
              <p>Genres: {game.genres.map((g) => g.name).join(", ")}</p>
              <p>Released: {game.released}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;