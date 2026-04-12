import { useParams, Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function GameDetail({ games, loading }) {
  const { id } = useParams();
  const game = games.find((g) => String(g.id) === id);

  if (loading) return <div className="loading">Loading…</div>;
  if (!game) return (
    <div className="layout">
      <Sidebar games={games} />
      <main className="main-content">
        <p>Game not found. <Link to="/">Go back</Link></p>
      </main>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar games={games} />

      <main className="main-content">
        <Link to="/" className="back-link">← Back to Dashboard</Link>

        <div className="detail-card">
          <img
            src={game.background_image}
            alt={game.name}
            className="detail-image"
          />

          <div className="detail-body">
            <h1>{game.name}</h1>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">⭐ Rating</span>
                <span className="value">{game.rating} / 5</span>
              </div>
              <div className="detail-item">
                <span className="label">🗳️ Ratings Count</span>
                <span className="value">{game.ratings_count?.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">📅 Released</span>
                <span className="value">{game.released}</span>
              </div>
              <div className="detail-item">
                <span className="label">🕹️ Playtime</span>
                <span className="value">{game.playtime} hrs avg</span>
              </div>
              <div className="detail-item">
                <span className="label">🎭 Genres</span>
                <span className="value">{game.genres?.map((g) => g.name).join(", ")}</span>
              </div>
              <div className="detail-item">
                <span className="label">💻 Platforms</span>
                <span className="value">
                  {game.platforms?.map((p) => p.platform.name).join(", ") || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">🏷️ Metacritic</span>
                <span className="value">{game.metacritic ?? "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">📸 Screenshots</span>
                <span className="value">{game.short_screenshots?.length ?? 0} available</span>
              </div>
            </div>

            {/* Rating breakdown */}
            {game.ratings && game.ratings.length > 0 && (
              <div className="rating-breakdown">
                <h3>Rating Breakdown</h3>
                {game.ratings.map((r) => (
                  <div key={r.id} className="rating-bar-row">
                    <span className="rating-label">{r.title}</span>
                    <div className="rating-bar-bg">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                    <span className="rating-percent">{r.percent.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Screenshot thumbnails */}
            {game.short_screenshots && game.short_screenshots.length > 0 && (
              <div className="screenshots">
                <h3>Screenshots</h3>
                <div className="screenshot-grid">
                  {game.short_screenshots.slice(0, 4).map((s) => (
                    <img key={s.id} src={s.image} alt="screenshot" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameDetail;