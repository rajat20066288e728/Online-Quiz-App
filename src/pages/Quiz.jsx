import { useEffect, useState } from "react";
import api from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/questions").then((res) => {
      setQuestions(res.data);
    });
  }, []);

  const checkAnswer = (option) => {
    if (showAnswer) return;

    setSelected(option);
    setShowAnswer(true);

    if (option === questions[index].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      navigate("/result", { state: { score, total: questions.length } });
    }
  };

  if (questions.length === 0) return <p className="p-5">Loading...</p>;

  const q = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Counter */}
      <h2 className="text-2xl font-bold text-center">
        Question {index + 1} / {questions.length}
      </h2>

      {/* Question */}
      <div className="mt-6 bg-white shadow-lg p-5 rounded-xl">
        <p className="text-lg font-semibold mb-4">{q.question}</p>

        {/* Options */}
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.correctAnswer;
          const isSelected = selected === opt;

          return (
            <button
              key={i}
              onClick={() => checkAnswer(opt)}
              className={`block w-full text-left px-4 py-3 rounded-lg border mb-3 transition-all
                ${
                  showAnswer
                    ? isCorrect
                      ? "bg-green-500 text-white border-green-600"
                      : isSelected
                      ? "bg-red-500 text-white border-red-600"
                      : "bg-gray-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Show feedback */}
      {showAnswer && (
        <p
          className={`text-center mt-4 font-bold text-lg ${
            selected === q.correctAnswer ? "text-green-600" : "text-red-600"
          }`}
        >
          {selected === q.correctAnswer
            ? "Correct Answer! 🎉"
            : `Wrong Answer! Correct: ${q.correctAnswer}`}
        </p>
      )}

      {/* Next button */}
      {showAnswer && (
        <button
          onClick={nextQuestion}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}
