import { useState } from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Registration from "./Pages/Registration.jsx";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login.jsx";
import ChatPageUnlogged from "./Pages/ChatPageUnLogged.jsx";
import ChatPageLogged from "./Pages/ChatPageLogged.jsx";
import GaugeCircle from "./Components/GuageCircle.jsx";
function App() {
  const [value, setValue] = useState(0);
  const randomize = () => {
    const target = Math.floor(Math.random() * 101);
    setValue(target);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/chatUnLogged" element={<ChatPageUnlogged />} />
          <Route path="/chatLogged" element={<ChatPageLogged />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
