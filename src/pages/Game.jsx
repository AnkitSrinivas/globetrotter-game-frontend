import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";

function Game() {
  const [destination, setDestination] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();
 
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchDestination();
  }, []);

  const fetchDestination = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/destination/random");
      setDestination(response.data);
    } catch (error) {
      console.error("Error fetching destination:", error);
    }
  };

  const handleAnswer = (option) => {
    if (!destination) return;
    setSelectedOption(option);

    if (option === destination.city) {
      setFeedback(`🎉 Correct! ${destination.funFact[0]}`);
      setShowConfetti(true);
      setScore((prev) => prev + 10);

      setTimeout(() => {
        setShowConfetti(false);
        setFeedback("");
        fetchDestination();
      }, 2000);
    } else {
      setFeedback(`😢 Incorrect! The correct answer is ${destination.city}`);

      setTimeout(() => {
        setFeedback("");
        fetchDestination();
      }, 2000);
    }
  };

  const endGame = async () => {
    try {
        
      await axios.post("http://localhost:5000/api/user/score", { username:username, score:score });
      setShowModal(true);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 relative">
      {showConfetti && <Confetti />}
      
      {/* Score Box */}
      <div className="absolute top-4 right-4 p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Score: {score}</h3>
      </div>

      {/* Display Username */}
      <h2 className="text-xl font-semibold absolute top-4 left-4">👤 {username}</h2>

      {destination ? (
        <>
          <h2 className="text-3xl font-bold">{destination.clues[0]}</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {destination.options.map((option, index) => (
              <button
                key={index}
                className="px-6 py-3 bg-white border rounded-lg hover:bg-gray-100"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && <p className="mt-4 text-lg">{feedback}</p>}
          <button
            onClick={fetchDestination}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next Destination ➡️
          </button>
          
          {/* End Game Button */}
          <button
            onClick={endGame}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            End Game 🛑
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold">Game Over 🎮</h2>
            <p className="mt-2 text-lg">Well played, <span className="font-semibold">{username}</span>!</p>
            <p className="text-lg">Your final score: <span className="font-bold text-blue-600">{score}</span></p>
            <div className="mt-4">
              
              <button
                onClick={() => navigate("/")}
                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Go Home 🏠
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
