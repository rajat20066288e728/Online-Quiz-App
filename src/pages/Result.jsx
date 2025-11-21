import { useLocation, Link } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const { score, total } = location.state;

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Your Score</h1>
      <p className="text-xl mt-4">{score} / {total}</p>
      <Link to="/">
        <button className="bg-green-500 text-white px-5 py-2 rounded mt-5">
          Go Home
        </button>
      </Link>
    </div>
  );
}
