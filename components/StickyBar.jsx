'use client';import {useEffect,useState} from 'react';import {PRICE} from '../lib/config';
export default function StickyBar(){const [p,setP]=useState(0),[on,setOn]=useState(false);
 useEffect(()=>{const f=()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;setP(m>0?h.scrollTop/m:0);setOn(h.scrollTop>560)};f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 return <><div className="prog" style={{transform:`scaleX(${p})`}}/><div className={'sb'+(on?' on':'')}><span>حزمة BEM 2027 · <b>{PRICE} دج</b></span><a className="btn" href="#order">اطلب الآن</a></div></>}
