import React from "react";

function BusinessView({ data }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧠 Business Model</h2>

      <div className="bg-white/5 p-6 rounded-xl">
        <pre>{data?.business_model}</pre>
      </div>
    </div>
  );
}

export default BusinessView;