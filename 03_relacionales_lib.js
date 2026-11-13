(function(root){
  'use strict';
  function permisos(corregido){
    return [
      {prueba:'R1', peticion:'U17 consulta su pedido', esperado:true, permitido:true, motivo:'Operación legítima'},
      {prueba:'R2', peticion:'U17 consulta el pedido de U24', esperado:false, permitido:!corregido, motivo:corregido?'Autorización por sesión':'Falta acotar el cliente'},
      {prueba:'R3', peticion:'app_web cambia el esquema', esperado:false, permitido:!corregido, motivo:corregido?'Cuenta de migraciones separada':'Cuenta web con privilegios excesivos'},
      {prueba:'R4', peticion:'analista_bi consulta ventas agregadas', esperado:true, permitido:true, motivo:'Vista necesaria para el informe'},
      {prueba:'R5', peticion:'analista_bi lee los correos de clientes', esperado:false, permitido:!corregido, motivo:corregido?'Sin concesión directa a clientes':'SELECT alcanza datos innecesarios'}
    ];
  }
  function metricas(filas){
    const negativas=filas.filter(x=>!x.esperado), positivas=filas.filter(x=>x.esperado);
    return {negativas_bloqueadas:negativas.filter(x=>!x.permitido).length, negativas:negativas.length,
      positivas_operativas:positivas.filter(x=>x.permitido).length, positivas:positivas.length};
  }
  function objetivos(retroceso,interrupcion){
    if(!Number.isFinite(retroceso)||!Number.isFinite(interrupcion)||retroceso<0||interrupcion<0) throw Error('Intervalos inválidos');
    return {retroceso_min:retroceso, interrupcion_min:interrupcion, rpo_objetivo_min:15,rto_objetivo_min:60,rpo_cumple:retroceso<=15,rto_cumple:interrupcion<=60};
  }
  function validarLab(d){
    if(!d||d.tipo!=='cosechadirecta-lab-relacional'||d.version!==1||typeof d.motor!=='string'||!Array.isArray(d.consultas)||d.consultas.length!==3||!Array.isArray(d.autorizacion)||d.autorizacion.length!==2||!d.restauracion)throw Error('No es una evidencia de lab_relacional.py versión 1.');
    const r=d.restauracion;
    if(!d.consultas.every(x=>x&&typeof x.entrada==='string'&&Array.isArray(x.antes)&&Array.isArray(x.despues)&&x.antes.every(y=>typeof y==='string')&&x.despues.every(y=>typeof y==='string'))||!d.autorizacion.every(x=>x&&typeof x.sesion==='string'&&typeof x.pedido==='string'&&typeof x.permitido==='boolean')||typeof r.coincide!=='boolean'||!Number.isFinite(r.restauracion_y_validacion_ms)||r.restauracion_y_validacion_ms<0||!Number.isInteger(r.filas_recuperadas)||r.filas_recuperadas<0)throw Error('Evidencia incompleta.');
    // Copiar solo campos conocidos, nunca confiar en HTML ni metadatos importados.
    return {motor:d.motor.slice(0,80),consultas:d.consultas.map(x=>({entrada:String(x.entrada).slice(0,100),antes:x.antes,despues:x.despues})),
      autorizacion:d.autorizacion.map(x=>({sesion:String(x.sesion),pedido:String(x.pedido),permitido:!!x.permitido})),
      restauracion:{filas_recuperadas:r.filas_recuperadas,coincide:r.coincide,restauracion_y_validacion_ms:r.restauracion_y_validacion_ms,alcance:'SQLite local. RTO operativo, PITR y TDE no comprobados.'}};
  }
  const api={permisos,metricas,objetivos,validarLab};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Relacionales=api;
})(typeof globalThis!=='undefined'?globalThis:this);
