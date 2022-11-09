import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Mainweb from "./Mainweb";

function App() {
  return (
    <div>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="main" element={<Mainweb />} />
    </Routes>
    </div>
  );
}

export default App;
