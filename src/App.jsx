import {
  BrowserRouter as Router,
  Route,
  Routes,
  HashRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

function App() {
  let hasUser = localStorage.getItem("activeUser");

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        {/* <Route
          path="/dashboard"
          element={hasUser !== null ? <Dashboard /> : <Navigate to="/" />}
        /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute hasUser={hasUser}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/dashboard"
          element={<ProtectedRoute component={Dashboard}/>}
        /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
