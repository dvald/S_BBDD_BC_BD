(function(root){
  'use strict';
  const planes={
    antes:{nombre:'catalogo-cd',replicas:3,validacion_estricta:false,puerto_publico:true,autenticacion:false,tls_clientes:false,tls_miembros:false,secretos:'literal_en_manifiesto',red_restringida:false,imagen_fijada:false,copia_aislada:false},
    propuesta:{nombre:'catalogo-cd',replicas:3,validacion_estricta:true,puerto_publico:false,autenticacion:true,tls_clientes:true,tls_miembros:true,secretos:'referencia_externa',red_restringida:true,imagen_fijada:true,copia_aislada:true}
  };
  function comprobar(p){
    const reglas=[['replicas','Tres miembros previstos',v=>Number.isInteger(v)&&v>=3],['validacion_estricta','API acepta un código de texto, no un objeto de operadores',v=>v===true],['puerto_publico','Motor sin publicación directa a Internet',v=>v===false],['autenticacion','Clientes y miembros autenticados',v=>v===true],['tls_clientes','Canal de cliente protegido',v=>v===true],['tls_miembros','Canal entre miembros protegido',v=>v===true],['secretos','Secretos referenciados fuera del manifiesto',v=>v==='referencia_externa'],['red_restringida','Solo flujos de red necesarios',v=>v===true],['imagen_fijada','Versión de imagen fijada',v=>v===true],['copia_aislada','Copia fuera del alcance del mismo borrado',v=>v===true]];
    if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Se espera un objeto de plan.');
    const salida=reglas.map(([campo,texto,fn])=>({campo,texto,ok:fn(p[campo])}));
    const admitidos=new Set(['nombre',...reglas.map(x=>x[0])]);
    Object.keys(p).filter(k=>!admitidos.has(k)).forEach(k=>salida.push({campo:k,texto:'Campo fuera del contrato: '+k,ok:false}));
    return salida;
  }
  function accesos(p){return [
    {id:'N1',solicitud:'API: buscar P01 con identidad autorizada',legitima:true,permitido:true},
    {id:'N2',solicitud:'API: código = {"$ne": null}',legitima:false,permitido:!p.validacion_estricta},
    {id:'N3',solicitud:'Internet: leer directamente sin credenciales',legitima:false,permitido:p.puerto_publico===true&&p.autenticacion!==true},
    {id:'N4',solicitud:'API: consultar el catálogo con su rol',legitima:true,permitido:true}
  ];}
  function rotacion(fase){
    const estados={inicial:[['K1'],['K1'],['K1']],rota_uno:[['K2'],['K1'],['K1']],solapamiento:[['K1','K2'],['K1','K2'],['K1','K2']],final:[['K2'],['K2'],['K2']]};
    if(!estados[fase])throw Error('Fase desconocida');
    const nodos=estados[fase],pares=[[0,1],[0,2],[1,2]].map(([a,b])=>({a:a+1,b:b+1,compatible:nodos[a].some(k=>nodos[b].includes(k))}));
    return {fase,nodos,pares,compatibles:pares.filter(x=>x.compatible).length};
  }
  const api={planes,comprobar,accesos,rotacion};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Distribuidas=api;
})(typeof globalThis!=='undefined'?globalThis:this);
