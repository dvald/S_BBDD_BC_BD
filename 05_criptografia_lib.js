(function(root){
  'use strict';
  async function probar(cryptoAPI){
    const c=cryptoAPI||root.crypto;if(!c||!c.subtle)throw Error('Web Crypto no está disponible. Esta prueba no se ha ejecutado.');
    const data=new TextEncoder().encode('CosechaDirecta: copia ficticia, pedido C01');
    const key=await c.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    const other=await c.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    const iv=c.getRandomValues(new Uint8Array(12));
    const cifrado=await c.subtle.encrypt({name:'AES-GCM',iv},key,data);
    const plain=await c.subtle.decrypt({name:'AES-GCM',iv},key,cifrado);
    const alterado=new Uint8Array(cifrado.slice(0));alterado[0]^=1;
    let alteracion=false,ajena=false;
    try{await c.subtle.decrypt({name:'AES-GCM',iv},key,alterado);}catch{alteracion=true;}
    try{await c.subtle.decrypt({name:'AES-GCM',iv},other,cifrado);}catch{ajena=true;}
    const vuelta=new Uint8Array(plain);
    return {algoritmo:'AES-256-GCM',iv_bytes:12,ida_vuelta:vuelta.length===data.length&&vuelta.every((v,i)=>v===data[i]),alteracion_rechazada:alteracion,clave_ajena_rechazada:ajena,alcance:'Operaciones Web Crypto sobre un texto ficticio en memoria; no TDE, TLS ni KMS.'};
  }
  function ciclo(fase){
    const casos={nueva:{nuevas:'K2',antigua:'K1 conservada bajo control',recuperable:true,texto:'Las nuevas copias usan K2; las antiguas siguen necesitando K1.'},
      destruida:{nuevas:'K2',antigua:'K1 destruida sin migrar sus copias',recuperable:false,texto:'Rotar no transforma las copias antiguas: las que dependían de K1 ya no se pueden descifrar.'},
      migrada:{nuevas:'K2',antigua:'Copias migradas y restauración comprobada',recuperable:true,texto:'Antes de retirar K1 se migra la protección de las copias retenidas y se verifica la recuperación. El mecanismo concreto depende de la arquitectura.'}};
    if(!casos[fase])throw Error('Escenario desconocido');return casos[fase];
  }
  const api={probar,ciclo};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Criptografia=api;
})(typeof globalThis!=='undefined'?globalThis:this);
