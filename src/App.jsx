import {
  BrowserRouter as Router,
  Route,
  Routes,
  HashRouter
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
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
