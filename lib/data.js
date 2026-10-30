import {PACK_PRICE,FEE} from './config';
export const BOOKS=[
{id:'math',t:'الرياضيات',d:'مواضيع وحلول 2017–2026',p:400,c:'#25447a'},
{id:'arabic',t:'اللغة العربية',d:'مواضيع وحلول 2017–2026',p:400,c:'#7a4351'},
{id:'french',t:'اللغة الفرنسية',d:'مواضيع وحلول 2017–2026',p:400,c:'#1a2b57'},
{id:'english',t:'اللغة الإنجليزية',d:'مواضيع وحلول 2017–2026',p:400,c:'#a3182c'},
{id:'physics',t:'الفيزياء',d:'مواضيع وحلول 2017–2026',p:400,c:'#d46a1b'},
{id:'science',t:'العلوم الطبيعية',d:'مواضيع وحلول 2017–2026',p:400,c:'#5d7d9a'},
{id:'histgeo',t:'التاريخ والجغرافيا',d:'مواضيع وحلول 2017–2026',p:400,c:'#8a8e66'},
{id:'islamic',t:'التربية الإسلامية',d:'مواضيع وحلول 2017–2026',p:400,c:'#b0613f'},
{id:'civics',t:'التربية المدنية',d:'مواضيع وحلول 2017–2026',p:400,c:'#2f6f87'},
{id:'summaries',t:'ملخصات BEM 2027',d:'ملخصات لكل المواد',p:500,c:'#1d2349'}];
export const WAR=["أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار","أولاد جلال","بني عباس","عين صالح","عين قزام","تقرت","جانت","المغير","المنيعة"];
export const FR=["Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa"];
export const subtotal=ids=>ids.length===BOOKS.length?PACK_PRICE:BOOKS.filter(b=>ids.includes(b.id)).reduce((s,b)=>s+b.p,0);
export const total=(ids,type)=>subtotal(ids)+(type==='desk'?FEE.desk:FEE.home);
