export const clean=s=>String(s??'').replace(/[<>&]/g,'').slice(0,200);
export const tg=async text=>{const E=process.env;if(!E.TG_TOKEN)return;
 try{await fetch(`https://api.telegram.org/bot${E.TG_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:E.TG_CHAT_ID,text,parse_mode:'HTML'})})}catch{}};
