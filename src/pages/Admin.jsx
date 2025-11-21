import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  // --- LOGIN FUNCTION ---
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await api.post("/admin/login", { password: passwordInput });

    if (res.data.success) {
      setIsLoggedIn(true);
      fetchQuestions();
    } else {
      alert("Incorrect Password!");
    }
  };

  // --- FETCH QUESTIONS ---
  const fetchQuestions = async () => {
    const res = await api.get("/questions");
    setQuestionsList(res.data);
  };

  // --- ADD QUESTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !correctAnswer || options.some((x) => x === ""))
      return alert("Please fill all fields.");

    const newQuestion = { question, options, correctAnswer };

    await api.post("/questions", newQuestion);

    alert("Question Added Successfully!");

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");

    fetchQuestions();
  };

  // --- DELETE QUESTION ---
  const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}`);
    fetchQuestions();
  };

  /* ---------------------------------------------------------
      LOGIN SCREEN
  --------------------------------------------------------- */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 mb-4"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
      ADMIN PANEL SCREEN
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

        {/* ADD QUESTION CARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Question</h2>

          <form onSubmit={handleSubmit}>
            <label className="font-medium">Question</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl mt-1 mb-4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <label className="font-medium">Options</label>
            {options.map((opt, index) => (
              <input
                key={index}
                type="text"
                className="w-full p-3 border rounded-xl mt-1 mb-3"
                value={opt}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => {
                  const arr = [...options];
                  arr[index] = e.target.value;
                  setOptions(arr);
                }}
              />
            ))}

            <label className="font-medium">Correct Answer</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl mt-1 mb-4"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold">
              Add Question
            </button>
          </form>
        </div>

        {/* LIST OF QUESTIONS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">All Questions</h2>

        <div className="space-y-4">
          {questionsList.map((q) => (
            <div
              key={q._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <p className="font-medium">{q.question}</p>

              <button
                onClick={() => deleteQuestion(q._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
