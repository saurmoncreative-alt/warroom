"use client";

import { useEffect, useState } from "react";

type Alert = {
  time: string;
  keyword: string;
  severity: string;
  source: string;
  location: string;
};

// Regional hubs relevant to Assam/NE for geographical context
const locations = ["Guwahati", "Sivasagar", "Jorhat", "Dibrugarh", "Nagaon", "Silchar", "Tezpur", "Bongaigaon"];

const keywords = [
  "পাগল","দালাল","চুমা বাবা","গৰু","ঠগবাজ",
  "ফটুৱা","নিলৰ্জ","বেইমান",
  "কুকুৰ","ছাগলী","গাধা","চেলেকা",
  "মক্কেল","ভণ্ড","মিঞা দালাল"
];

// Restricted strictly to the Facebook ecosystem
const sources = ["FB Live", "FB Page", "FB Group", "FB Reel", "FB Post"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const severityOrder = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [password, setPassword] = useState("");

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [risk, setRisk] = useState(65);
  const [prediction, setPrediction] = useState(90);

  const [detected, setDetected] = useState(24600);
  const [reported, setReported] = useState(23000);
  const [scrubbed, setScrubbed] = useState(20000);

  const [todayDetected, setTodayDetected] = useState(1100);
  const [todayReported, setTodayReported] = useState(1100);
  const [todayScrubbed, setTodayScrubbed] = useState(1000);

  const [agentLoad, setAgentLoad] = useState(72);
  const [topTags, setTopTags] = useState<any[]>([]);

  const agents = 120;
  const [uptime, setUptime] = useState("");

  // 🔥 PRELOAD ALERTS
  useEffect(() => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const initialAlerts = [];

    for (let i = 0; i < 12; i++) {
      initialAlerts.push({
        time: new Date(now.getTime() - i * 15000).toLocaleTimeString(),
        keyword: keywords[randomInt(0, keywords.length - 1)],
        severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][randomInt(0, 3)],
        source: sources[randomInt(0, sources.length - 1)],
        location: locations[randomInt(0, locations.length - 1)]
      });
    }

    initialAlerts.sort(
      (a, b) =>
        severityOrder[b.severity as keyof typeof severityOrder] -
        severityOrder[a.severity as keyof typeof severityOrder]
    );

    const map: any = {};
    initialAlerts.forEach((a) => {
      map[a.keyword] = (map[a.keyword] || 0) + 1;
    });

    const tags = Object.entries(map)
      .map(([key, count]: any) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    setTopTags(tags);
    setAlerts(initialAlerts);
  }, []);

  // 🕒 UPTIME TRACKER
  useEffect(() => {
    const updateUptime = () => {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const start = new Date("2026-03-20T01:30:00");
      const diffMs = now.getTime() - start.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

      setUptime(`${hours}h ${minutes}m`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 ENGINE
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const generateTick = () => {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const startTime = new Date("2026-04-05T08:30:00");
      const endTime = new Date("2026-04-05T09:59:00");
      const startValue = 24600;
      const endValue = 25000;

      let currentDetected = startValue;

      if (now <= endTime) {
        const progress = Math.max(
          0,
          (now.getTime() - startTime.getTime()) /
          (endTime.getTime() - startTime.getTime())
        );
        
        currentDetected = Math.floor(
          startValue + progress * (endValue - startValue)
        );
      } else {
        const extraTime = now.getTime() - endTime.getTime();
        const dailyRate = 1500;
        const perMs = dailyRate / (24 * 60 * 60 * 1000);
        const extraGrowth = Math.floor(extraTime * perMs);
        currentDetected = endValue + extraGrowth;
      }

      setDetected(currentDetected);

      const reportedJitter = randomInt(-15, 15);
      const scrubbedJitter = randomInt(-25, 25);
      
      const currentReported = Math.max(
        0,
        Math.floor(currentDetected * 0.92) + reportedJitter
      );

      const currentScrubbed = Math.min(
        currentReported,
        Math.max(0, Math.floor(currentDetected * 0.80) + scrubbedJitter)
      );

      setReported(currentReported);
      setScrubbed(currentScrubbed);

      const backlog = currentDetected - currentScrubbed;
      
      let calculatedLoad = Math.floor(backlog / 60) + randomInt(-3, 3);
      setAgentLoad(Math.max(45, Math.min(99, calculatedLoad)));

      setRisk(Math.min(90, Math.max(40, Math.floor(backlog / 500))));

      setPrediction((p) => {
        let shift = randomInt(-1, 2);
        return Math.max(80, Math.min(98, p + shift));
      });

      const keyword = keywords[randomInt(0, keywords.length - 1)];
      const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"][randomInt(0, 3)];
      const source = sources[randomInt(0, sources.length - 1)];
      const location = locations[randomInt(0, locations.length - 1)];

      setAlerts((prev) => {
        const updated = [
          {
            time: now.toLocaleTimeString(),
            keyword,
            severity,
            source,
            location, 
          },
          ...prev,
        ].slice(0, 12); 

        updated.sort(
          (a, b) =>
            severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
        );

        const map: any = {};
        updated.forEach((a) => {
          map[a.keyword] = (map[a.keyword] || 0) + 1;
        });

        const tags = Object.entries(map)
          .map(([key, count]: any) => ({ key, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setTopTags(tags);
        return updated;
      });

      const todayRatio = 0.05;
      setTodayDetected(Math.floor(currentDetected * todayRatio) + randomInt(-2, 5));
      setTodayReported(Math.floor(currentReported * todayRatio) + randomInt(-2, 5));
      setTodayScrubbed(Math.floor(currentScrubbed * todayRatio) + randomInt(-2, 5));

      const nextTick = randomInt(40000, 80000);
      timeoutId = setTimeout(generateTick, nextTick);
    };

    generateTick();

    return () => clearTimeout(timeoutId);
  }, []);

  // 🖥️ UI RENDER
  return (
    <div className="bg-black min-h-screen text-white p-3 md:p-6 font-mono">
      {!loggedIn ? (
        <div className="flex items-center justify-center h-screen px-4">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl">
            <h2 className="text-lg mb-4 text-gray-200">
              {isAuthenticating ? "⏳ Authenticating..." : "🔐 Secure Access"}
            </h2>

            <input
              type="password"
              placeholder="Enter Access Key"
              className="w-full p-2 mb-4 bg-black border border-gray-700 rounded text-green-500 focus:outline-none focus:border-red-500 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticating}
            />

            <button
              onClick={() => {
                if (password === "KyrosAura") {
                  setIsAuthenticating(true);
                  setTimeout(() => {
                    setLoggedIn(true);
                    setIsAuthenticating(false);
                  }, 1500); 
                } else {
                  alert("⚠️ Unauthorized Node Access Denied");
                }
              }}
              disabled={isAuthenticating}
              className={`w-full py-2 rounded transition-all ${
                isAuthenticating
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-600 text-white"
              }`}
            >
              {isAuthenticating ? "Establishing Connection" : "Initialize"}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Restricted Campaign Interface<br/>
              Node: IND-NE-01
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-2 mb-2 gap-3 sm:gap-0">
            <h1 className="text-lg md:text-2xl font-bold tracking-wider">
              <span className="text-red-600 animate-pulse mr-2">●</span>
              WAR ROOM COMMAND CENTER
            </h1>

            <button
              onClick={() => {
                setLoggedIn(false);
                setPassword("");
              }}
              className="bg-zinc-800 border border-gray-700 px-3 py-1 rounded text-sm hover:bg-red-800 transition-colors self-end sm:self-auto"
            >
              Sever Connection
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            warroom.jansanjog.com | Internal Node | Uptime: {uptime}
          </p>

          {/* TOP METRICS - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Detected</div>
              <div className="text-3xl font-light">{detected.toLocaleString()}</div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reported</div>
              <div className="text-3xl font-light text-yellow-400">{reported.toLocaleString()}</div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Scrubbed</div>
              <div className="text-3xl font-light text-green-400">{scrubbed.toLocaleString()}</div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">System Risk</div>
              <div className={`text-3xl font-light ${risk > 75 ? "text-red-500" : "text-orange-400"}`}>
                {risk}%
              </div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Prediction</div>
              <div className="text-3xl font-light text-blue-400">{prediction}%</div>
            </div>
          </div>

          {/* TWO COLUMN LAYOUT - Stacks on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* LIVE THREAT STREAM */}
            <div className="col-span-1 lg:col-span-2 bg-zinc-900 border border-gray-800 p-3 md:p-4 rounded-xl h-[500px] md:h-96 overflow-hidden flex flex-col">
              <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                Live Regional Threat Stream
              </h2>
              
              <div className="flex-1 flex flex-col gap-2 md:gap-1 overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className={`flex flex-col md:grid md:grid-cols-5 text-sm py-2 px-3 rounded gap-1 md:gap-0 ${
                      a.severity === "CRITICAL"
                        ? "bg-red-950/30 border border-red-900/50 text-red-400 animate-pulse"
                        : a.severity === "HIGH"
                        ? "bg-orange-950/20 text-orange-300"
                        : "text-gray-300 hover:bg-zinc-800"
                    }`}
                  >
                    {/* Mobile: Top Row (Time + Severity) | Desktop: Col 1 & 5 */}
                    <div className="flex justify-between md:contents">
                      <span className="text-gray-500 font-mono text-xs flex items-center">{a.time}</span>
                      <span className={`text-right text-xs font-bold md:hidden flex items-center ${
                          a.severity === "CRITICAL" ? "text-red-500" : 
                          a.severity === "HIGH" ? "text-orange-500" : "text-gray-500"
                      }`}>
                        [{a.severity}]
                      </span>
                    </div>

                    {/* Mobile: Bottom Row (Keyword + Location + Source Stacked) | Desktop: Col 2, 3, 4 */}
                    <div className="flex flex-col md:contents gap-1">
                      <span className="font-bold text-base md:text-sm md:col-span-1">{a.keyword}</span>
                      <span className="text-gray-400 truncate text-xs md:text-sm">{a.location}</span>
                      <span className="text-gray-400 text-xs flex items-center">{a.source}</span>
                      {/* Hidden on Mobile, shown on Desktop at the end */}
                      <span className={`hidden md:flex text-right text-xs font-bold items-center justify-end ${
                          a.severity === "CRITICAL" ? "text-red-500" : 
                          a.severity === "HIGH" ? "text-orange-500" : "text-gray-500"
                      }`}>
                        [{a.severity}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDE PANELS */}
            <div className="flex flex-col gap-6">
              
              <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl flex-1">
                <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                  Top Trending Narratives
                </h2>
                <div className="flex flex-col gap-2">
                  {topTags.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-black px-3 py-2 rounded border border-gray-800">
                      <span className="text-red-400 font-bold">{t.key}</span>
                      <span className="text-gray-500 text-xs bg-zinc-800 px-2 py-1 rounded">FREQ: {t.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
                <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                  Today's Volume
                </h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Detected:</span>
                  <span>{todayDetected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Reported:</span>
                  <span className="text-yellow-400">{todayReported.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Scrubbed:</span>
                  <span className="text-green-400">{todayScrubbed.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>

          {/* AGENTS PANEL - Stacks on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Agents</h2>
                <div className="text-2xl">{agents}</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Agent Load Capacity</h2>
              <div className="flex items-center gap-3">
                <div className="text-2xl text-yellow-400">{agentLoad}%</div>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${agentLoad > 85 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${agentLoad}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Protocol</h2>
              <div className={`text-xl mt-1 font-bold ${risk > 70 ? "text-red-500 animate-pulse" : "text-green-500"}`}>
                {risk > 70 ? "DEFCON: ACTIVE MITIGATION" : "PASSIVE MONITORING"}
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}