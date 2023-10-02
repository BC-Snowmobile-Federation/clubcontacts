import {
  BrowserRouter as Router,
  Route,
  Routes,
  HashRouter
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  console.log("at app", userEmail);
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
