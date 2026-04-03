"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

// TYPES
type Alert = {
  time: string;
  keyword: string;
  severity: string;
  source: string;
};

// DATA
const keywords = [
  "পাগল","দালাল","চুমা বাবা","গৰু","ঠগবাজ",
  "420","ফটুৱা","নিলৰ্জ","বেইমান",
  "কুকুৰ","ছাগলী","গাধা","চেলেকা",
  "মক্কেল","ভণ্ড","মিঞা দালাল"
];

const locations = ["Sivasagar","Dibrugarh","Jorhat","Tinsukia","Golaghat","Majuli"];
const sources = ["FB Live","FB Page","FB Group","FB Reel"];

function randomInt(min:number,max:number){
  return Math.floor(Math.random()*(max-min+1))+min;
}

export default function Page(){

  const [alerts,setAlerts]=useState<Alert[]>([]);
  const [trend,setTrend]=useState<any[]>([]);
  const [timeline,setTimeline]=useState<any[]>([]);
  const [geo,setGeo]=useState<any[]>([]);

  const [risk,setRisk]=useState(52);
  const [prediction,setPrediction]=useState(60);

  const [detected,setDetected]=useState(820);
  const [reported,setReported]=useState(760);
  const [scrubbed,setScrubbed]=useState(705);

  const [uptime,setUptime]=useState("");
  const [agentLoad,setAgentLoad]=useState(65);

  const agents=120;

  // UPTIME
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

  // ENGINE
  useEffect(()=>{

    setTrend(Array.from({length:25},(_,i)=>({
      time:i,value:randomInt(10,20)
    })));

    setTimeline(Array.from({length:10},(_,i)=>({
      t:`T-${10-i}`,value:randomInt(20,60)
    })));

    setGeo(locations.map(l=>({
      name:l,value:randomInt(20,80)
    })));

    const interval=setInterval(()=>{

      const keyword=keywords[randomInt(0,keywords.length-1)];
      const severity=["LOW","MEDIUM","HIGH","CRITICAL"][randomInt(0,3)];

      // ALERTS
      setAlerts(prev=>[
        {
          time:new Date().toLocaleTimeString(),
          keyword,
          severity,
          source:sources[randomInt(0,sources.length-1)]
        },
        ...prev.slice(0,6)
      ]);

      // TREND
      setTrend(prev=>[
        ...prev.slice(1),
        {time:prev.length,value:randomInt(12,25)}
      ]);

      // TIMELINE
      setTimeline(prev=>[
        ...prev.slice(1),
        {t:new Date().toLocaleTimeString(),value:randomInt(30,80)}
      ]);

      // GEO
      setGeo(prev=>prev.map(g=>({
        ...g,
        value:Math.max(10,Math.min(100,g.value+randomInt(-5,8)))
      })));

      // RISK
      setRisk(r=>{
        let change=randomInt(-3,6);
        if(r>70) change-=randomInt(4,8);
        return Math.max(30,Math.min(95,r+change));
      });

      // 🔮 PREDICTION ENGINE
      setPrediction(p=>{
        let drift=randomInt(-2,4);
        if(risk>65) drift+=randomInt(3,6);
        return Math.max(35,Math.min(95,p+drift));
      });

      // 📊 DAILY OPS (~1000 realistic)
      setDetected(d=>Math.min(1200,d+randomInt(5,12)));
      setReported(r=>Math.min(1100,r+randomInt(4,10)));
      setScrubbed(s=>Math.min(1000,s+randomInt(3,8)));

      // LOAD
      setAgentLoad(l=>{
        let change=randomInt(-4,5);
        if(risk>65) change+=randomInt(3,7);
        return Math.max(40,Math.min(100,l+change));
      });

    },2500);

    return()=>clearInterval(interval);

  },[risk]);

  return(
    <div className="bg-black min-h-screen text-white p-6">

      <h1 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">
        ⚔️ WAR ROOM COMMAND CENTER
      </h1>

      {/* ALERT + TREND */}
      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2 bg-zinc-900 p-4 rounded-2xl">
          <h2>Live Alerts</h2>
          {alerts.map((a,i)=>(
            <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-800">
              <span>{a.time}</span>
              <span>{a.keyword}</span>
              <span>{a.source}</span>
              <span className="text-red-400">{a.severity}</span>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend}>
              <XAxis dataKey="time" hide/>
              <YAxis hide/>
              <Tooltip/>
              <Line dataKey="value" stroke="#ef4444"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* GEO + TIMELINE */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Geo Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={geo}>
              <XAxis dataKey="name"/>
              <YAxis hide/>
              <Tooltip/>
              <Bar dataKey="value" fill="#ef4444"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Timeline</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeline}>
              <XAxis dataKey="t" hide/>
              <YAxis hide/>
              <Tooltip/>
              <Line dataKey="value" stroke="#f97316"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SYSTEM */}
      <div className="grid grid-cols-5 gap-4 mt-6">

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Risk</h2>
          <div className="text-4xl text-red-500">{risk}%</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Prediction</h2>
          <div className="text-4xl text-orange-400">{prediction}%</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Detected</h2>
          <div>{detected}</div>
          <div className="text-xs text-gray-400">today</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Reported</h2>
          <div>{reported}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl">
          <h2>Scrubbed</h2>
          <div>{scrubbed}</div>
        </div>

      </div>

      {/* OPS */}
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

    </div>
  );
}