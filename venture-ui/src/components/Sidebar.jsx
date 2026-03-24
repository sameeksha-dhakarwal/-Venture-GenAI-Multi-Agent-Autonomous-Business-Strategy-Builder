export default function Sidebar({ setActiveTab }) {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0f766e",
      color: "white",
      padding: "20px"
    }}>
      <h2>Venture GenAI</h2>

      <button onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
      <button onClick={() => setActiveTab("market")}>🌍 Market</button>
      <button onClick={() => setActiveTab("business")}>🧠 Business</button>
      <button onClick={() => setActiveTab("finance")}>📊 Finance</button>
      <button onClick={() => setActiveTab("pitch")}>🎤 Pitch</button>
      <button onClick={() => setActiveTab("competitor")}>🏢 Competitor</button>
    </div>
  );
}