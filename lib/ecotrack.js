// Ecotrack API v1 — Bearer token، النطاق خاص بكل شركة (مثال: anderson.ecotrack.dz)
import {FEE} from './config';
const base=()=>(process.env.ECOTRACK_BASE_URL||'').replace(/\/$/,''),cache=new Map();
async function call(path,{method='GET',params={},body,ttl=0}={}){
 if(!base()||!process.env.ECOTRACK_TOKEN)throw new Error('ecotrack_not_configured');
 const u=new URL(base()+'/api/v1'+path);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
 const key=method+u;const c=cache.get(key);if(ttl&&c&&c.exp>Date.now())return c.v;
 const r=await fetch(u,{method,headers:{Authorization:'Bearer '+process.env.ECOTRACK_TOKEN,Accept:'application/json','Content-Type':'application/json'},body:body&&JSON.stringify(body),cache:'no-store'});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error('ecotrack_'+r.status),{data:j});
 if(ttl)cache.set(key,{v:j,exp:Date.now()+ttl});return j}
// ⚠️ أسماء الحقول في الردود لم أتحقق منها: عدّل المرادفات هنا بعد رؤية /api/geo?type=raw (للمدير)
const arr=x=>Array.isArray(x)?x:x&&typeof x==='object'?(Object.values(x).find(Array.isArray)||(x.data&&arr(x.data))||Object.values(x)):[];
const pick=(o,ks)=>{for(const k of ks)if(o&&o[k]!=null&&o[k]!=='')return o[k]};
const inW=(o,w)=>{const v=pick(o,['wilaya_id','code_wilaya','id_wilaya']);return v==null||+v===w};
const H=3.6e6;
export const rawGet=(p,w)=>call('/get/'+String(p).replace(/[^a-z]/g,''),{params:w?{wilaya_id:w}:{}});
export async function communes(w){const l=arr(await call('/get/communes',{params:{wilaya_id:w},ttl:H}));
 return [...new Set(l.filter(o=>inW(o,w)).map(o=>pick(o,['nom','name','commune_name','commune'])).filter(Boolean))].sort()}
export async function desks(w){const l=arr(await call('/get/desks',{params:{wilaya_id:w},ttl:H}));
 return l.filter(o=>inW(o,w)).map(o=>({code:pick(o,['code','station_code','id']),name:pick(o,['name','nom','station_name']),address:pick(o,['address','adresse'])||'',commune:pick(o,['commune','commune_name','nom_commune'])||''})).filter(d=>d.code&&d.name)}
export async function fees(w){try{const l=arr(await call('/get/fees',{ttl:H})),r=l.find(o=>+pick(o,['wilaya_id','code_wilaya','id'])===w);
 const h=+pick(r,['tarif','home','price_home','domicile']),d=+pick(r,['tarif_stopdesk','stopdesk','desk','price_desk']);
 if(h>0)return{home:h,desk:d>0?d:FEE.desk,live:true}}catch{}return{...FEE,live:false}}
export async function push(o){
 const r=await call('/create/order',{method:'POST',body:{reference:o.ref,nom_client:o.name,telephone:o.phone,adresse:o.address||o.desk?.name||o.commune,commune:o.commune,
  code_wilaya:o.wilaya,montant:o.total,remarque:'',produit:'حزمة BEM 2027 (10 كتب)',type:1,stop_desk:o.type==='desk'?1:0,...(o.type==='desk'&&o.desk?.code?{station_code:o.desk.code}:{})}});
 const t=r.tracking||r.tracking_number||r.data?.tracking;if(r.success===false||(!t&&r.errors))throw Object.assign(new Error('rejected'),{data:r});return t||''}
