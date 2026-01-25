import "./ChatPage.css";
import GaugeCircle from "../Components/GuageCircle";
import TeamMemberCard from "../Components/TeamMemberCard";
export default function ChatPageUnLogged() {
  return (
    <div className="app">
      {/* Header */}
      <header className="topbar">
        <h1>Varuna</h1>
      </header>

      <div className="layout">
        {/* Left panel */}
        <aside className="left">
          <h3>Top 10 Leaderboard</h3>

          <div className="leaderPreview">
            <TeamMemberCard
              name="Alice"
              role="#1"
              description="Token 10"
              photoUrl=""
            />

            <TeamMemberCard
              name="Bob"
              role="#2"
              description="Token 9"
              photoUrl=""
            />

            <TeamMemberCard
              name="Charlie"
              role="#3"
              description="Token 8"
              photoUrl=""
            />

            <TeamMemberCard
              name="David"
              role="#4"
              description="Token 7"
              photoUrl=""
            />

            <TeamMemberCard
              name="Eve"
              role="#5"
              description="Token 6"
              photoUrl=""
            />

            <TeamMemberCard
              name="Frank"
              role="#6"
              description="Token 5"
              photoUrl=""
            />

            <TeamMemberCard
              name="Grace"
              role="#7"
              description="Token 4"
              photoUrl=""
            />

            <TeamMemberCard
              name="Hank"
              role="#8"
              description="Token 3"
              photoUrl=""
            />

            <TeamMemberCard
              name="Ivy"
              role="#9"
              description="Token 2"
              photoUrl=""
            />

            <TeamMemberCard
              name="Jules"
              role="#10"
              description="Token 1"
              photoUrl=""
            />
          </div>

          <button className="joinBtn">Join the Leaderboard</button>
        </aside>

        {/* Center chat */}
        <main className="center">
          <div className="chatBox">
            <div className="chatTop"></div>

            <div className="chatMessages">Agent Response Area</div>

            <input placeholder="Prompt..." className="promptInput" />
          </div>
        </main>

        {/* Right users */}
        <aside className="right">
          {" "}
          <GaugeCircle value={15} />
          <GaugeCircle value={55} />
          <GaugeCircle value={92} />
        </aside>
      </div>
    </div>
  );
}
