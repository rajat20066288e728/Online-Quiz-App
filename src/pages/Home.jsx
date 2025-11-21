import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-6">
      
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full text-center border border-white/20 shadow-xl shadow-black/20">
        
        <h1 className="text-4xl font-bold text-white mb-6">
          Online Quiz App
        </h1>

        <p className="text-white/80 mb-8 text-lg">
          Boost your knowledge with interactive quizzes.
        </p>

        <div className="flex flex-col gap-4">

          <Link to="/quiz">
            <button className="w-full px-5 py-3 rounded-2xl text-white text-lg font-medium
              bg-gradient-to-r from-emerald-500 to-green-600
              shadow-lg shadow-emerald-800/40
              hover:scale-105 hover:shadow-xl hover:shadow-emerald-700/40
              transition-all duration-200">
              Start Quiz
            </button>
          </Link>

          <Link to="/admin">
            <button className="w-full px-5 py-3 rounded-2xl text-white text-lg font-medium
              bg-gradient-to-r from-blue-600 to-indigo-700
              shadow-lg shadow-indigo-900/40
              hover:scale-105 hover:shadow-xl hover:shadow-indigo-700/40
              transition-all duration-200">
              Add Questions (Admin)
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}
