import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";
import Notification from "./pages/notification/Notification";
import Forgot from "./pages/auth/forgot/Forgot";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/forgotPassword" element={<Forgot />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
