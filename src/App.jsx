import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import GameDetail from "./GameDetail";
import "./App.css";

const API_KEY = "3f296dbb199f47b68a129a2983ee378a";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setGames(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard games={games} loading={loading} />} />
      <Route path="/game/:id" element={<GameDetail games={games} loading={loading} />} />
    </Routes>
  );
}

export default App;