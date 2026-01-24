import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [password, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Username.trim() || !password.trim()) {
      alert("Both inputs must be filled");
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
