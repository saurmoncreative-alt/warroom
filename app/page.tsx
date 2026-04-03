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
  "420","ফটুৱা","নিলৰ্জ","বেইমান",
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
  const [prediction,setPrediction]=useState(95);

  const [detected,setDetected]=useState(25000);
  const [reported,setReported]=useState(25000);
  const [scrubbed,setScrubbed]=useState(20000);

  const [todayDetected,setTodayDetected]=useState(1100);
  const [todayReported,setTodayReported]=useState(1100);
  const [todayScrubbed,setTodayScrubbed]=useState(1000);

  const [agentLoad,setAgentLoad]=useState(72);
  const [topTags,setTopTags]=useState<any[]>([]);

  const agents=120;
  const uptime="452h";

  // ENGINE (always runs safely now)
  useEffect(()=>{

    const interval=setInterval(()=>{

      const keyword=keywords[randomInt(0,keywords.length-1)];
      const severity=["LOW","MEDIUM","HIGH","CRITICAL"][randomInt(0,3)];

      setAlerts(prev=>{
        const updated=[
          {
            time:new Date().toLocaleTimeString(),
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

      // totals grow realistically
      setDetected(d=>d+randomInt(5,10));
      setReported(r=>r+randomInt(5,10));
      setScrubbed(s=>s+randomInt(3,7));

      setTodayDetected(t=>t+randomInt(1,4));
      setTodayReported(t=>t+randomInt(1,4));
      setTodayScrubbed(t=>t+randomInt(1,3));

      setAgentLoad(l=>{
        let change=randomInt(-2,4);
        return Math.max(50,Math.min(100,l+change));
      });

    },3000);

    return()=>clearInterval(interval);

  },[]);

  return(
    <div className="bg-black min-h-screen text-white p-6">

      {!loggedIn ? (

        // 🔐 LOGIN SCREEN
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
          {/* HEADER */}
          <h1 className="text-2xl font-bold mb-2 border-b border-gray-800 pb-2">
            ⚔️ WAR ROOM COMMAND CENTER
          </h1>

          <p className="text-xs text-gray-500 mb-4">
            Simulation-based monitoring dashboard. No real user data stored.
          </p>

          {/* TOTAL */}
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

          {/* TAGS */}
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

          {/* ALERTS */}
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

          {/* SYSTEM */}
          <div className="grid grid-cols-3 gap-4">

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