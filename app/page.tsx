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

const severityColor = (level: string) => {
  if (level === "CRITICAL") return "text-red-500";
  if (level === "HIGH") return "text-orange-400";
  if (level === "MEDIUM") return "text-yellow-400";
  return "text-green-400";
};

export default function Page() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [trend, setTrend] = useState<{ time: number; value: number }[]>([]);
  const [risk, setRisk] = useState(45);

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
        ...prev.slice(0, 6),
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

      // Risk movement (controlled)
      setRisk((r) => Math.max(20, Math.min(100, r + randomInt(-3, 6))));

    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">
        ⚔️ WAR ROOM COMMAND CENTER
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-4">

        {/* ALERTS */}
        <div className="col-span-2 bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Live Alerts</h2>

          {alerts.map((a, i) => (
            <div
              key={i}
              className="flex justify-between text-sm py-2 border-b border-gray-800"
            >
              <span>{a.time}</span>
              <span>{a.keyword}</span>
              <span>{a.source}</span>
              <span className={severityColor(a.severity)}>
                {a.severity}
              </span>
            </div>
          ))}
        </div>

        {/* TREND */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Threat Trend</h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CLUSTERS */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Active Clusters</h2>

          {clusters.map((c, i) => (
            <div
              key={i}
              className="flex justify-between text-sm py-2 border-b border-gray-800"
            >
              <span>{c.id}</span>
              <span>{c.keyword}</span>
              <span className="text-red-400 font-semibold">
                {c.volume}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* INTELLIGENCE LAYER */}
      <div className="grid grid-cols-3 gap-4 mt-6">

        {/* RISK */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">Risk Level</h2>
          <div className="text-4xl font-bold text-red-500">
            {risk}%
          </div>
          <div className="text-sm text-gray-400">
            Narrative intensity index
          </div>
        </div>

        {/* TOP ACCOUNTS */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">Top Active Accounts</h2>

          {["UID_653844","UID_678528","UID_437887"].map((id, i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span>{id}</span>
              <span className="text-red-400">{randomInt(30,80)}</span>
            </div>
          ))}
        </div>

        {/* DECISION ENGINE */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">System Recommendation</h2>

          <div className="text-red-400 font-semibold">
            {risk > 70
              ? "Suppress Immediately"
              : risk > 50
              ? "Deploy Counter Narrative"
              : "Monitor Situation"}
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Based on cluster velocity & severity
          </div>
        </div>

      </div>

    </div>
  );
}