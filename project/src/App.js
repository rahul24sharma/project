import React, { useState, useEffect, Suspense } from "react";
import "./index.css";
import Canvas from "./components/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";
import Controls from "./components/Controls/Controls";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Results from "./components/Results/Results";
import { Routes, Route, useNavigate  } from "react-router-dom";
import { auth } from "./firebase";
import Home from "./components/Home/Home";
import Loader from "./components/Loader/Loader";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
      } else {
        setUsername("");
      }
    });
  }, []);

  const handleSignOut = (e) => {
    auth.signOut();
    setUsername("");
    navigate("/"); // use navigate instead of history.push
    // e.preventDefault();
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login name={username} />} />
        <Route path="/results" element={<Results name={username} />} />
        <Route
          path="/play"
          element={
            <Suspense fallback={<Loader />}>
              <Navbar handleSignOut={handleSignOut} name={username} />
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Canvas />
                  <Controls name={username} />
                </>
              )}
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;