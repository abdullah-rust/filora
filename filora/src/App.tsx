import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home/Home";
import AlertMessage from "./Components/AlertMessage/AlertMessage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import OTPVerification from "./Auth/OTPVerification";
import Welcome from "./Components/Welcome/Welcome";

function App() {
  return (
    <>
      <AlertMessage />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTPVerification />} />
      </Routes>
    </>
  );
}

export default App;
