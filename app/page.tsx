"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Simple UI components (no external dependency)
const Card = ({ children, className }) => (
  <div className={`rounded-2xl p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 text-xs rounded ${className}`}>{children}</span>
);

const keywords = ["পাগল","দালাল","চুমা বাবা","গৰু","ঠগবাজ"];
const sources = ["FB Live","FB Page","FB Group"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeClusterId() {
  return "CL-" + randomInt(1000, 9999);
}

export default function Page() {
  const [alerts, setAlerts] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    setTrend(Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: randomInt(5, 15)
    })));

    setClusters([
      { id: makeClusterId(), keyword: "পাগল", volume: 40, status: "Active" }
    ]);

    const interval = setInterval(() => {
      const keyword = keywords[randomInt(0, keywords.length - 1)];
      const severity = ["LOW","MEDIUM","HIGH","CRITICAL"][randomInt(0,3)];

      const clusterId = makeClusterId();

      setAlerts(prev => [
        {
          time: new Date().toLocaleTimeString(),
          keyword,
          severity,
          source: sources[randomInt(0, sources.length - 1)],
          clusterId
        },
        ...prev.slice(0, 8)
      ]);

      setClusters(prev => [
        { id: clusterId, keyword, volume: randomInt(20, 80), status: "Active" },
        ...prev.slice(0, 4)
      ]);

      setTrend(prev => [
        ...prev.slice(1),
        { time: prev.length, value: randomInt(6, 20) }
      ]);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6 grid grid-cols-3 gap-4">

      {/* Header */}
      <div className="col-span-3 text-2xl font-bold">
        ⚔️ WAR ROOM
      </div>

      {/* Alerts */}
      <Card className="col-span-2 bg-zinc-900">
        <h2 className="mb-2">Live Alerts</h2>
        {alerts.map((a, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 text-sm border-b py-1">
            <span>{a.time}</span>
            <span>{a.keyword}</span>
            <span>{a.source}</span>
            <Badge>{a.severity}</Badge>
          </div>
        ))}
      </Card>

      {/* Trend */}
      <Card className="bg-zinc-900">
        <h2 className="mb-2">Trend</h2>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trend}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Clusters */}
      <Card className="bg-zinc-900">
        <h2 className="mb-2">Clusters</h2>
        {clusters.map((c, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span>{c.id}</span>
            <span>{c.keyword}</span>
            <span>{c.volume}</span>
          </div>
        ))}
      </Card>

    </div>
  );
}