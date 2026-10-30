import {NextResponse as R} from 'next/server';import {col} from '../../../lib/mongo';import {clean,tg} from '../../../lib/server';
import {FR} from '../../../lib/data';import {fees,push} from '../../../lib/ecotrack';import {PRICE,FEE} from '../../../lib/config';
const hits=new Map();
export async function POST(req){
 const ip=req.headers.get('x-forwarded-for')||'x',n=(hits.get(ip)||0)+1;hits.set(ip,n);setTimeout(()=>hits.set(ip,(hits.get(ip)||1)-1),6e4);
 if(n>5)return R.json({ok:false},{status:429});
 const b=await req.json().catch(()=>({})),phone=String(b.phone||'').replace(/\D/g,''),w=+b.wilaya,type=b.type==='desk'?'desk':'home';
 if(!/^0[567]\d{8}$/.test(phone)||clean(b.name).length<3||!(w>=1&&w<=58)||!clean(b.commune)||(type==='home'&&clean(b.address).length<4)||(type==='desk'&&!b.deskCode))
  return R.json({ok:false,error:'بيانات ناقصة'},{status:400});
 const fe=await fees(w).catch(()=>FEE),fee=fe[type],orders=await col('orders');
 const dup=await orders.findOne({phone,status:{$ne:'lead'},createdAt:{$gt:new Date(Date.now()-864e5)}});
 const o={ref:'BEM'+Date.now().toString(36).toUpperCase(),phone,name:clean(b.name),wilaya:w,wilayaName:FR[w-1],commune:clean(b.commune),type,
  desk:type==='desk'?{code:clean(b.deskCode),name:clean(b.deskName)}:null,address:clean(b.address),fee,total:PRICE+fee,status:dup?'duplicate':'new',note:'',tracking:'',createdAt:new Date(),history:[]};
 await orders.insertOne(o);(await col('leads')).deleteOne({phone}).catch(()=>{});
 let ship='';if(!dup&&process.env.AUTO_PUSH==='1'){try{const t=await push(o);await orders.updateOne({ref:o.ref},{$set:{status:'shipped',tracking:t}});ship='📦 أُرسل إلى Ecotrack '+t}catch{ship='❌ فشل الإرسال إلى Ecotrack'}}
 const cnt=await orders.countDocuments({phone});
 await tg(`${dup?'⚠️ <b>طلب مكرر</b> (24 ساعة)':'🛒 <b>طلب جديد</b>'}\n🔖 ${o.ref}\n👤 ${o.name}\n📞 ${phone} (طلبات الرقم: ${cnt})\n📍 ${o.wilayaName} - ${o.commune}\n🚚 ${type==='desk'?'مكتب: '+o.desk.name:'المنزل: '+o.address}\n💰 ${o.total} دج\n${ship}`);
 return R.json({ok:true,ref:o.ref})}
