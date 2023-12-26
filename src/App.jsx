import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchAllClubs } from "../redux/slice";

function App() {
  const [hasUser, setHasUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllClubs());
  }, [dispatch]);

  useEffect(() => {
    const activeUser = localStorage.getItem("activeUser");
    setHasUser(!!activeUser); // !! converts the value to a boolean
  }, []);

  const handleUserLogin = (user) => {
    localStorage.setItem('activeUser', user);
    setHasUser(true);
  };

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Login onUserLogin={handleUserLogin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute hasUser={hasUser}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;