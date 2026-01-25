export default function TeamMemberCard({ name, role }) {
  return (
    <div className="card">
      <strong>{name}</strong>
      <div>{role}</div>
    </div>
  );
}
