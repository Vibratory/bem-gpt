import {NextResponse as R} from 'next/server';import {communes,desks,fees,rawGet} from '../../../lib/ecotrack';import {authed} from '../../../lib/auth';
export async function GET(req){const q=req.nextUrl.searchParams,t=q.get('type'),w=+q.get('wilaya');
 try{if(t==='raw'){if(!authed(req))return R.json({},{status:401});return R.json(await rawGet(q.get('path'),w))}
  if(!(w>=1&&w<=58))return R.json([],{status:400});
  if(t==='communes')return R.json(await communes(w));if(t==='desks')return R.json(await desks(w));if(t==='fees')return R.json(await fees(w));
  return R.json([],{status:400})}catch(e){return R.json({error:e.message},{status:502})}}
