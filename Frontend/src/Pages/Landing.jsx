import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}
export default Landing;
