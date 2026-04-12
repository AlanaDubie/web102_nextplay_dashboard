import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import Sidebar from "./Sidebar";

const COLORS = ["#6c63ff", "#f06595", "#38d9a9", "#fcc419", "#74c0fc", "#ff8787", "#a9e34b", "#da77f2"];

function Dashboard({ games, loading }) {
  const [showCharts, setShowCharts] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  // Stats
  const totalGames = games.length;
  const averageRating = games.reduce((s, g) => s + g.rating, 0) / (games.length || 1);

  // Genre counts for pie chart
  const genreCounts = {};
  games.forEach((game) =>
    game.genres.forEach((g) => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    })
  );
  const mostCommonGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const pieData = Object.entries(genreCounts).map(([name, value]) => ({ name, value }));

  // Rating bar chart data (top 8 by rating)
  const ratingData = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map((g) => ({ name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name, rating: g.rating }));

  // Unique genres for filter
  const uniqueGenres = [...new Set(games.flatMap((g) => g.genres.map((g) => g.name)))];

  // Filtered list
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter ? game.genres.some((g) => g.name === genreFilter) : true;
    return matchesSearch && matchesGenre;
  });

  if (loading) return <div className="loading">Loading games…</div>;

  return (
    <div className="layout">
      <Sidebar games={games} />

      <main className="main-content">
        <h1>🎮 RAWG Game Dashboard</h1>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h3>Total Games</h3>
            <p>{totalGames}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Rating</h3>
            <p>{averageRating.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Top Genre</h3>
            <p>{mostCommonGenre || "N/A"}</p>
          </div>
        </div>

        {/* Toggle charts button */}
        <div className="chart-toggle">
          <button onClick={() => setShowCharts(!showCharts)}>
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>
        </div>

        {/* Charts */}
        {showCharts && (
          <div className="charts">
            <div className="chart-card">
              <h2>Top 8 Games by Rating</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ratingData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Games by Genre</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search games…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">All Genres</option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Game list */}
        <div className="game-list">
          {filteredGames.length === 0 && <p>No games found.</p>}
          {filteredGames.map((game) => (
            <Link to={`/game/${game.id}`} key={game.id} className="game-row">
              <img src={game.background_image} alt={game.name} />
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>⭐ Rating: {game.rating}</p>
                <p>🎭 Genres: {game.genres.map((g) => g.name).join(", ")}</p>
                <p>📅 Released: {game.released}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;