'use client';import {useEffect,useState} from 'react';import Image from 'next/image';
import {BOOKS,WAR,subtotal} from '../lib/data';import {FEE,PACK_PRICE,SITE} from '../lib/config';
const fb=(...a)=>{try{window.fbq&&window.fbq(...a)}catch{}};const fmt=n=>n.toLocaleString('en-US');
const norm=p=>p.replace(/\D/g,'').replace(/^213/,'0'),okP=p=>/^0[567]\d{8}$/.test(p);
export default function Shop(){
 const [sel,setSel]=useState(BOOKS.map(b=>b.id)),[type,setType]=useState('home'),[w,setW]=useState(''),[cm,setCm]=useState([]),[f,setF]=useState({name:'',phone:'',commune:'',address:''}),
  [err,setErr]=useState({}),[busy,setBusy]=useState(false),[done,setDone]=useState(null),[started,setStarted]=useState(false);
 const all=sel.length===BOOKS.length,sub=subtotal(sel),fee=FEE[type],tot=sub+fee,saved=all?BOOKS.reduce((s,b)=>s+b.p,0)-PACK_PRICE:0;
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const start=()=>{if(!started){setStarted(true);fb('track','InitiateCheckout',{value:tot,currency:'DZD'})}};
 const toggle=id=>{start();setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])};
 useEffect(()=>{setCm([]);setF(x=>({...x,commune:''}));if(!w)return;fetch('/api/communes?wilaya='+w).then(r=>r.json()).then(setCm).catch(()=>{})},[w]);
 const submit=async e=>{e.preventDefault();const p=norm(f.phone),er={};
  if(f.name.trim().length<3)er.name='اكتب الاسم الكامل';
  if(!okP(p))er.phone='رقم غير صحيح: 10 أرقام تبدأ بـ 05 أو 06 أو 07';
  if(!w||!f.commune.trim())er.loc='اختر الولاية والبلدية';
  if(type==='home'&&f.address.trim().length<4)er.addr='اكتب عنوان التوصيل';
  if(!sel.length)er.items='اختر كتاباً واحداً على الأقل';
  setErr(er);if(Object.keys(er).length)return;setBusy(true);
  try{const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,phone:p,wilaya:+w,type,items:sel})});const j=await r.json();if(!j.ok)throw 0;
   fb('track','Purchase',{value:tot,currency:'DZD',num_items:sel.length});setDone({ref:j.ref,p})}
  catch{setErr({all:'تعذر إرسال الطلب. أعد المحاولة أو اتصل بنا مباشرة.'});setBusy(false)}};
 if(done)return <div className="ok" id="order"><h2>تم استلام طلبك ✓</h2><p>سنتصل بك على <b dir="ltr">{done.p}</b> لتأكيد الطلب. رقم الطلب: <b dir="ltr">{done.ref}</b></p></div>;
 return(<>
 <div className="grid">{BOOKS.map(b=>{const on=sel.includes(b.id);return(
  <button type="button" key={b.id} className={'bk'+(on?' on':'')} style={{'--c':b.c}} onClick={()=>toggle(b.id)} aria-pressed={on}>
   <Image src={`/covers/${b.id}.webp`} alt={`غلاف كتاب ${b.t} BEM 2027`} width={310} height={450} sizes="(max-width:600px) 45vw,200px"/>
   <strong>{b.t}</strong><span>{b.p} دج</span><i className="chk">{on?'✓ مضاف':'+ أضف'}</i></button>)})}</div>
 <form className="form" id="order" onSubmit={submit} noValidate onFocus={start}>
  <h2>أكمل طلبك وادفع عند الاستلام</h2>
  <label htmlFor="n">الاسم الكامل</label><input id="n" autoComplete="name" value={f.name} onChange={set('name')}/><p className="er">{err.name}</p>
  <label htmlFor="p">رقم الهاتف</label><input id="p" dir="ltr" inputMode="tel" autoComplete="tel" maxLength={10} placeholder="07XXXXXXXX" value={f.phone} onChange={set('phone')}
   onBlur={()=>{const p=norm(f.phone);okP(p)&&fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p,name:f.name})}).catch(()=>{})}}/><p className="er">{err.phone}</p>
  <div className="two"><div><label htmlFor="w">الولاية</label><select id="w" value={w} onChange={e=>setW(e.target.value)}><option value="">اختر</option>{WAR.map((n,i)=><option key={i} value={i+1}>{String(i+1).padStart(2,'0')} - {n}</option>)}</select></div>
  <div><label htmlFor="c">البلدية</label>{cm.length?<select id="c" value={f.commune} onChange={set('commune')}><option value="">اختر</option>{cm.map(n=><option key={n}>{n}</option>)}</select>:<input id="c" value={f.commune} onChange={set('commune')} placeholder="اكتب البلدية"/>}</div></div><p className="er">{err.loc}</p>
  <div className="seg" role="radiogroup" aria-label="نوع التوصيل">{[['home','🏠 إلى المنزل',FEE.home],['desk','🏢 مكتب التوصيل',FEE.desk]].map(([v,l,p])=>
   <label key={v} className={type===v?'on':''}><input type="radio" name="t" checked={type===v} onChange={()=>setType(v)}/>{l}<small>{p} دج</small></label>)}</div>
  {type==='home'&&<><label htmlFor="a">العنوان</label><input id="a" autoComplete="street-address" value={f.address} onChange={set('address')}/><p className="er">{err.addr}</p></>}
  <div className="sum" aria-live="polite"><div><span>{sel.length} {sel.length===1?'كتاب':'كتب'}{all&&' (الحزمة الكاملة)'}</span><span>{fmt(sub)} دج</span></div>
   {saved>0&&<div className="save"><span>وفّرت</span><span>{fmt(saved)} دج</span></div>}
   <div><span>التوصيل</span><span>{fee} دج</span></div><div className="t"><span>تدفع عند الاستلام</span><span>{fmt(tot)} دج</span></div></div>
  <p className="er">{err.items||err.all}</p>
  <button className="btn" disabled={busy}>{busy?'جاري الإرسال…':'تأكيد الطلب'}</button>
  <p className="note">لا دفع مسبق. تعاين الطرد أمام الموزع ثم تدفع.</p>
 </form></>)}
