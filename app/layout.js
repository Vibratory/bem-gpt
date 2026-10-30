import './globals.css';import Script from 'next/script';import {Lalezar,Tajawal} from 'next/font/google';import {SITE} from '../lib/config';
const display=Lalezar({subsets:['arabic'],weight:'400',variable:'--display',display:'swap'});
const body=Tajawal({subsets:['arabic'],weight:['400','500','700','800'],variable:'--body',display:'swap'});
const PIX=process.env.NEXT_PUBLIC_PIXEL_ID;
export const metadata={metadataBase:new URL(SITE.url),
 title:'كتب مراجعة BEM 2027 | مواضيع وحلول 2017–2026 لكل المواد | الدفع عند الاستلام',
 description:'مواضيع وحلول شهادة التعليم المتوسط من 2017 إلى 2026 لجميع المواد، وملخصات BEM 2027 من مطبعة الأندلس. توصيل إلى 58 ولاية والدفع عند الاستلام.',
 keywords:['BEM 2027','شهادة التعليم المتوسط','مواضيع BEM','حلول BEM','ملخصات BEM 2027','كتب الرابعة متوسط','مواضيع وحلول سابقة','الجزائر'],
 alternates:{canonical:'/'},
 openGraph:{type:'website',locale:'ar_DZ',url:SITE.url,siteName:SITE.name,title:'كتب مراجعة BEM 2027 — مواضيع وحلول لكل المواد',description:'عشر سنوات من مواضيع الشهادة مع الحلول. الدفع عند الاستلام.',images:[{url:'/og.jpg',width:1200,height:630}]},
 twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export const viewport={themeColor:'#25447a'};
export default function L({children}){return(
<html lang="ar" dir="rtl" className={`${display.variable} ${body.variable}`}><body>{children}
{PIX&&<Script id="fb" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIX}');fbq('track','PageView');`}</Script>}
</body></html>)}
