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

// 🔥 REAL DATA-DRIVEN KEYWORDS
const keywords = [
  "পাগল", "দালাল", "চুমা বাবা", "গৰু", "ঠগবাজ",
  "420", "ফটুৱা", "নিলৰ্জ", "বেইমান",
  "কুকুৰ", "ছাগলী", "গাধা", "চেলেকা",
  "মক্কেল", "ভণ্ড", "মিঞা দালাল"
];

const sources = ["FB Live", "FB Page", "FB Group", "FB Reel"];

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
  const [risk, setRisk] = useState(52);
  const [uptime, setUptime] = useState("");
  const [agentLoad, setAgentLoad] = useState(65);

  const agents = 120;

  // ⏱ UPTIME
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

  // ⚙️ MAIN ENGINE
  useEffect(() => {
    setTrend(
      Array.from({ length: 30 }, (_, i) => ({
        time: i,
        value: randomInt(8, 20),
      }))
    );

    const interval = setInterval(() => {
      const keyword = keywords[randomInt(0, keywords.length - 1)];
      const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"][randomInt(0, 3)];
      const clusterId = makeClusterId();

      // ALERTS
      setAlerts((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          keyword,
          severity,
          source: sources[randomInt(0, sources.length - 1)],
        },
        ...prev.slice(0, 7),
      ]);

      // CLUSTERS
      setClusters((prev) => [
        {
          id: clusterId,
          keyword,
          volume: randomInt(25, 75),
        },
        ...prev.slice(0, 5),
      ]);

      // TREND (with mitigation logic)
      setTrend((prev) => {
        let value = randomInt(10, 25);

        if (risk > 65) value -= randomInt(5, 10);

        return [...prev.slice(1), { time: prev.length, value }];
      });

      // RISK ENGINE
      setRisk((r) => {
        let change = randomInt(-3, 6);

        if (r > 70) change -= randomInt(4, 9);

        return Math.max(30, Math.min(95, r + change));
      });

      // AGENT LOAD
      setAgentLoad((l) => {
        let change = randomInt(-5, 5);
        if (risk > 65) change += randomInt(3, 8);
        return Math.max(40, Math.min(100, l + change));
      });

    }, 2500);

    return () => clearInterval(interval);
  }, [risk]);

  return (
    <div className="bg-black min-h-screen text-white p-6">

      <h1 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">
        ⚔️ WAR ROOM COMMAND CENTER
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">

        {/* ALERTS */}
        <div className="col-span-2 bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-3">Live Alerts</h2>

          {alerts.map((a, i) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-800">
              <span>{a.time}</span>
              <span>{a.keyword}</span>
              <span>{a.source}</span>
              <span className={severityColor(a.severity)}>{a.severity}</span>
            </div>
          ))}
        </div>

        {/* TREND */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-gray-800">
          <h2 className="text-lg mb-3">Threat Trend</h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ENTERPRISE LAYER */}
      <div className="grid grid-cols-4 gap-4 mt-6">

        <div className="bg-zinc-900 p-4 rounded-2xl border border-gray-800">
          <h2>Risk Level</h2>
          <div className="text-4xl text-red-500 font-bold">{risk}%</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-gray-800">
          <h2>Agent Load</h2>
          <div className="text-4xl text-yellow-400 font-bold">{agentLoad}%</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-gray-800">
          <h2>System Ops</h2>
          <div className="text-sm">Agents: {agents}</div>
          <div className="text-sm">Uptime: {uptime}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-gray-800">
          <h2>Recommendation</h2>
          <div className="text-red-400">
            {risk > 70 ? "Active Mitigation" : "Monitoring"}
          </div>
        </div>

      </div>

    </div>
  );
}