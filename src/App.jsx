import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  console.log("at app", userEmail);
  return (
    <Router>
      <Routes>
        <Route exact path="/bcsf/" element={<Login />} />
        <Route
          path="/bcsf/dashboard/"
          // element={
          //   userEmail != null ? <Dashboard /> : <Navigate to="/bcsf/" replace />
          // }
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
