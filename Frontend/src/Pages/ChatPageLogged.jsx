import { useState } from "react";
import "./ChatPage.css";
import GaugeCircle from "../Components/GuageCircle";
import TeamMemberCard from "../Components/TeamMemberCard";
import TypingIndicator from "../Components/TypingIndicator";
import MyRankCard from "../Components/MyRankCard";
export default function ChatPageLogged() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [usage, setUsage] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rankRefreshKey, setRankRefreshKey] = useState(0);

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
      credentials: "include", // add if /api/ask needs session cookies
    });

    const data = await response.json();
    setReply(data.reply || "");
    setUsage(data.usage || null);

    const leaders = await fetch("http://127.0.0.1:8000/api/leaderboard", {
      credentials: "include",
    });
    const leadersData = await leaders.json();
    setLeaderboard(leadersData.leaders || []);

    setRankRefreshKey((k) => k + 1); // ✅ triggers MyRankCard reload
    setLoading(false);
  };
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbarInner">
          <h1>Varuna</h1>
          <div className="topbarTag">AI Climate Tracker</div>
        </div>
      </header>

      <div className="layout">
        {/* Left panel */}
        <aside className="left">
          <div className="panelHeader">
            <h3>Leaderboard</h3>
            <span className="panelSub">Top 10</span>
          </div>
          <div className="leaderPreview">
            <div className="leaderList">
              {leaderboard.map((user, index) => (
                <TeamMemberCard
                  key={user.id}
                  name={user.username}
                  role={`#${index + 1}`}
                  description={`Score ${user.metrics_total}`}
                  photoUrl=""
                />
              ))}
            </div>

            <div className="myRankWrapper">
              <MyRankCard refreshKey={rankRefreshKey} />
            </div>
          </div>
        </aside>

        {/* Center chat */}
        <main className="center">
          <div className="chatBox">
            <div className="chatHeader">
              <div className="chatTitle">Chat</div>
              <div className="chatHint">Ask anything • we track impact</div>
            </div>

            <div className="chatMessages">
              {reply && !loading && <div className="agentBubble">{reply}</div>}
              {!reply && !loading && (
                <div className="agentBubble placeholder">
                  Agent Response Area
                </div>
              )}
              {loading && <TypingIndicator />}
            </div>

            {/* NOTE: className changed to "inputForm" to match CSS */}
            <form className="inputForm" onSubmit={handlePrompt}>
              <input
                placeholder="Prompt..."
                className="promptInput"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <button
                className="sendBtn"
                type="submit"
                disabled={loading || !prompt.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </main>

        {/* Right panel */}
        <aside className="right">
          <div className="panelHeader">
            <h3>Impact</h3>
            <span className="panelSub">This session</span>
          </div>

          <div className="gaugeStack">
            <div className="gaugeCard">
              <GaugeCircle value={15} />
            </div>
            <div className="gaugeCard">
              <GaugeCircle value={55} />
            </div>
            <div className="gaugeCard">
              <GaugeCircle value={92} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
