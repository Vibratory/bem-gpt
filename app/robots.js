import {SITE} from '../lib/config';
export default()=>({rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:SITE.url+'/sitemap.xml'});
