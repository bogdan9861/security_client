import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.tsx";

import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import Register from "./pages/register/Register.jsx";
import Tickets from "./pages/tickets/Tickets.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/notifications" element={<Notifications />}></Route>
          <Route path="/tickets" element={<Tickets />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
