import "./TypingIndicator.css";

export default function TypingIndicator() {
  return (
    <div className="typing-bubble" aria-label="AI is typing">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
}
