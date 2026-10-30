export default {images:{formats:['image/avif','image/webp']},poweredByHeader:false,
 async headers(){return[{source:'/covers/:p*',headers:[{key:'Cache-Control',value:'public,max-age=31536000,immutable'}]}]}};
