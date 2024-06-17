import "./App.css";
import { Routes, Route } from "react-router-dom";
import GamePopularity from "./GamePopularity/GamePopularity";
import GenrePopularity from "./GenrePopularity/GenrePopularity";
import Sources from "./Sources/Sources";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";

import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("token");
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gamePopularity" />} />
      <Route
        path="/genrePopularity"
        element={
          <PrivateRoute>
            <GenrePopularity />
          </PrivateRoute>
        }
      />
      <Route
        path="/gamePopularity"
        element={
          <PrivateRoute>
            <GamePopularity />
          </PrivateRoute>
        }
      />
      <Route
        path="/sources"
        element={
          <PrivateRoute>
            <Sources />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
