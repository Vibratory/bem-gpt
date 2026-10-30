import Image from 'next/image';import Shop from '../components/Shop';import Reveal from '../components/Reveal';import Countdown from '../components/Countdown';
import {BOOKS,subtotal} from '../lib/data';import {SITE,PACK_PRICE} from '../lib/config';
const FAQ=[['كيف أستلم الكتب وأدفع؟','بعد طلبك نتصل بك لتأكيد الطلب، ثم يصلك الطرد ويُدفع ثمنه نقداً للموزع عند الاستلام.'],
['هل أستطيع فتح الطرد قبل الدفع؟','نعم، يمكنك معاينة الكتب أمام الموزع قبل الدفع.'],
['كم يستغرق التوصيل؟','عادة من 2 إلى 5 أيام حسب الولاية، ويصل إلى 58 ولاية.'],
['ما الذي يحتويه كل كتاب؟','مواضيع شهادة التعليم المتوسط من 2017 إلى 2026 مع حلولها، لمادة واحدة في كل كتاب. وكتاب الملخصات يغطي المواد.'],
['هل أشتري كل المواد أم مادة واحدة؟','كما تشاء. يمكنك اختيار المواد التي يحتاجها ابنك، والحزمة الكاملة بسعر أقل من مجموع الكتب منفصلة.']];
const ld=[{'@context':'https://schema.org','@type':'Store',name:SITE.name,url:SITE.url,telephone:'+213'+SITE.phone.slice(1),areaServed:'DZ',paymentAccepted:'Cash on delivery'},
 {'@context':'https://schema.org','@type':'ItemList',itemListElement:BOOKS.map((b,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'Product',name:`${b.t} — BEM 2027`,description:b.d,image:`${SITE.url}/covers/${b.id}.webp`,brand:{'@type':'Brand',name:SITE.name},
  offers:{'@type':'Offer',price:b.p,priceCurrency:'DZD',availability:'https://schema.org/InStock',url:SITE.url}}}))},
 {'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
export default function Home(){return(<>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
<div className="bar">الدفع عند الاستلام · توصيل إلى 58 ولاية · معاينة الطرد قبل الدفع</div>
<header className="hero"><div className="wrap hg">
 <div><p className="tag">لأولياء تلاميذ الرابعة متوسط</p>
  <h1>اجعل مراجعة ابنكم للـ BEM <em>منظّمة</em> وواضحة</h1>
  <p className="lead">عشر سنوات من مواضيع شهادة التعليم المتوسط مع الحلول، لكل مادة في كتاب مستقل. يتدرب التلميذ على شكل الامتحان الحقيقي، ويرى الولي أين وصلت المراجعة.</p>
  <Countdown/>
  <div className="cta"><a className="btn" href="#shop">اختر الكتب</a><a className="ghost" href={`tel:${SITE.phone}`}>اتصل: {SITE.phoneShow}</a></div></div>
 <div className="fan" aria-hidden="false">{['physics','math','arabic'].map((k,i)=><Image key={k} className={'f'+i} src={`/covers/${k}.webp`} alt={`غلاف ${BOOKS.find(b=>b.id===k).t} BEM 2027`} width={310} height={450} priority sizes="(max-width:700px) 40vw,260px"/>)}</div>
</div></header>
<section className="wrap trust">{[['💵','ادفع عند الاستلام','لا مبلغ مسبق'],['📦','عاين الطرد','أمام الموزع'],['🚚','58 ولاية','للمنزل أو المكتب'],['🖨️','مطبعة الأندلس','طباعة محلية']].map(([i,t,s])=><div key={t}><span>{i}</span><b>{t}</b><small>{s}</small></div>)}</section>
<section className="wrap" id="shop"><h2>اختر الكتب التي يحتاجها ابنكم</h2>
 <p className="sub">اضغط على الغلاف للإضافة أو الإزالة. الحزمة الكاملة ({BOOKS.length} كتب) بـ <b>{PACK_PRICE} دج</b> بدل {subtotal([]) || BOOKS.reduce((s,b)=>s+b.p,0)} دج.</p><Shop/></section>
<section className="wrap parents"><Reveal><h2>لماذا يطمئن الأولياء لهذه الكتب؟</h2></Reveal>
 <div className="pg">{[['مواضيع حقيقية','مواضيع الشهادة من 2017 إلى 2026 كما جاءت في الامتحان، لا تمارين مختلقة.'],['حلول مفصلة','يقارن التلميذ إجابته بالحل ويفهم أخطاءه بنفسه، فيقل الاعتماد على الدروس الخصوصية.'],['مراجعة تُتابَع','كتاب لكل مادة يسهل فيه معرفة ما أُنجز وما بقي.'],['تكلفة معقولة','بضع مئات من الدنانير للمادة، وتدفعها عند الاستلام.']].map(([t,d],i)=>
  <Reveal key={t} delay={i*90}><div className="pc"><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></section>
<section className="wrap steps"><h2>كيف تطلب؟</h2><ol>{['اختر الكتب واملأ الاستمارة.','نتصل بك لتأكيد الطلب.','تستلم الطرد، تعاينه، ثم تدفع.'].map(s=><li key={s}>{s}</li>)}</ol></section>
<section className="wrap faq"><h2>أسئلة الأولياء</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
<footer><div className="wrap"><b>{SITE.name}</b><p>للاستفسار: <a href={`tel:${SITE.phone}`} dir="ltr">{SITE.phoneShow}</a> · <a href={`https://wa.me/${SITE.wa}`}>واتساب</a> · <a href={`https://instagram.com/${SITE.ig}`}>إنستغرام</a>{SITE.fb&&<> · <a href={SITE.fb}>فيسبوك</a></>}</p></div></footer>
<a className="mob" href="#order">أكمل الطلب</a></>)}
