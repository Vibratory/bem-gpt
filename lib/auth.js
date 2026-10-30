import crypto from 'crypto';
const H=s=>crypto.createHash('sha256').update(String(s)).digest();
const tok=()=>crypto.createHmac('sha256',process.env.ADMIN_SECRET||'').update(process.env.ADMIN_PASSWORD||'').digest('hex');
export const passOk=p=>!!process.env.ADMIN_PASSWORD&&crypto.timingSafeEqual(H(p),H(process.env.ADMIN_PASSWORD));
export const makeToken=tok;
export const authed=req=>{const t=req.cookies.get('adm')?.value||'';return !!process.env.ADMIN_PASSWORD&&!!process.env.ADMIN_SECRET&&t.length===tok().length&&crypto.timingSafeEqual(Buffer.from(t),Buffer.from(tok()))};
