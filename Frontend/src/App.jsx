import { useState } from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Registration from "./Pages/Registration.jsx";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
