import {NextResponse as R} from 'next/server';import {db,save,clean,tg} from '../../../lib/server';
export async function POST(req){const b=await req.json().catch(()=>({}));const phone=String(b.phone||'').replace(/\D/g,'');
 if(/^0[567]\d{8}$/.test(phone)){const d=db();if(!d[phone]){d[phone]={phone,name:clean(b.name),orders:[{ref:'LEAD',at:Date.now(),status:'lead'}]};save(d);
 await tg(`👀 <b>زبون لم يكمل الطلب</b>\n📞 ${phone}\n👤 ${clean(b.name)||'-'}`)}}
 return R.json({ok:true})}
