import { useState } from "react";

export default function Dashboard({ setActiveTab }) {
  const [idea, setIdea] = useState("");

  return (
    <div>
      <h1>Venture GenAI</h1>

      <input
        placeholder="Write your startup idea..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{
          width: "60%",
          padding: "12px",
          borderRadius: "10px"
        }}
      />

      <br /><br />

      <button onClick={() => setActiveTab("market")}>
        Analyze 🚀
      </button>
    </div>
  );
}