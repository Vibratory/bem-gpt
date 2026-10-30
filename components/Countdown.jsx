'use client';import {useEffect,useState} from 'react';import {SITE} from '../lib/config';
export default function Countdown(){const [d,setD]=useState(null);
 useEffect(()=>{const f=()=>setD(Math.max(0,Math.ceil((new Date(SITE.examDate)-Date.now())/864e5)));f();const t=setInterval(f,36e5);return()=>clearInterval(t)},[]);
 return <p className="cd">{d===null?'\u00a0':d>0?<>باقي حوالي <b>{d}</b> يوماً على الامتحان — كل يوم مراجعة مهم</>:'حظاً موفقاً لكل المترشحين'}</p>}
