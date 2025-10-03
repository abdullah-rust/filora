import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./home/home";
import Welcome from "./Welcome/Welcome";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import OTPVerification from "./Auth/OTPVerification";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTPVerification />} />
    </Routes>
  );
}

export default App;
