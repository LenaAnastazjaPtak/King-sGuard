import "./App.css";
import LogonComponent from "./components/LogonComponent";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { Snackbar } from "@mui/material";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/logon" element={<LogonComponent />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Snackbar />
      </Router>
    </SnackbarProvider>
  );
};

export default App;
