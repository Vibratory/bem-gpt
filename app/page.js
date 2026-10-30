import Image from 'next/image';import OrderForm from '../components/OrderForm';import Reveal from '../components/Reveal';import Countdown from '../components/Countdown';
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
<div className="bar">الدفع عند الاستلام · توصيل إلى 58 ولاية · معاينة الطرد قبل الدفع</div>
<header className="hero"><div className="wrap hg">
 <div className="ht"><p className="tag">لأولياء تلاميذ الرابعة متوسط</p>
  <h1>اجعل مراجعة ابنكم للـ BEM <em>منظّمة</em> وواضحة</h1>
  <p className="lead">عشر سنوات من مواضيع شهادة التعليم المتوسط مع الحلول، لكل المواد في حزمة واحدة من 10 كتب.</p>
  <p className="big">{PRICE} دج <small>للحزمة كاملة · الدفع عند الاستلام</small></p><Countdown/></div>
 <div className="fc"><OrderForm/></div>
 <div className="fan">{['physics','math','arabic'].map((k,i)=><Image key={k} className={'f'+i} src={`/covers/${k}.webp`} alt={`غلاف ${BOOKS.find(b=>b.id===k).t} BEM 2027`} width={310} height={450} priority sizes="(max-width:700px) 40vw,200px"/>)}</div>
</div></header>
<section className="wrap trust">{[['💵','ادفع عند الاستلام','لا مبلغ مسبق'],['📦','عاين الطرد','أمام الموزع'],['🚚','58 ولاية','للمنزل أو المكتب'],['🖨️','مطبعة الأندلس','طباعة محلية']].map(([i,t,s])=><div key={t}><span>{i}</span><b>{t}</b><small>{s}</small></div>)}</section>
<section className="wrap" id="books"><h2>ماذا تتضمن الحزمة؟</h2><p className="sub">عشرة كتب بسعر واحد: {PRICE} دج.</p>
 <div className="grid">{BOOKS.map(b=><figure className="bk" key={b.id}><Image src={`/covers/${b.id}.webp`} alt={`غلاف كتاب ${b.t} BEM 2027`} width={310} height={450} sizes="(max-width:600px) 45vw,200px"/><figcaption><strong>{b.t}</strong><span>{b.d}</span></figcaption></figure>)}</div>
 <p style={{textAlign:'center'}}><a className="btn" href="#order">اطلب الحزمة</a></p></section>
<section className="wrap parents"><Reveal><h2>لماذا يطمئن الأولياء لهذه الكتب؟</h2></Reveal>
 <div className="pg">{[['مواضيع حقيقية','مواضيع الشهادة من 2017 إلى 2026 كما جاءت في الامتحان، لا تمارين مختلقة.'],['حلول مفصلة','يقارن التلميذ إجابته بالحل ويفهم أخطاءه بنفسه، فيقل الاعتماد على الدروس الخصوصية.'],['مراجعة تُتابَع','كتاب لكل مادة يسهل فيه معرفة ما أُنجز وما بقي.'],['تكلفة معقولة','بضع مئات من الدنانير للمادة، وتدفعها عند الاستلام.']].map(([t,d],i)=>
  <Reveal key={t} delay={i*90}><div className="pc"><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></section>
<section className="wrap steps"><h2>كيف تطلب؟</h2><ol>{['اختر الكتب واملأ الاستمارة.','نتصل بك لتأكيد الطلب.','تستلم الطرد، تعاينه، ثم تدفع.'].map(s=><li key={s}>{s}</li>)}</ol></section>
<section className="wrap faq"><h2>أسئلة الأولياء</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
<footer><div className="wrap"><b>{SITE.name}</b><p>للاستفسار: <a href={`tel:${SITE.phone}`} dir="ltr">{SITE.phoneShow}</a> · <a href={`https://wa.me/${SITE.wa}`}>واتساب</a> · <a href={`https://instagram.com/${SITE.ig}`}>إنستغرام</a>{SITE.fb&&<> · <a href={SITE.fb}>فيسبوك</a></>}</p></div></footer>
<a className="mob" href="#order">أكمل الطلب</a></>)}
