import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleStartGame = () => {
    if (username.trim() === "") {
      alert("Please enter your name to start!");
      return;
    }
    localStorage.setItem("username", username); 
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-6">🌍 The Globetrotter Challenge</h1>
      <input
        type="text"
        placeholder="Enter your name..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-2 border rounded-lg text-lg mb-4"
      />
      <button
        onClick={handleStartGame}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-700 transition"
      >
        Start Game 🚀
      </button>
    </div>
  );
}

export default Home;
