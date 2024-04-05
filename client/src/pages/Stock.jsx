import React from "react";
import TradingViewWidget from "../components/TradingViewWidget";

function Stock() {
  const indices = ["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:AMZN", "NASDAQ:MSFT"];
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      {indices.map((index) => (
        <div key={index} className="p-4 border-2 border-green-400 rounded-lg min-h-[24rem]">
          <TradingViewWidget symbol={index} />
        </div>
      ))}
    </div>
  );
}

export default Stock;