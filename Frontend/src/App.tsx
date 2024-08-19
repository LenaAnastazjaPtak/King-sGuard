import "./App.css";
import LogonComponent from "./components/LogonComponent";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";


const App = () => {

  return <Router>
    <Routes>
      <Route path="/logon" element={<LogonComponent />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
}

export default App;
