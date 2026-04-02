"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Alert = {
  time: string;
  keyword: string;
  severity: string;
  source: string;
};

type Cluster = {
  id: string;
  keyword: string;
  volume: number;
};

const keywords = ["পাগল", "দালাল", "চুমা বাবা", "গৰু"];
const sources = ["FB Live", "FB Page", "FB Group"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeClusterId() {
  return "CL-" + randomInt(1000, 9999);
}

export default function Page() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [trend, setTrend] = useState<{ time: number; value: number }[]>([]);

  useEffect(() => {
    setTrend(
      Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: randomInt(5, 15),
      }))
    );

    const interval = setInterval(() => {
      const keyword = keywords[randomInt(0, keywords.length - 1)];
      const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
        randomInt(0, 3)
      ];

      const clusterId = makeClusterId();

      setAlerts((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          keyword,
          severity,
          source: sources[randomInt(0, sources.length - 1)],
        },
        ...prev.slice(0, 8),
      ]);

      setClusters((prev) => [
        {
          id: clusterId,
          keyword,
          volume: randomInt(20, 80),
        },
        ...prev.slice(0, 4),
      ]);

      setTrend((prev) => [
        ...prev.slice(1),
        { time: prev.length, value: randomInt(6, 20) },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h1>⚔️ WAR ROOM</h1>

      <h2>Live Alerts</h2>
      {alerts.map((a, i) => (
        <div key={i}>
          {a.time} | {a.keyword} | {a.source} | {a.severity}
        </div>
      ))}

      <h2>Trend</h2>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={trend}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Clusters</h2>
      {clusters.map((c, i) => (
        <div key={i}>
          {c.id} | {c.keyword} | {c.volume}
        </div>
      ))}
    </div>
  );
}