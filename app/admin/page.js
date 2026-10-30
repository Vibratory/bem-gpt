'use client';import {useCallback,useEffect,useState} from 'react';import {SITE} from '../../lib/config';
const ST={new:'جديد',called:'تم الاتصال',confirmed:'مؤكد',noanswer:'لا يرد',shipped:'تم الشحن',delivered:'تم التسليم',returned:'مرتجع',cancelled:'ملغي',duplicate:'مكرر'};
const wa=(o,t)=>`https://wa.me/213${o.phone.slice(1)}?text=${encodeURIComponent(t)}`;
const msg=o=>`السلام عليكم ${o.name}، معكم ${SITE.name}. بخصوص طلبكم لحزمة كتب BEM 2027 (${o.ref}) بقيمة ${o.total} دج. هل نؤكد الطلب؟`;
export default function Admin(){
 const [ok,setOk]=useState(null),[pw,setPw]=useState(''),[tab,setTab]=useState('orders'),[st,setSt]=useState(''),[q,setQ]=useState(''),[d,setD]=useState({orders:[],counts:{}}),[leads,setLeads]=useState([]),[m,setM]=useState('');
 const load=useCallback(async()=>{const r=await fetch(tab==='leads'?'/api/admin/orders?view=leads':`/api/admin/orders?status=${st}&q=${encodeURIComponent(q)}`);
  if(r.status===401)return setOk(false);setOk(true);const j=await r.json();tab==='leads'?setLeads(j.leads):setD(j)},[tab,st,q]);
 useEffect(()=>{load()},[load]);
 const login=async e=>{e.preventDefault();const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});r.ok?load():setM('كلمة السر غير صحيحة')};
 const patch=async(ref,b)=>{await fetch('/api/admin/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref,...b})});load()};
 const ship=async ref=>{if(!confirm('إرسال الطلب إلى Ecotrack؟'))return;const r=await fetch('/api/admin/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref})});const j=await r.json();setM(j.ok?'تم الإرسال. التتبع: '+j.tracking:'فشل الإرسال: '+(j.error||'')+' '+JSON.stringify(j.details||''));load()};
 if(ok===null)return <p className="ad">…</p>;
 if(!ok)return <form className="ad login" onSubmit={login}><h1>دخول الإدارة</h1><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="كلمة السر" autoFocus/><button className="btn">دخول</button><p>{m}</p></form>;
 const groups=Object.values(d.orders.reduce((a,o)=>((a[o.phone]??={phone:o.phone,list:[]}).list.push(o),a),{}));
 return(<div className="ad"><h1>الطلبات</h1>
  <div className="tabs"><button onClick={()=>setTab('orders')} className={tab==='orders'?'on':''}>الطلبات</button><button onClick={()=>setTab('leads')} className={tab==='leads'?'on':''}>لم يكملوا الطلب</button></div>
  {m&&<p className="am" onClick={()=>setM('')}>{m}</p>}
  {tab==='leads'?leads.map(l=><div className="oc" key={l.phone}><b dir="ltr">{l.phone}</b> {l.name} <a className="wb" target="_blank" href={`https://wa.me/213${l.phone.slice(1)}?text=${encodeURIComponent('السلام عليكم، لاحظنا أنكم لم تكملوا طلب كتب BEM 2027. هل تحتاجون مساعدة؟')}`}>واتساب</a> <a href={`tel:${l.phone}`}>اتصال</a></div>):<>
  <div className="chips">{['',...Object.keys(ST)].map(k=><button key={k} className={st===k?'on':''} onClick={()=>setSt(k)}>{k?ST[k]:'الكل'} {k&&d.counts[k]?`(${d.counts[k]})`:''}</button>)}</div>
  <input className="sr" placeholder="بحث بالهاتف أو الاسم أو الرقم المرجعي" value={q} onChange={e=>setQ(e.target.value)}/>
  {groups.map(g=><div className="pg2" key={g.phone}><div className="ph"><b dir="ltr">{g.phone}</b><span>{g.list[0].name}</span>{g.list[0].phoneCount>1&&<em>{g.list[0].phoneCount} طلبات</em>}</div>
   {g.list.map(o=><div className={'oc s-'+o.status} key={o.ref}>
    <div><b dir="ltr">{o.ref}</b> · {new Date(o.createdAt).toLocaleString('ar-DZ')} · <b>{o.total} دج</b></div>
    <div>{o.wilayaName} — {o.commune} · {o.type==='desk'?`مكتب: ${o.desk?.name}`:`المنزل: ${o.address}`}</div>
    {o.tracking&&<div>التتبع: <b dir="ltr">{o.tracking}</b></div>}
    <div className="ac"><select value={o.status} onChange={e=>patch(o.ref,{status:e.target.value})}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
     <a className="wb" target="_blank" href={wa(o,msg(o))} onClick={()=>o.status==='new'&&patch(o.ref,{status:'called'})}>واتساب</a><a href={`tel:${o.phone}`}>اتصال</a>
     {!o.tracking&&!['cancelled','duplicate'].includes(o.status)&&<button onClick={()=>ship(o.ref)}>إرسال إلى Ecotrack</button>}</div>
    <input defaultValue={o.note} placeholder="ملاحظة…" onBlur={e=>e.target.value!==o.note&&patch(o.ref,{note:e.target.value})}/></div>)}</div>)}
  {!groups.length&&<p>لا توجد طلبات.</p>}</>}</div>)}
