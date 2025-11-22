import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [timer, setTimer] = useState(10);
  const [questionsList, setQuestionsList] = useState([]);

  // JSON Import
  const [jsonInput, setJsonInput] = useState("");
  const [importMessage, setImportMessage] = useState("");

  // Edit Mode
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState("");
  const [editTimer, setEditTimer] = useState(10);

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

    const newQuestion = { question, options, correctAnswer, timer };

    await api.post("/questions", newQuestion);

    alert("Question Added Successfully!");

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setTimer(10);

    fetchQuestions();
  };

  // --- BULK IMPORT FROM JSON ---
  const handleBulkImport = async () => {
    try {
      setImportMessage("");
      const parsedData = JSON.parse(jsonInput);

      const res = await api.post("/questions/bulk-import", { questions: parsedData });

      setImportMessage(`✅ ${res.data.message}`);
      setJsonInput("");
      fetchQuestions();
    } catch (error) {
      if (error.response?.data?.error) {
        setImportMessage(`❌ ${error.response.data.error}`);
      } else {
        setImportMessage("❌ Invalid JSON format. Please check your input.");
      }
    }
  };

  // --- EDIT QUESTION ---
  const startEdit = (q) => {
    setEditingId(q._id);
    setEditQuestion(q.question);
    setEditOptions(q.options);
    setEditCorrectAnswer(q.correctAnswer);
    setEditTimer(q.timer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditOptions(["", "", "", ""]);
    setEditCorrectAnswer("");
    setEditTimer(10);
  };

  const saveEdit = async () => {
    if (!editQuestion || !editCorrectAnswer || editOptions.some((x) => x === ""))
      return alert("Please fill all fields.");

    const updatedQuestion = {
      question: editQuestion,
      options: editOptions,
      correctAnswer: editCorrectAnswer,
      timer: editTimer,
    };

    await api.put(`/questions/${editingId}`, updatedQuestion);

    alert("Question Updated Successfully!");
    cancelEdit();
    fetchQuestions();
  };

  // --- DELETE QUESTION ---
  const deleteQuestion = async (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
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
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
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

            <label className="font-medium">Timer (seconds)</label>
            <input
              type="number"
              min="5"
              max="300"
              className="w-full p-3 border rounded-xl mt-1 mb-4"
              value={timer}
              onChange={(e) => setTimer(parseInt(e.target.value))}
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold">
              Add Question
            </button>
          </form>
        </div>

        {/* BULK IMPORT SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Bulk Import from JSON</h2>
          <p className="text-sm text-gray-600 mb-3">
            Paste your JSON array of questions below. See README for format.
          </p>

          <textarea
            className="w-full p-3 border rounded-xl font-mono text-sm mb-3 min-h-[200px]"
            placeholder='[{"question": "What is 2+2?", "options": ["3", "4", "5", "6"], "correctAnswer": "4", "timer": 10}]'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />

          <button
            onClick={handleBulkImport}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold mb-3"
          >
            Import Questions
          </button>

          {importMessage && (
            <div className={`p-3 rounded-xl ${importMessage.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {importMessage}
            </div>
          )}
        </div>

        {/* LIST OF QUESTIONS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">All Questions ({questionsList.length})</h2>

        <div className="space-y-4">
          {questionsList.map((q) => (
            <div key={q._id} className="bg-white p-4 rounded-xl shadow">
              {editingId === q._id ? (
                // EDIT MODE
                <div>
                  <label className="font-medium text-sm">Question</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg mt-1 mb-3"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />

                  <label className="font-medium text-sm">Options</label>
                  {editOptions.map((opt, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-full p-2 border rounded-lg mt-1 mb-2"
                      value={opt}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => {
                        const arr = [...editOptions];
                        arr[index] = e.target.value;
                        setEditOptions(arr);
                      }}
                    />
                  ))}

                  <label className="font-medium text-sm">Correct Answer</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg mt-1 mb-3"
                    value={editCorrectAnswer}
                    onChange={(e) => setEditCorrectAnswer(e.target.value)}
                  />

                  <label className="font-medium text-sm">Timer (seconds)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    className="w-full p-2 border rounded-lg mt-1 mb-3"
                    value={editTimer}
                    onChange={(e) => setEditTimer(parseInt(e.target.value))}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // VIEW MODE
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <p className="text-sm text-gray-500 mt-1">Timer: {q.timer}s</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(q)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(q._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
