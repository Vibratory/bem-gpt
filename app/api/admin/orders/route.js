import {NextResponse as R} from 'next/server';import {col} from '../../../../lib/mongo';import {authed} from '../../../../lib/auth';import {push} from '../../../../lib/ecotrack';
const ST=['new','called','confirmed','noanswer','shipped','delivered','returned','cancelled','duplicate'];
const no=()=>R.json({},{status:401});
export async function GET(req){if(!authed(req))return no();const q=req.nextUrl.searchParams;
 if(q.get('view')==='leads')return R.json({leads:await (await col('leads')).find().sort({createdAt:-1}).limit(200).toArray()});
 const f={},s=q.get('status'),t=(q.get('q')||'').trim();if(s)f.status=s;
 if(t){const d=t.replace(/\D/g,'');f.$or=[...(d?[{phone:{$regex:d}}]:[]),{name:{$regex:t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}},{ref:t.toUpperCase()}]}
 const o=await col('orders');const orders=await o.find(f).sort({createdAt:-1}).limit(300).toArray();
 const counts=Object.fromEntries((await o.aggregate([{$group:{_id:'$status',n:{$sum:1}}}]).toArray()).map(x=>[x._id,x.n]));
 const pc=Object.fromEntries((await o.aggregate([{$group:{_id:'$phone',n:{$sum:1}}}]).toArray()).map(x=>[x._id,x.n]));
 return R.json({orders:orders.map(x=>({...x,_id:undefined,phoneCount:pc[x.phone]||1})),counts})}
export async function PATCH(req){if(!authed(req))return no();const {ref,status,note}=await req.json(),$set={},u={};
 if(status){if(!ST.includes(status))return R.json({ok:false},{status:400});$set.status=status;u.$push={history:{status,at:new Date()}}}
 if(typeof note==='string')$set.note=note.slice(0,500);
 await (await col('orders')).updateOne({ref},{$set,...u});return R.json({ok:true})}
export async function POST(req){if(!authed(req))return no();const {ref}=await req.json(),c=await col('orders'),o=await c.findOne({ref});if(!o)return R.json({ok:false},{status:404});
 try{const t=await push(o);await c.updateOne({ref},{$set:{status:'shipped',tracking:t},$push:{history:{status:'shipped',at:new Date()}}});return R.json({ok:true,tracking:t})}
 catch(e){return R.json({ok:false,error:e.message,details:e.data||null},{status:502})}}
