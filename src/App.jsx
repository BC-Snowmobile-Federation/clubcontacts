import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchAllClubs } from "../redux/slice";
import AdminAccess from "./components/AdminAccess";
import GrandAdminAccess from "./components/GrantAdminAccess";

function App() {
  const [hasUser, setHasUser] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllClubs());
  }, [dispatch]);

  useEffect(() => {
    const activeUser = localStorage.getItem("activeUser");
    setHasUser(!!activeUser);
    // if (activeUser == "mora@setandforget.io") {
    if (activeUser == "administrator@bcsf.org") {
      setIsUserAdmin(true);
    } else {
      setIsUserAdmin(false);
    }
  }, []);

  const handleUserLogin = (user) => {
    localStorage.setItem("activeUser", user);
    setHasUser(true);
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Login onUserLogin={handleUserLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute hasUser={hasUser}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grantAdminAccess"
          element={
            <ProtectedRoute hasUser={isUserAdmin}>
              <GrandAdminAccess />
            </ProtectedRoute>
          }
        />
        <Route path="/adminAccess" element={<AdminAccess />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
