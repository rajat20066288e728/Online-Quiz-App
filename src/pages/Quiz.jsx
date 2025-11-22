import { useEffect, useState } from "react";
import api from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]); // Store all answers for review
  const [timeLeft, setTimeLeft] = useState(30);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/questions").then((res) => {
      setQuestions(res.data);
      if (res.data.length > 0) {
        setTimeLeft(res.data[0].timer || 10);
      }
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Auto-submit
          handleAnswer(selected);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, questions, selected]);

  const handleAnswer = (option) => {
    const currentQuestion = questions[index];

    // Store the answer
    const answerData = {
      questionId: currentQuestion._id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      userAnswer: option,
      correctAnswer: currentQuestion.correctAnswer,
    };

    const newAnswers = [...userAnswers, answerData];
    setUserAnswers(newAnswers);

    // Move to next question or finish
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(questions[index + 1].timer || 10);
    } else {
      // Quiz complete - navigate to result with answers
      const score = newAnswers.filter(a => a.userAnswer === a.correctAnswer).length;
      navigate("/result", {
        state: {
          score,
          total: questions.length,
          answers: newAnswers
        }
      });
    }
  };

  const selectOption = (option) => {
    if (selected) return; // Already answered
    setSelected(option);
    // Auto-advance after selection
    setTimeout(() => {
      handleAnswer(option);
    }, 300);
  };

  if (questions.length === 0) return <p className="p-5">Loading...</p>;

  const q = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  // Timer color logic
  const timerColor = timeLeft <= 10 ? "text-red-600" : timeLeft <= 20 ? "text-orange-500" : "text-green-600";

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Counter & Timer */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Question {index + 1} / {questions.length}
        </h2>
        <div className={`text-3xl font-bold ${timerColor} flex items-center gap-2`}>
          <span>⏱️</span>
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <div className="mt-6 bg-white shadow-lg p-5 rounded-xl">
        <p className="text-lg font-semibold mb-4">{q.question}</p>

        {/* Options */}
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;

          return (
            <button
              key={i}
              onClick={() => selectOption(opt)}
              disabled={selected !== null}
              className={`block w-full text-left px-4 py-3 rounded-lg border mb-3 transition-all
                ${isSelected
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
                }
                ${selected ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
