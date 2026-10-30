import {MongoClient} from 'mongodb';
let p;export const col=async n=>{p??=new MongoClient(process.env.MONGODB_URI).connect();const c=await p;
 const k=c.db(process.env.MONGODB_DB||'bem').collection(n);return k};
