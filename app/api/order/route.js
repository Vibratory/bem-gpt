import {NextResponse as R} from 'next/server';
import {db,save,clean,tg,carriers,names} from '../../../lib/server';
import {BOOKS,FR,total} from '../../../lib/data';
const hits=new Map();
export async function POST(req){
 const ip=req.headers.get('x-forwarded-for')||'x';const n=(hits.get(ip)||0)+1;hits.set(ip,n);setTimeout(()=>hits.set(ip,(hits.get(ip)||1)-1),6e4);
 if(n>5)return R.json({ok:false,error:'محاولات كثيرة'},{status:429});
 const b=await req.json().catch(()=>({}));
 const phone=String(b.phone||'').replace(/\D/g,''),ids=(b.items||[]).filter(i=>BOOKS.some(x=>x.id===i));
 const w=+b.wilaya,type=b.type==='desk'?'desk':'home';
 if(!/^0[567]\d{8}$/.test(phone)||clean(b.name).length<3||!(w>=1&&w<=58)||!b.commune||!ids.length||(type==='home'&&clean(b.address).length<4))
  return R.json({ok:false,error:'بيانات ناقصة'},{status:400});
 const d=db(),rec=d[phone]||(d[phone]={phone,orders:[]});
 const dup=rec.orders.some(x=>x.status!=='lead'&&Date.now()-x.at<864e5);
 const o={ref:'BEM'+Date.now().toString(36).toUpperCase(),at:Date.now(),name:clean(b.name),phone,wilaya:w,commune:clean(b.commune),type,address:clean(b.address),
  items:ids,products:names(ids),count:ids.length,total:total(ids,type),status:dup?'duplicate':'new'};
 rec.name=o.name;rec.orders=rec.orders.filter(x=>x.ref!=='LEAD');rec.orders.push(o);
 let ship='';const c=process.env.AUTO_CARRIER;
 if(!dup&&c&&carriers[c]){try{const r=await carriers[c](o);o.status=r.ok?'shipped':'ship_failed';ship=r.ok?`📦 أُرسل إلى ${c}`:`❌ فشل ${c} (${r.status})`}catch{o.status='ship_failed';ship='❌ خطأ شركة التوصيل'}}
 save(d);
 await tg(`${dup?'⚠️ <b>طلب مكرر</b> (نفس الرقم خلال 24 ساعة)':'🛒 <b>طلب جديد</b>'}\n🔖 ${o.ref}\n👤 ${o.name}\n📞 ${phone} (طلبات الرقم: ${rec.orders.length})\n📍 ${FR[w-1]} - ${o.commune}\n🚚 ${type==='desk'?'مكتب التوصيل':'المنزل'}${o.address?' | '+o.address:''}\n📚 ${o.products}\n💰 ${o.total} دج\n${ship}`);
 return R.json({ok:true,ref:o.ref});
}
export async function GET(req){
 const k=process.env.ADMIN_KEY;return k&&req.nextUrl.searchParams.get('key')===k?R.json(db()):R.json({},{status:401})}
