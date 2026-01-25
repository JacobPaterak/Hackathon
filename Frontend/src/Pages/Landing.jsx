import { useNavigate } from "react-router-dom";
import TeamMemberCard from "../Components/TeamMemberCard";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <div className="team-members">
        <TeamMemberCard name="Alice" role="Developer" />
        <TeamMemberCard name="Bob" role="Designer" />
        <TeamMemberCard name="Charlie" role="Project Manager" />
        <TeamMemberCard name="David" role="Tester" />
      </div>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}
export default Landing;
