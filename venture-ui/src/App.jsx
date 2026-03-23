import { useState } from "react";

function App() {
  const [idea, setIdea] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1> Venture GenAI</h1>

      <input
        type="text"
        placeholder="Enter startup idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{ width: "400px", padding: "10px" }}
      />

      <br /><br />

      <button onClick={generate}>Generate</button>

      {loading && <p> AI is working...</p>}

      {data && (
        <div>
          <h2> Market</h2>
          <pre>{data.market}</pre>

          <h2> Competitors</h2>
          <pre>{data.competitors}</pre>

          <h2> Business</h2>
          <pre>{data.business_model}</pre>

          <h2>Financials</h2>
          <pre>{data.financials}</pre>

          <h2> Pitch</h2>
          <pre>{data.pitch_deck}</pre>
        </div>
      )}
    </div>
  );
}

export default App;