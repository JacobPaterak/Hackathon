import { useEffect, useState } from "react";
import TeamMemberCard from "./TeamMemberCard";

export default function MyRankCard({ name = "You", photoUrl = "" }) {
  const [rank, setRank] = useState(null);
  const [metricsTotal, setMetricsTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRank = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://127.0.0.1:8000/api/rank", {
          credentials: "include", // important for cookie/session auth
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.detail || "Failed to load rank");
          return;
        }

        const data = await res.json(); // { rank, metrics_total }
        setRank(data.rank);
        setMetricsTotal(data.metrics_total);
      } catch (e) {
        setError("Server not reachable");
      } finally {
        setLoading(false);
      }
    };

    loadRank();
  }, []);

  if (loading) {
    return (
      <TeamMemberCard
        name={name}
        role="Loading..."
        description="Fetching your rank…"
        photoUrl={photoUrl}
      />
    );
  }

  if (error) {
    return (
      <TeamMemberCard
        name={name}
        role="—"
        description={error}
        photoUrl={photoUrl}
      />
    );
  }

  return (
    <TeamMemberCard
      name={name}
      role={`#${rank}`}
      description={`Token ${metricsTotal}`}
      photoUrl={photoUrl}
    />
  );
}
