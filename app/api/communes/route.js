import {NextResponse as R} from 'next/server';
const cache={};
export async function GET(req){const w=+req.nextUrl.searchParams.get('wilaya');if(!(w>=1&&w<=58))return R.json([],{status:400});
 try{if(!cache[w]){const r=await fetch(`https://api.yalidine.app/v1/communes/?wilaya_id=${w}&page_size=500`,{headers:{'X-API-ID':process.env.YALIDINE_ID||'','X-API-TOKEN':process.env.YALIDINE_TOKEN||''}});
 const j=await r.json();cache[w]=j.data.map(c=>c.name).sort()}return R.json(cache[w])}catch{return R.json([],{status:502})}}
