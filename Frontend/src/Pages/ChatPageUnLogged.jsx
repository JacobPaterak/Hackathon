import { useState } from "react";
import "./ChatPage.css";
import GaugeCircle from "../Components/GuageCircle";
import TeamMemberCard from "../Components/TeamMemberCard";
import TypingIndicator from "../Components/TypingIndicator";
export default function ChatPageUnLogged() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [usage, setUsage] = useState(null);
  const handlePrompt = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/ask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await response.json();
    const reply = data.reply;
    const total_usage = data.usage;
    setReply(data.reply || "");
    setUsage(total_usage || null);
    setLoading(false);
  };
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

            <div className="chatMessages">
              {reply && !loading && <div className="agentBubble">{reply}</div>}
              {!reply && !loading && (
                <div className="agentBubble">Agent Response Area</div>
              )}
              {loading && <TypingIndicator />}
            </div>
            <form className="InputForm" onSubmit={handlePrompt}>
              <input
                placeholder="Prompt..."
                className="promptInput"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </form>
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
