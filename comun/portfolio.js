// Dos experiencias del caso, construidas por partes. Nunca guarda claves reales.
(function(root){
  'use strict';
  const KEY='sbd-cosechadirecta-portfolio-v1';
  const TITULOS={
    'e1.problema':'Incidente y criterio de aceptación','e1.permisos':'Permisos por tarea','e1.consulta':'Consulta y pruebas de entrada',
    'e1.tde':'Alcance de TDE y recuperación de claves','e1.recuperacion':'Plan y ensayo de recuperación','e1.propuesta':'Recomendación al responsable','e1.revision':'Revisión de la propuesta',
    'e1.objetivo-cripto':'Protección requerida para la copia','e1.prueba-cripto':'Interpretación de las pruebas criptográficas','e1.custodia':'Inventario y custodia de claves','e1.revision-cripto':'Revisión de custodia y recuperación',
    'e2.problema':'Exposición y función del catálogo','e2.rutas':'Flujos e identidades','e2.automatizacion':'Configuración reproducible y verificaciones pendientes','e2.rotacion':'Secuencia de rotación de miembros','e2.runbook':'Runbook de respuesta','e2.revision':'Revisión entre desarrollo y operaciones',
    'e2.objetivo-cripto':'Protección del intercambio distribuido','e2.custodia':'Secretos e identidades separados','e2.identidad':'Identidad del receptor','e2.revision-cripto':'Revisión del canal y los secretos'
  };
  let state={tipo:'sbd-portfolio',version:1,campos:{},registros:{}};
  let disponible=true;
  function validar(d){
    if(!d||d.tipo!=='sbd-portfolio'||d.version!==1||!d.campos||typeof d.campos!=='object'||Array.isArray(d.campos)||!d.registros||typeof d.registros!=='object'||Array.isArray(d.registros))throw Error('Formato de portfolio no reconocido.');
    const limpio={tipo:'sbd-portfolio',version:1,campos:{},registros:{}};
    for(const [k,v] of Object.entries(d.campos))if(/^(e1|e2)\.[a-z0-9_.-]{1,70}$/.test(k)&&typeof v==='string')limpio.campos[k]=v.slice(0,12000);
    for(const [k,v] of Object.entries(d.registros))if(/^(e1|e2)\.[a-z0-9_.-]{1,70}$/.test(k)&&v&&typeof v.titulo==='string'&&typeof v.origen==='string'&&typeof v.detalle==='string')limpio.registros[k]={titulo:v.titulo.slice(0,200),origen:v.origen.slice(0,120),detalle:v.detalle.slice(0,20000)};
    return limpio;
  }
  function texto(){
    const lineas=['# CosechaDirecta · decisiones y evidencias','',
      'Aportaciones a las dos experiencias de portfolio de los temas 3–5.','',
      'El origen de cada registro limita lo que demuestra. Un modelo no prueba un despliegue.',''];
    const grupos=[['e1','1. Informe de hardening y pruebas relacionales, recuperación y métricas'],['e2','2. Despliegue seguro y automatizado de BD distribuidas, secretos y respuesta']];
    for(const [prefijo,titulo] of grupos){
      lineas.push('## '+titulo,'');
      const campos=Object.entries(state.campos).filter(([k])=>k.startsWith(prefijo+'.')&&state.campos[k].trim());
      if(!campos.length)lineas.push('Decisiones: pendientes de redactar.','');
      for(const [k,v] of campos)lineas.push('### '+(TITULOS[k]||'Aportación al caso'),'',v,'');
      for(const [k,v] of Object.entries(state.registros).filter(([k])=>k.startsWith(prefijo+'.')))lineas.push('### '+v.titulo,'','Origen: '+v.origen,'',v.detalle,'');
      lineas.push(prefijo==='e1'?'Los modelos de esta demo no acreditan TDE en un motor compatible, permisos efectivos de ese motor ni RPO/RTO de un servicio real. Documentar esas pruebas por separado.':'Los modelos de esta demo no acreditan despliegue de los miembros, controles efectivos, continuidad ni ensayo del runbook en el entorno elegido. Documentar esas pruebas por separado.','');
    }
    return lineas.join('\n');
  }
  function aviso(msg){document.querySelectorAll('[data-portfolio-aviso]').forEach(x=>x.textContent=msg);}
  function pintar(){document.querySelectorAll('[data-portfolio-vista]').forEach(x=>x.textContent=texto());}
  function guardar(){try{root.localStorage.setItem(KEY,JSON.stringify(state));}catch{disponible=false;aviso('Este navegador no conserva las notas. Exporta el JSON antes de cambiar de página e impórtalo para continuar.');}pintar();}
  function registrar(k,titulo,detalle,origen){
    if(!/^(e1|e2)\.[a-z0-9_.-]{1,70}$/.test(k))throw Error('Clave de evidencia inválida');
    state.registros[k]={titulo,origen,detalle:typeof detalle==='string'?detalle:JSON.stringify(detalle,null,2)};guardar();
    aviso(disponible?'Resultado incorporado a tu informe. Las notas se conservan en este navegador.':'Resultado incorporado. Exporta el JSON para conservarlo.');
  }
  function descargar(nombre,mime,texto){
    const blob=new Blob([texto],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=nombre;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function iniciar(){
    try{const anterior=root.localStorage.getItem(KEY);if(anterior)state=validar(JSON.parse(anterior));}catch{disponible=false;}
    document.querySelectorAll('[data-portfolio]').forEach(x=>{x.value=state.campos[x.dataset.portfolio]||'';x.addEventListener('input',()=>{state.campos[x.dataset.portfolio]=x.value.slice(0,12000);guardar();});});
    document.querySelectorAll('[data-exportar-portfolio]').forEach(b=>b.addEventListener('click',()=>{const json=b.dataset.exportarPortfolio==='json';descargar('CosechaDirecta-portfolio.'+(json?'json':'md'),json?'application/json':'text/markdown;charset=utf-8',json?JSON.stringify(state,null,2):texto());}));
    document.querySelectorAll('[data-importar-portfolio]').forEach(input=>input.addEventListener('change',async()=>{try{const f=input.files[0];if(!f)return;if(f.size>300000)throw Error('El JSON supera 300 KB.');const nuevo=validar(JSON.parse(await f.text()));state.campos={...state.campos,...nuevo.campos};state.registros={...state.registros,...nuevo.registros};document.querySelectorAll('[data-portfolio]').forEach(x=>x.value=state.campos[x.dataset.portfolio]||'');guardar();aviso('Portfolio importado; puedes continuar las decisiones de las dos experiencias.');}catch(e){aviso(e.message);}finally{input.value='';}}));
    pintar();if(!disponible)aviso('El guardado local no está disponible. Exporta el JSON para continuar en otra página.');
    else if(root.location.protocol==='file:')aviso('Al abrir archivos locales, el navegador puede separar las notas de cada página. Guarda el JSON e impórtalo para continuar si no aparecen tus aportaciones.');
  }
  const api={registrar,validar,texto};root.Portfolio=api;
  if(typeof module!=='undefined'&&module.exports)module.exports={validar};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();}
})(typeof globalThis!=='undefined'?globalThis:this);
