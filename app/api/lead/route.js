import {NextResponse as R} from 'next/server';import {col} from '../../../lib/mongo';import {clean,tg} from '../../../lib/server';
export async function POST(req){const b=await req.json().catch(()=>({})),phone=String(b.phone||'').replace(/\D/g,'');
 if(/^0[567]\d{8}$/.test(phone)){const l=await col('leads'),r=await l.updateOne({phone},{$setOnInsert:{phone,createdAt:new Date()},$set:{name:clean(b.name)}},{upsert:true});
  if(r.upsertedCount&&!(await (await col('orders')).findOne({phone})))await tg(`👀 <b>زبون لم يكمل الطلب</b>\n📞 ${phone}\n👤 ${clean(b.name)||'-'}`)}
 return R.json({ok:true})}
