import { useState, useEffect } from "react";
import "./ChatPage.css";
import GaugeCircle from "../Components/GuageCircle";
import TeamMemberCard from "../Components/TeamMemberCard";
import TypingIndicator from "../Components/TypingIndicator";
import { useNavigate } from "react-router-dom";

export default function ChatPageUnLogged() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [usage, setUsage] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const metrics = usage?.metrics || {};
  const round2 = (n) => Math.round((n || 0) * 100) / 100;
  const navigate = useNavigate();

  // ✅ shared leaderboard loader (used on mount + after each prompt)
  const loadLeaderboard = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaders || []);
    } catch (err) {
      console.error("Leaderboard load failed:", err);
    }
  };

  // ✅ load leaderboard on page load
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handlePrompt = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ask", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      setReply(data.reply || "");
      setUsage(data.usage || null);

      // ✅ refresh leaderboard after each prompt submit
      await loadLeaderboard();
    } catch (err) {
      console.error("Prompt failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbarInner">
          <h1>Varuna</h1>
          <div className="topbarTag">AI METRICS</div>
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

          <button className="joinBtn" onClick={() => navigate("/login")}>
            Join the Leaderboard
          </button>
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
                  See how much your data costs!
                </div>
              )}

              {loading && (
                <div className="chatLoading">
                  <TypingIndicator />
                </div>
              )}
            </div>

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
            <span className="panelSub">Prompt Scan</span>
          </div>

          <div className="gaugeStack">
            <div className="gaugeCard">
              <div className="gaugeTitle">CO2</div>
              <GaugeCircle
                value={round2((metrics.co2_consumption / 45.5) * 100)}
                className="gauge--co2"
                unit="g"
              />
            </div>

            <div className="gaugeCard">
              <div className="gaugeTitle">H2O</div>
              <GaugeCircle
                value={round2((metrics.h2o_consumption / 210) * 100)}
                className="gauge--h2o"
                unit="ml"
              />
            </div>

            <div className="gaugeCard">
              <div className="gaugeTitle">W/h</div>
              <GaugeCircle
                value={round2((metrics.wh_consumption / 181.66) * 100)}
                className="gauge--wh"
                unit="Wh"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
