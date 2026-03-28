import React from "react";

function FinanceView({ data }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">📊 Financials</h2>

      <div className="bg-white/5 p-6 rounded-xl">
        <pre className="whitespace-pre-wrap">{data?.financials}</pre>
      </div>
    </div>
  );
}

export default FinanceView;