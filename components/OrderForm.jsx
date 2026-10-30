'use client';import {useEffect,useState} from 'react';import {WAR} from '../lib/data';import {PRICE,FEE} from '../lib/config';
const fb=(...a)=>{try{window.fbq&&window.fbq(...a)}catch{}},norm=p=>p.replace(/\D/g,'').replace(/^213/,'0'),okP=p=>/^0[567]\d{8}$/.test(p);
export default function OrderForm(){
 const [type,setType]=useState('home'),[w,setW]=useState(''),[cm,setCm]=useState(null),[ds,setDs]=useState(null),[fe,setFe]=useState(FEE),
  [f,setF]=useState({name:'',phone:'',commune:'',address:'',desk:''}),[er,setEr]=useState({}),[busy,setBusy]=useState(false),[done,setDone]=useState(null),[st,setSt]=useState(false);
 const fee=fe[type],tot=PRICE+fee,set=k=>e=>setF({...f,[k]:e.target.value}),start=()=>{if(!st){setSt(true);fb('track','InitiateCheckout',{value:PRICE,currency:'DZD'})}};
 const g=(t)=>fetch(`/api/geo?type=${t}&wilaya=${w}`).then(r=>r.ok?r.json():Promise.reject());
 useEffect(()=>{setCm(null);setDs(null);setFe(FEE);setF(x=>({...x,commune:'',desk:''}));if(!w)return;g('communes').then(setCm).catch(()=>setCm([]));g('fees').then(setFe).catch(()=>{})},[w]);
 useEffect(()=>{if(type==='desk'&&w&&ds===null)g('desks').then(setDs).catch(()=>setDs([]))},[type,w,ds]);
 const near=ds?(ds.some(d=>d.commune&&d.commune===f.commune)?ds.filter(d=>d.commune===f.commune):ds):[];
 const submit=async e=>{e.preventDefault();const p=norm(f.phone),x={};
  if(f.name.trim().length<3)x.name='اكتب الاسم الكامل';if(!okP(p))x.phone='رقم غير صحيح: 10 أرقام تبدأ بـ 05 أو 06 أو 07';
  if(!w||!f.commune.trim())x.loc='اختر الولاية والبلدية';if(type==='home'&&f.address.trim().length<4)x.addr='اكتب عنوان التوصيل';if(type==='desk'&&!f.desk)x.desk='اختر مكتب التوصيل';
  setEr(x);if(Object.keys(x).length)return;setBusy(true);const d=near.find(d=>String(d.code)===f.desk);
  try{const r=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,phone:p,wilaya:+w,type,deskCode:f.desk,deskName:d?.name})}),j=await r.json();if(!j.ok)throw 0;
   fb('track','Purchase',{value:tot,currency:'DZD'});setDone({ref:j.ref,p})}catch{setEr({all:'تعذر إرسال الطلب. أعد المحاولة أو اتصل بنا.'});setBusy(false)}};
 if(done)return <div className="form ok" id="order"><h2>تم استلام طلبك ✓</h2><p>سنتصل بك على <b dir="ltr">{done.p}</b> لتأكيد الطلب. المرجع: <b dir="ltr">{done.ref}</b></p></div>;
 return(<form className="form" id="order" onSubmit={submit} noValidate onFocus={start}>
  <h2>اطلب الآن · الدفع عند الاستلام</h2><p className="pk">حزمة BEM 2027 الكاملة (10 كتب) <b>{PRICE} دج</b></p>
  <label htmlFor="n">الاسم الكامل</label><input id="n" autoComplete="name" value={f.name} onChange={set('name')}/><p className="er">{er.name}</p>
  <label htmlFor="p">رقم الهاتف</label><input id="p" dir="ltr" inputMode="tel" autoComplete="tel" maxLength={10} placeholder="07XXXXXXXX" value={f.phone} onChange={set('phone')}
   onBlur={()=>{const p=norm(f.phone);okP(p)&&fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p,name:f.name})}).catch(()=>{})}}/><p className="er">{er.phone}</p>
  <div className="two"><div><label htmlFor="w">الولاية</label><select id="w" value={w} onChange={e=>setW(e.target.value)}><option value="">اختر</option>{WAR.map((n,i)=><option key={i} value={i+1}>{String(i+1).padStart(2,'0')} - {n}</option>)}</select></div>
  <div><label htmlFor="c">البلدية</label>{cm&&cm.length?<select id="c" value={f.commune} onChange={set('commune')}><option value="">اختر</option>{cm.map(n=><option key={n}>{n}</option>)}</select>:<input id="c" value={f.commune} onChange={set('commune')} placeholder={w&&cm===null?'جاري التحميل…':'اكتب البلدية'} disabled={!w}/>}</div></div><p className="er">{er.loc}</p>
  <div className="seg" role="radiogroup" aria-label="نوع التوصيل">{[['home','🏠 إلى المنزل'],['desk','🏢 إلى مكتب (Bureau)']].map(([v,l])=>
   <label key={v} className={type===v?'on':''}><input type="radio" name="t" checked={type===v} onChange={()=>setType(v)}/>{l}<small>{w?fe[v]+' دج':'—'}</small></label>)}</div>
  {type==='home'?<><label htmlFor="a">العنوان</label><input id="a" autoComplete="street-address" value={f.address} onChange={set('address')}/><p className="er">{er.addr}</p></>
  :<><label htmlFor="d">اختر المكتب</label><select id="d" value={f.desk} onChange={set('desk')} disabled={!w||!f.commune}><option value="">{!w||!f.commune?'اختر الولاية والبلدية أولاً':ds===null?'جاري التحميل…':near.length?'اختر المكتب':'لا توجد مكاتب، اختر التوصيل للمنزل'}</option>{near.map(d=><option key={d.code} value={d.code}>{d.name}{d.address?' — '+d.address:''}</option>)}</select><p className="er">{er.desk}</p></>}
  <div className="sum" aria-live="polite"><div><span>الحزمة (10 كتب)</span><span>{PRICE} دج</span></div><div><span>التوصيل</span><span>{w?fee+' دج':'يُحسب بعد اختيار الولاية'}</span></div><div className="t"><span>تدفع عند الاستلام</span><span>{w?tot:PRICE} دج</span></div></div>
  <p className="er">{er.all}</p><button className="btn" disabled={busy}>{busy?'جاري الإرسال…':'تأكيد الطلب'}</button><p className="note">لا دفع مسبق. تعاين الطرد أمام الموزع ثم تدفع.</p></form>)}
