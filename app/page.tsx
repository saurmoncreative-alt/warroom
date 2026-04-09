"use client";

import { useState } from "react";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [password, setPassword] = useState("");

  // 🛑 HARDCODED FINAL ELECTION NUMBERS (Directly from your screenshot)
  const detected = 47486;
  const reported = 43690;
  const scrubbed = 37964;

  const todayDetected = 7351;
  const todayReported = 6762;
  const todayScrubbed = 5880;

  const risk = 40;
  const prediction = 98;
  const agents = 800;
  const agentLoad = 0; // Agents sent home
  const uptime = "496h 10m"; // Frozen uptime

  // 🛑 HARDCODED FINAL ALERTS (Frozen at ~5:40 PM)
  const alerts = [
    { time: "5:40:03 PM", keyword: "মিঞা দালাল", severity: "MEDIUM", source: "FB Live", location: "Sivasagar" },
    { time: "5:39:48 PM", keyword: "নিলৰ্জ", severity: "MEDIUM", source: "FB Group", location: "Bongaigaon" },
    { time: "5:39:33 PM", keyword: "ঠগবাজ", severity: "MEDIUM", source: "FB Group", location: "Nagaon" },
    { time: "5:38:33 PM", keyword: "চুমা বাবা", severity: "HIGH", source: "FB Reel", location: "Dibrugarh" },
    { time: "5:38:18 PM", keyword: "চুমা বাবা", severity: "MEDIUM", source: "FB Live", location: "Nagaon" },
    { time: "5:38:03 PM", keyword: "চেলেকা", severity: "HIGH", source: "FB Reel", location: "Silchar" },
    { time: "5:37:48 PM", keyword: "চেলেকা", severity: "HIGH", source: "FB Live", location: "Nagaon" },
    { time: "5:37:33 PM", keyword: "দালাল", severity: "MEDIUM", source: "FB Post", location: "Dibrugarh" },
  ];

  // 🛑 HARDCODED TOP NARRATIVES
  const topTags = [
    { key: "নিলৰ্জ", count: 2 },
    { key: "মিঞা দালাল", count: 2 },
    { key: "চুমা বাবা", count: 2 },
    { key: "চেলেকা", count: 2 },
  ];

  // 🖥️ UI RENDER (Fully Static)
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
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
                    <div className="flex justify-between md:contents">
                      <span className="text-gray-500 font-mono text-xs flex items-center">{a.time}</span>
                      <span className={`text-right text-xs font-bold md:hidden flex items-center ${
                          a.severity === "CRITICAL" ? "text-red-500" : 
                          a.severity === "HIGH" ? "text-orange-500" : "text-gray-500"
                      }`}>
                        [{a.severity}]
                      </span>
                    </div>

                    <div className="flex flex-col md:contents gap-1">
                      <span className="font-bold text-base md:text-sm md:col-span-1">{a.keyword}</span>
                      <span className="text-gray-400 truncate text-xs md:text-sm">{a.location}</span>
                      <span className="text-gray-400 text-xs flex items-center">{a.source}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Agents</h2>
                <div className="text-2xl">{agents}</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Agent Load Capacity</h2>
              <div className="flex items-center gap-3">
                <div className="text-2xl text-green-500">{agentLoad}%</div>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-green-500`} 
                    style={{ width: `${agentLoad}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl opacity-75">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Protocol</h2>
              <div className="text-xl mt-1 font-bold text-gray-500">
                STANDBY: ELECTION CONCLUDED
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}