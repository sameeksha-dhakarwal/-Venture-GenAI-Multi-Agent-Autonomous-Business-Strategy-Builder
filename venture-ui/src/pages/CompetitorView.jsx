import React from "react";

function CompetitorView({ data }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">🏢 Competitor Analysis</h2>

      <div className="bg-white/5 p-6 rounded-xl">
        <pre className="whitespace-pre-wrap">{data?.competitors}</pre>
      </div>
    </div>
  );
}

export default CompetitorView;