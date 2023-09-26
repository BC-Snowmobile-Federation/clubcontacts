import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Protected from "./components/Protected";

function App() {
  const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  console.log("at app", userEmail);
  return (
    <Router>
      <Routes>
        <Route path="bcsf/" element={<Login />} />
        {/* <Route
          path="/bcsf/dashboard"
          element={
            userEmail != null ? <Dashboard /> : <Navigate to="/bcsf" replace />
          }
        /> */}
        <Route
          path="/bcsf/dashboard"
          element={
            <Protected isLoggedIn={userEmail}>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
