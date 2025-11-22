# Online Quiz Application

A modern, interactive quiz application built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- 🎯 **Interactive Quiz System** - Take quizzes with multiple-choice questions
- ⏱️ **Question Timers** - Each question has a configurable countdown timer
- 📊 **Score Tracking** - See your results after completing the quiz
- 📝 **Answer Review** - Review all questions with correct/incorrect answers after quiz completion
- 🔐 **Admin Panel** - Secure admin interface to manage questions
- 📥 **JSON Bulk Import** - Quickly import multiple questions using JSON format
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## How It Works

1. **Start Quiz** - Users begin the quiz and answer questions one by one
2. **Timer Countdown** - Each question has a timer that auto-submits when time expires
3. **No Immediate Feedback** - Users don't see if their answer is correct until the end
4. **Review Mode** - After completing all questions, users can review each question with their answers and the correct answers highlighted

## Admin Panel

Access the admin panel at `/admin` to:
- Add individual questions with custom timers
- Import multiple questions using JSON
- View all existing questions
- Delete questions

## JSON Bulk Import Format

You can quickly import multiple questions by pasting JSON into the admin panel. Use the following format:

### JSON Structure

```json
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": "Paris",
    "timer": 10
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correctAnswer": "Mars",
    "timer": 15
  },
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": "4",
    "timer": 5
  }
]
```

### Field Descriptions

- **question** (required, string) - The question text
- **options** (required, array of strings) - Array of answer choices (minimum 2)
- **correctAnswer** (required, string) - The correct answer (must exactly match one of the options)
- **timer** (optional, number) - Time limit in seconds for this question (default: 30)
  - Minimum: 5 seconds
  - Maximum: 300 seconds (5 minutes)

### Import Steps

1. Navigate to the Admin Panel (`/admin`)
2. Scroll to the "Bulk Import from JSON" section
3. Paste your JSON array into the textarea
4. Click "Import Questions"
5. You'll see a success message with the number of questions imported

### Validation

The system validates:
- JSON must be a valid array
- Each question must have `question`, `options`, and `correctAnswer` fields
- Options must be an array with at least 2 items
- If timer is not specified, defaults to 30 seconds

## Tech Stack

### Frontend
- React 19
- React Router
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- CORS enabled
- Environment variables with dotenv
