import {NextResponse as R} from 'next/server';import {passOk,makeToken} from '../../../../lib/auth';
export async function POST(req){const {password}=await req.json().catch(()=>({}));
 if(!passOk(password||''))return R.json({ok:false},{status:401});
 const r=R.json({ok:true});r.cookies.set('adm',makeToken(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:6048e2});return r}
