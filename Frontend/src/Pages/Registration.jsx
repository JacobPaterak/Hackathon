import { useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Username.trim() || !password.trim()) {
      alert("Both inputs must be filled");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: Username,
        password: password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      alert(error.detail || "Registration failed");
      return;
    } else {
      navigate("/login");
    }
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
