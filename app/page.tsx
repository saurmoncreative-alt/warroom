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

  const [alerts,setAlerts]=useState<Alert[]>([]);
  const [risk,setRisk]=useState(52);
  const [prediction,setPrediction]=useState(60);

  const [detected,setDetected]=useState(20120);
  const [reported,setReported]=useState(18240);
  const [scrubbed,setScrubbed]=useState(16980);

  const [agentLoad,setAgentLoad]=useState(65);
  const [uptime,setUptime]=useState("");

  const [topTags,setTopTags]=useState<{key:string,count:number}[]>([]);

  const agents=120;

  // ⏱ UPTIME
  useEffect(()=>{
    const start=new Date("2026-04-20T01:30:00");

    const update=()=>{
      const now=new Date();
      const diff=now.getTime()-start.getTime();
      const h=Math.floor(diff/(1000*60*60));
      const m=Math.floor((diff/(1000*60))%60);
      setUptime(`${h}h ${m}m`);
    };

    update();
    const i=setInterval(update,60000);
    return()=>clearInterval(i);
  },[]);

  // ⚙️ ENGINE
  useEffect(()=>{

    const interval=setInterval(()=>{

      const keyword=keywords[randomInt(0,keywords.length-1)];
      const severity=["LOW","MEDIUM","HIGH","CRITICAL"][randomInt(0,3)];

      // ALERTS
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

        // 🧠 SORT BY SEVERITY
        updated.sort(
  (a, b) =>
    severityOrder[b.severity as keyof typeof severityOrder] -
    severityOrder[a.severity as keyof typeof severityOrder]
);

        // 🏷 TAG AGGREGATION
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

      // RISK
      setRisk(r=>{
        let change=randomInt(-2,5);
        if(r>70) change-=randomInt(3,7);
        return Math.max(30,Math.min(95,r+change));
      });

      // PREDICTION
      setPrediction(p=>{
        let drift=randomInt(-2,4);
        if(risk>65) drift+=randomInt(3,6);
        return Math.max(40,Math.min(95,p+drift));
      });

      // TOTALS
      setDetected(d=>d+randomInt(6,12));
      setReported(r=>r+randomInt(5,10));
      setScrubbed(s=>s+randomInt(4,8));

      // LOAD
      setAgentLoad(l=>{
        let change=randomInt(-3,5);
        if(risk>65) change+=randomInt(3,6);
        return Math.max(40,Math.min(100,l+change));
      });

    },2800); // slightly slower = realistic

    return()=>clearInterval(interval);

  },[risk]);

  return(
    <div className="bg-black min-h-screen text-white p-6">

      <h1 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">
        ⚔️ WAR ROOM COMMAND CENTER
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-5 gap-4 mb-6">

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <div className="text-sm text-gray-400">Total Detected</div>
          <div className="text-3xl font-bold">{detected}</div>
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

      {/* TAGS */}
      <div className="bg-zinc-900 p-4 rounded-2xl mb-6">
        <h2 className="mb-2">Top Narratives</h2>
        <div className="flex gap-3 flex-wrap">
          {topTags.map((t,i)=>(
            <div key={i} className="bg-red-900 px-3 py-1 rounded-full text-sm">
              {t.key} ({t.count})
            </div>
          ))}
        </div>
      </div>

      {/* ALERT STREAM */}
      <div className="bg-zinc-900 p-4 rounded-2xl mb-6">

        <h2 className="mb-3">Live Threat Stream</h2>

        {alerts.map((a,i)=>(
          <div
            key={i}
            className={`flex justify-between text-sm py-2 border-b border-gray-800 ${
              a.severity==="CRITICAL" ? "animate-pulse text-red-500 font-semibold" : ""
            }`}
          >
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

    </div>
  );
}