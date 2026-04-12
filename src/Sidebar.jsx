import { Link } from "react-router-dom";

function Sidebar({ games }) {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-title">
        🎮 NextPlay
      </Link>
      <p className="sidebar-subtitle">Top 20 Games</p>
      <ul className="sidebar-list">
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} className="sidebar-link">
              {game.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;