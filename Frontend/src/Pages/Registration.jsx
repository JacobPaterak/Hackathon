import { useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleSubmit = (e) => {
    if (!Username.trim() || !password.trim()) {
      alert("Both inputs must be filled");
      return;
    }
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="Registration">
      <input
        type="text"
        placeholder="Username"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
