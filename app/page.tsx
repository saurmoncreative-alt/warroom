"use client";

import { useEffect, useState } from "react";

type Alert = {
  time: string;
  keyword: string;
  severity: string;
  source: string;
};

const keywords = [
  "পাগল","দালাল","চুমা বাবা","গৰু","ঠগবাজ",
  "ফটুৱা","নিলৰ্জ","বেইমান",
  "কুকুৰ","ছাগলী","গাধা","চেলেকা",
  "মক্কেল","ভণ্ড","মিঞা দালাল"
];

const sources = ["FB Live","FB Page","FB Group","FB Reel"];

function randomInt(min:number,max:number){
  return Math.floor(Math.random()*(max-min+1))+min;
}

const severityOrder = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export default function Page(){

  const [loggedIn,setLoggedIn]=useState(false);
  const [password,setPassword]=useState("");

  const [alerts,setAlerts]=useState<Alert[]>([]);
  const [risk,setRisk]=useState(65);
  const [prediction,setPrediction]=useState(90);

  const [detected,setDetected]=useState(24600);
  const [reported,setReported]=useState(23000);
  const [scrubbed,setScrubbed]=useState(20000);

  const [todayDetected,setTodayDetected]=useState(1100);
  const [todayReported,setTodayReported]=useState(1100);
  const [todayScrubbed,setTodayScrubbed]=useState(1000);

  const [agentLoad,setAgentLoad]=useState(72);
  const [topTags,setTopTags]=useState<any[]>([]);

  const agents=120;
  const uptime="452h";

  // 🧠 ENGINE
  useEffect(()=>{

    const interval=setInterval(()=>{

      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const startTime = new Date("2026-04-05T08:30:00");
      const endTime = new Date("2026-04-05T09:59:00");

      const startValue = 24600;
      const endValue = 25000;

      let currentDetected = startValue;

      if (now <= endTime) {
        const progress = (now.getTime() - startTime.getTime()) /
                         (endTime.getTime() - startTime.getTime());

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
      setReported(Math.floor(currentDetected * 0.92));
      setScrubbed(Math.floor(currentDetected * 0.80));

      // Alerts
      const keyword=keywords[randomInt(0,keywords.length-1)];
      const severity=["LOW","MEDIUM","HIGH","CRITICAL"][randomInt(0,3)];

      setAlerts(prev=>{
        const updated=[
          {
            time:now.toLocaleTimeString(),
            keyword,
            severity,
            source:sources[randomInt(0,sources.length-1)]
          },
          ...prev
        ].slice(0,10);

        updated.sort(
          (a,b)=>
            severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
        );

        const map:any={};
        updated.forEach(a=>{
          map[a.keyword]=(map[a.keyword]||0)+1;
        });

        const tags=Object.entries(map)
          .map(([key,count]:any)=>({key,count}))
          .sort((a,b)=>b.count-a.count)
          .slice(0,4);

        setTopTags(tags);

        return updated;
      });

      // Today stats
      setTodayDetected(t=>t+1);
      setTodayReported(r=>r+1);
      setTodayScrubbed(s=>s+1);

      // Agent load
      setAgentLoad(l=>{
        let change=randomInt(-2,3);
        return Math.max(55,Math.min(95,l+change));
      });

      // Risk
      setRisk(()=>{
        const backlog = currentDetected - scrubbed;
        return Math.min(90, Math.max(40, Math.floor(backlog / 500)));
      });

      // Prediction
      setPrediction(p=>{
        let shift = randomInt(-1,2);
        return Math.max(80,Math.min(98,p+shift));
      });

    },1000);

    return()=>clearInterval(interval);

  },[scrubbed]);

  return(
    <div className="bg-black min-h-screen text-white p-6">

      {!loggedIn ? (

        <div className="flex items-center justify-center h-screen">
          <div className="bg-zinc-900 p-6 rounded-2xl w-80">
            <h2 className="text-lg mb-4">🔐 Secure Access</h2>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 mb-4 bg-black border border-gray-700 rounded"
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              onClick={()=>{
                if(password==="KyrosAura"){
                  setLoggedIn(true);
                } else {
                  alert("Access Denied");
                }
              }}
              className="w-full bg-red-600 py-2 rounded"
            >
              Enter
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Authorized monitoring interface
            </p>
          </div>
        </div>

      ) : (

        <>
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
            <h1 className="text-2xl font-bold">
              ⚔️ WAR ROOM COMMAND CENTER
            </h1>

            <button
              onClick={()=>{
                setLoggedIn(false);
                setPassword("");
              }}
              className="bg-red-700 px-3 py-1 rounded text-sm hover:bg-red-800"
            >
              Logout
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            warroom.jansanjog.com | Internal Access Node | Since Mar 20, 01:30 IST
          </p>

          {/* TOP METRICS */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Total Detected</div>
              <div className="text-3xl">{detected}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Reported</div>
              <div className="text-3xl text-yellow-400">{reported}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Scrubbed</div>
              <div className="text-3xl text-green-400">{scrubbed}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Risk</div>
              <div className="text-3xl text-red-500">{risk}%</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Prediction</div>
              <div className="text-3xl text-orange-400">{prediction}%</div>
            </div>
          </div>

          {/* TODAY */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Today Detected</div>
              <div>{todayDetected}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Today Reported</div>
              <div>{todayReported}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <div className="text-sm text-gray-400">Today Scrubbed</div>
              <div>{todayScrubbed}</div>
            </div>
          </div>

          {/* TOP TAGS */}
          <div className="bg-zinc-900 p-4 rounded-2xl mb-6">
            <h2>Top Narratives</h2>
            <div className="flex gap-3 flex-wrap">
              {topTags.map((t,i)=>(
                <div key={i} className="bg-red-900 px-3 py-1 rounded-full text-sm">
                  {t.key} ({t.count})
                </div>
              ))}
            </div>
          </div>

          {/* LIVE FEED */}
          <div className="bg-zinc-900 p-4 rounded-2xl mb-6">
            <h2>Live Threat Stream</h2>

            {alerts.map((a,i)=>(
              <div key={i}
                className={`flex justify-between text-sm py-2 border-b border-gray-800 ${
                  a.severity==="CRITICAL"?"animate-pulse text-red-500":""
                }`}>
                <span>{a.time}</span>
                <span>{a.keyword}</span>
                <span>{a.source}</span>
                <span>{a.severity}</span>
              </div>
            ))}
          </div>

          {/* AGENTS PANEL */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-zinc-900 p-4 rounded-2xl">
              <h2>Agents</h2>
              <div>{agents}</div>
              <div className="text-sm text-gray-400">{uptime}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <h2>Agent Load</h2>
              <div className="text-yellow-400 text-3xl">{agentLoad}%</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-2xl">
              <h2>Mode</h2>
              <div className="text-red-400">
                {risk>70?"Active Mitigation":"Monitoring"}
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}