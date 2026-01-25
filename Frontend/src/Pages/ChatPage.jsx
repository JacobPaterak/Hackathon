import "./ChatPage.css";
import GaugeCircle from "../Components/GuageCircle";
export default function ChatPage() {
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
            <div>Photo</div>
            <div>Name • Score</div>
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
