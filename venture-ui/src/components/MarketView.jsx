import { LineChart, Line, XAxis, YAxis } from "recharts";

export default function MarketView() {
  const data = [
    { year: 2020, value: 10 },
    { year: 2021, value: 20 },
    { year: 2022, value: 35 },
    { year: 2023, value: 50 },
  ];

  return (
    <div>
      <h2>🌍 Market Analysis</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        
        <div style={{ background: "#e0f2f1", padding: "20px" }}>
          <h3>Market Size</h3>
          <p>TAM: $500B</p>
          <p>SAM: $50B</p>
          <p>SOM: $5B</p>
        </div>

        <div style={{ background: "#e0f2f1", padding: "20px" }}>
          <h3>Persona</h3>
          <p>Eco-conscious users</p>
        </div>

        <LineChart width={300} height={200} data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Line type="monotone" dataKey="value" />
        </LineChart>

      </div>
    </div>
  );
}