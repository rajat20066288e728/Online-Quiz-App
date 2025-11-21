import axios from "axios";

app.use(
  cors({
    origin: "https://online-quiz-app-1ok0.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

export default api;
