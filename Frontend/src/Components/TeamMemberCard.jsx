export default function TeamMemberCard({ name, role, description, photoUrl }) {
  return (
    <div className="team-card">
      <div className="team-photo">
        {photoUrl ? <img src={photoUrl} alt={name} /> : null}
      </div>

      <div className="team-info">
        <div className="team-header">
          <div className="team-name">{name}</div>
          <div className="team-role">{role}</div>
        </div>

        <div className="team-desc">{description}</div>
      </div>
    </div>
  );
}
