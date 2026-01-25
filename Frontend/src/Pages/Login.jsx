import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [password, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Username.trim() || !password.trim()) {
      alert("Both inputs must be filled");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
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
      alert(error.detail || "Login failed");
      return;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="Login">
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
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
}
export default Login;
