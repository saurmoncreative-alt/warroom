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

// TYPES
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

// DATA
const keywords = ["পাগল", "দালাল", "চুমা বাবা", "গৰু", "ঠগবাজ"];
const sources = ["FB Live", "FB Page", "FB Group", "FB Reel"];

// HELPERS
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
  const [risk, setRisk] = useState(48);
  const [uptime, setUptime] = useState("");

  const agents = 120;

  // UPTIME CALCULATION
  useEffect(() => {
    const start = new Date("2026-04-20T01:30:00");

    const update = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      setUptime(`${hours}h ${mins}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // MAIN ENGINE
  useEffect(() => {
    setTrend(
      Array.from({ length: 25 }, (_, i) => ({
        time: i,
        value: randomInt(6, 18),
      }))
    );

    const interval = setInterval(() => {
      const keyword = keywords[randomInt(0, keywords.length - 1)];
      const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
        randomInt(0, 3)
      ];

      const clusterId = makeClusterId();

      // ALERTS
      setAlerts((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          keyword,
          severity,
          source: sources[randomInt(0, sources.length - 1)],
        },
        ...prev.slice(0, 6),
      ]);

      // CLUSTERS (controlled growth)
      setClusters((prev) => {
        const growth = risk > 65 ? randomInt(1, 3) : randomInt(2, 6);

        return [
          {
            id: clusterId,
            keyword,
            volume: randomInt(20, 60) + growth,
          },
          ...prev.slice(0, 4),
        ];
      });

      // TREND
      setTrend((prev) => {
        let base = randomInt(8, 22);

        // mitigation effect
        if (risk > 65) base -= randomInt(4, 8);

        return [...prev.slice(1), { time: prev.length, value: base }];
      });

      // RISK ENGINE (key realism)
      setRisk((r) => {
        let change = randomInt(-2, 5);

        if (r > 70) change -= randomInt(4, 8);
        else if (r > 60) change -= randomInt(2, 5);

        return Math.max(25, Math.min(95, r + change));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [risk]);

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
      <div className="grid grid-cols-4 gap-4 mt-6">

        {/* RISK */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">Risk Level</h2>
          <div className="text-4xl font-bold text-red-500">{risk}%</div>
          <div className="text-xs text-gray-400">
            Narrative intensity index
          </div>
        </div>

        {/* ACCOUNTS */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">Top Active Accounts</h2>

          {["UID_653844", "UID_678528", "UID_437887"].map((id, i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span>{id}</span>
              <span className="text-red-400">{randomInt(35, 85)}</span>
            </div>
          ))}
        </div>

        {/* DECISION */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">System Recommendation</h2>

          <div className="text-red-400 font-semibold">
            {risk > 70
              ? "Active Mitigation"
              : risk > 50
              ? "Counter Narrative Scaling"
              : "Monitoring"}
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Based on cluster velocity & severity
          </div>
        </div>

        {/* AUTOMATION */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-2">System Operations</h2>

          <div className="flex justify-between text-sm py-1">
            <span>Active Agents</span>
            <span className="text-green-400">{agents}</span>
          </div>

          <div className="flex justify-between text-sm py-1">
            <span>Status</span>
            <span className="text-green-400">Active</span>
          </div>

          <div className="flex justify-between text-sm py-1">
            <span>Uptime</span>
            <span className="text-gray-400">{uptime}</span>
          </div>

          <div className="flex justify-between text-sm py-1">
            <span>Response Mode</span>
            <span className="text-yellow-400">
              {risk > 65 ? "Active Mitigation" : "Monitoring"}
            </span>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Automated agents responding to narrative escalation patterns
          </div>
        </div>

      </div>

    </div>
  );
}