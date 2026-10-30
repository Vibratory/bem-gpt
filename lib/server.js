import fs from 'fs';import path from 'path';import {FR,BOOKS} from './data';
const E=process.env,DB=path.join(process.cwd(),'data','orders.json');
export const db=()=>{try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return{}}};
export const save=d=>{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(d,null,1))};
export const clean=s=>String(s??'').replace(/[<>&]/g,'').slice(0,200);
const post=async(url,headers,body)=>{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});return{ok:r.ok,status:r.status}};
export const tg=text=>E.TG_TOKEN?post(`https://api.telegram.org/bot${E.TG_TOKEN}/sendMessage`,{},{chat_id:E.TG_CHAT_ID,text,parse_mode:'HTML'}).catch(()=>{}):null;
export const names=ids=>BOOKS.filter(b=>ids.includes(b.id)).map(b=>b.t).join('، ');
// راجع وثائق كل شركة وجرّب بطلب تجريبي قبل الإطلاق
export const carriers={
 yalidine:(o,base='https://api.yalidine.app/v1',id=E.YALIDINE_ID,tok=E.YALIDINE_TOKEN)=>{const [f,...r]=o.name.split(' ');
  return post(base+'/parcels/',{'X-API-ID':id,'X-API-TOKEN':tok},[{order_id:o.ref,from_wilaya_name:E.FROM_WILAYA||'Sétif',firstname:f,familyname:r.join(' ')||f,
  contact_phone:o.phone,address:o.address||'مكتب التوصيل',to_commune_name:o.commune,to_wilaya_name:FR[o.wilaya-1],product_list:o.products,price:o.total,
  do_insurance:false,declared_value:o.total,length:30,width:21,height:2*o.count,weight:0.4*o.count,freeshipping:false,is_stopdesk:o.type==='desk',has_exchange:false}])},
 guepex:o=>carriers.yalidine(o,E.GUEPEX_BASE||'https://api.guepex.app/v1',E.GUEPEX_ID,E.GUEPEX_TOKEN),
 ecotrack:o=>post(`https://${E.ECOTRACK_DOMAIN||'app.ecotrack.dz'}/api/v1/create/order`,{Authorization:'Bearer '+E.ECOTRACK_TOKEN},
  {reference:o.ref,nom_client:o.name,telephone:o.phone,adresse:o.address||o.commune,commune:o.commune,code_wilaya:o.wilaya,montant:o.total,remarque:'',produit:o.products,type:1,stop_desk:o.type==='desk'?1:0}),
 zr:o=>post('https://procolis.com/api_v1/add_colis',{token:E.ZR_TOKEN,key:E.ZR_KEY},{Colis:[{Tracking:o.ref,TypeLivraison:o.type==='desk'?'1':'0',TypeColis:'0',Confrimee:'',
  Client:o.name,MobileA:o.phone,MobileB:'',Adresse:o.address||o.commune,IDWilaya:String(o.wilaya),Commune:o.commune,Total:String(o.total),Note:o.products,Poids:String(o.count)}]})};
