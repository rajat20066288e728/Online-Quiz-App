import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

export default function Result() {
  const location = useLocation();
  const { score, total, answers } = location.state;
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  if (!reviewMode) {
    // Score Summary Screen
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-700 p-6">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full text-center border border-white/20 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-6">Quiz Complete! 🎉</h1>

          <div className="bg-white/20 rounded-2xl p-8 mb-6">
            <p className="text-white/80 text-lg mb-2">Your Score</p>
            <p className="text-6xl font-bold text-white mb-2">
              {score} / {total}
            </p>
            <p className="text-2xl text-white/90">{percentage}%</p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setReviewMode(true)}
              className="w-full px-5 py-3 rounded-2xl text-white text-lg font-medium
                bg-gradient-to-r from-emerald-500 to-green-600
                shadow-lg shadow-emerald-800/40
                hover:scale-105 hover:shadow-xl hover:shadow-emerald-700/40
                transition-all duration-200"
            >
              Review Answers 📝
            </button>

            <Link to="/">
              <button className="w-full px-5 py-3 rounded-2xl text-white text-lg font-medium
                bg-gradient-to-r from-blue-600 to-indigo-700
                shadow-lg shadow-indigo-900/40
                hover:scale-105 hover:shadow-xl hover:shadow-indigo-700/40
                transition-all duration-200">
                Go Home 🏠
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Review Mode
  const currentReview = answers[reviewIndex];
  const isCorrect = currentReview.userAnswer === currentReview.correctAnswer;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Review: Question {reviewIndex + 1} / {total}
            </h2>
            <span className={`px-4 py-2 rounded-full font-semibold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              {currentReview.question}
            </p>

            {/* Options Review */}
            <div className="space-y-3">
              {currentReview.options.map((opt, i) => {
                const isUserAnswer = opt === currentReview.userAnswer;
                const isCorrectAnswer = opt === currentReview.correctAnswer;

                let optionClass = "bg-gray-100 border-gray-300";
                let label = "";

                if (isCorrectAnswer) {
                  optionClass = "bg-green-100 border-green-500 text-green-900";
                  label = "✓ Correct Answer";
                } else if (isUserAnswer && !isCorrect) {
                  optionClass = "bg-red-100 border-red-500 text-red-900";
                  label = "✗ Your Answer";
                }

                return (
                  <div
                    key={i}
                    className={`px-4 py-3 rounded-lg border-2 ${optionClass} flex justify-between items-center`}
                  >
                    <span className="font-medium">{opt}</span>
                    {label && <span className="text-sm font-semibold">{label}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
              disabled={reviewIndex === 0}
              className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <button
              onClick={() => setReviewIndex(Math.min(total - 1, reviewIndex + 1))}
              disabled={reviewIndex === total - 1}
              className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>

          {/* Exit Review */}
          <Link to="/">
            <button className="w-full mt-4 px-4 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition">
              Exit Review & Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
