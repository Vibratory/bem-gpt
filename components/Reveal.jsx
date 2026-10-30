'use client';import {useEffect,useRef} from 'react';
export default function Reveal({children,className='',delay=0}){const r=useRef();
 useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){e.target.classList.add('in');io.disconnect()}},{threshold:.15});io.observe(r.current);return()=>io.disconnect()},[]);
 return <div ref={r} className={'rv '+className} style={{transitionDelay:delay+'ms'}}>{children}</div>}
