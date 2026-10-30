import Image from 'next/image';import OrderForm from '../components/OrderForm';import Reveal from '../components/Reveal';import Explorer from '../components/Explorer';import Planner from '../components/Planner';import StickyBar from '../components/StickyBar';import './site.css';import Countdown from '../components/Countdown';
import {BOOKS} from '../lib/data';import {SITE,PRICE} from '../lib/config';
const FAQ=[['كيف أستلم الكتب وأدفع؟','بعد طلبك نتصل بك لتأكيد الطلب، ثم يصلك الطرد ويُدفع ثمنه نقداً للموزع عند الاستلام.'],
['هل أستطيع فتح الطرد قبل الدفع؟','نعم، يمكنك معاينة الكتب أمام الموزع قبل الدفع.'],
['كم يستغرق التوصيل؟','عادة من 2 إلى 5 أيام حسب الولاية، مع التوصيل إلى المنزل أو إلى مكتب شركة التوصيل الأقرب إليك.'],
['ماذا تتضمن الحزمة؟','عشرة كتب: مواضيع شهادة التعليم المتوسط من 2017 إلى 2026 مع حلولها لتسع مواد، إضافة إلى كتاب ملخصات BEM 2027.'],
['هل يمكن شراء كتاب واحد؟','الكتب تُباع كحزمة واحدة كاملة بسعر 2500 دج لتغطي كل المواد.']];
const ld=[{'@context':'https://schema.org','@type':'Store',name:SITE.name,url:SITE.url,telephone:'+213'+SITE.phone.slice(1),areaServed:'DZ',paymentAccepted:'Cash on delivery'},
 {'@context':'https://schema.org','@type':'Product',name:'حزمة كتب BEM 2027 الكاملة (10 كتب)',description:'مواضيع وحلول شهادة التعليم المتوسط 2017–2026 لكل المواد مع ملخصات BEM 2027',image:BOOKS.map(b=>`${SITE.url}/covers/${b.id}.webp`),brand:{'@type':'Brand',name:SITE.name},
  offers:{'@type':'Offer',price:PRICE,priceCurrency:'DZD',availability:'https://schema.org/InStock',url:SITE.url,areaServed:'DZ'}},
 {'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
export default function Home(){return(<>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
<StickyBar/>
<header className="hero"><div className="wrap hg">
 <div className="ht"><p className="tag">{SITE.name} · BEM 2027</p>
  <h1>ابدأ مراجعة الـ BEM بمواضيع <em>حقيقية</em> وحلولها</h1>
  <p className="lead">عشر سنوات من مواضيع شهادة التعليم المتوسط (2017–2026) لكل المواد، في حزمة واحدة من 10 كتب مطبوعة.</p>
  <ul className="bd"><li>💵 الدفع عند الاستلام</li><li>🚚 توصيل إلى 58 ولاية</li><li>📞 نتصل بك قبل الشحن</li></ul><Countdown/></div>
 <div className="fc"><OrderForm/></div>
</div></header>
<section className="strip" aria-label="أغلفة الكتب"><div className="sr2">{BOOKS.map(b=><Image key={b.id} src={`/covers/${b.id}.webp`} alt={`غلاف ${b.t} BEM 2027`} width={310} height={450} sizes="150px"/>)}</div></section>
<section className="wrap tiles">{[['10','كتب في حزمة واحدة'],['250 دج','متوسط سعر الكتاب'],['2017–2026','سنوات المواضيع']].map(([n,t],i)=><Reveal key={t} delay={i*80}><div className="tl"><b>{n}</b><span>{t}</span></div></Reveal>)}</section>
<section className="wrap"><h2>جرّب الكتب قبل أن تطلب</h2><p className="sub">اختر مادة لترى غلافها وكيف يستعملها التلميذ.</p><Explorer/></section>
<section className="wrap"><h2>هل الوقت كافٍ؟ احسبوا وتيرة المراجعة</h2><p className="sub">حرّك المؤشر حسب ما يستطيع ابنكم حلّه أسبوعياً.</p><Planner/></section>
<section className="wrap"><h2>كيف يتم الطلب؟</h2>
 <ol className="tm">{[['اطلب في دقيقة','اسمك ورقم هاتفك ثم عنوان التوصيل.'],['نتصل بك','نؤكد معك الطلب والعنوان.'],['الشحن','يصلك الطرد إلى المنزل أو إلى مكتب شركة التوصيل.'],['تستلم وتدفع','تدفع نقداً عند الاستلام.']].map(([t,d])=><li key={t}><b>{t}</b><span>{d}</span></li>)}</ol></section>
<section className="wrap faq"><h2>أسئلة الأولياء</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
<section className="band"><div className="wrap"><h2>الامتحان يقترب، والمراجعة المنظمة تبدأ اليوم</h2><p>{PRICE} دج للحزمة كاملة. الدفع عند الاستلام.</p><a className="btn" href="#order">اطلب الآن</a></div></section>
<footer><div className="wrap"><b>{SITE.name}</b><p>للاستفسار: <a href={`tel:${SITE.phone}`} dir="ltr">{SITE.phoneShow}</a> · <a href={`https://wa.me/${SITE.wa}`}>واتساب</a> · <a href={`https://instagram.com/${SITE.ig}`}>إنستغرام</a>{SITE.fb&&<> · <a href={SITE.fb}>فيسبوك</a></>}</p></div></footer></>)}
