(function(){
  'use strict';
  const $=id=>document.getElementById(id),esc=Clase.esc,tema=Number(document.body.dataset.tema);
  // La capa común gestiona foco, teclado y hash; cada demo activa sus paneles.
  document.querySelectorAll('[role="tab"]').forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('[role="tab"]').forEach(x=>x.setAttribute('aria-selected',String(x===t)));
    document.querySelectorAll('[role="tabpanel"]').forEach(p=>p.classList.toggle('active',p.id===t.getAttribute('aria-controls')));
  }));
  const estado=(ok,texto)=>'<span class="est '+(ok?'ok':'bad')+'">'+esc(texto)+'</span>';
  function tabla(cab,filas){return '<table class="t"><thead><tr>'+cab.map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+filas.map(row=>'<tr>'+row.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
  function alternar(button,target,mostrar,ocultar){
    $(button).addEventListener('click',()=>{const abierto=$(target).hidden;$(target).hidden=!abierto;$(button).setAttribute('aria-expanded',String(abierto));$(button).textContent=abierto?ocultar:mostrar;});
  }
  if(tema===3){
    const R=Relacionales;let permisosActual,objetivoActual;
    function permisos(){permisosActual=R.permisos($('r-estado').value==='despues');const m=R.metricas(permisosActual);
      $('r-tabla').innerHTML=tabla(['Prueba','Solicitud','Debería entrar','Decisión del modelo','Motivo'],permisosActual.map(r=>[r.prueba,esc(r.peticion),r.esperado?'Sí':'No',estado(r.permitido===r.esperado,r.permitido?'Permitido':'Denegado'),esc(r.motivo)]));
      $('r-metrica').textContent='Indebidas bloqueadas: '+m.negativas_bloqueadas+'/'+m.negativas+' · Legítimas operativas: '+m.positivas_operativas+'/'+m.positivas;}
    permisos();alternar('r-revelar','r-resultados','Comprobar las cinco solicitudes','Ocultar resultados');
    $('r-estado').addEventListener('change',()=>{permisos();$('r-resultados').hidden=true;$('r-revelar').setAttribute('aria-expanded','false');$('r-revelar').textContent='Comprobar las cinco solicitudes';});
    $('r-guardar').addEventListener('click',()=>Portfolio.registrar('e1.modelo-permisos','Pruebas de permisos del modelo',{diseño:$('r-estado').value,metricas:R.metricas(permisosActual),pruebas:permisosActual},'Simulación didáctica de cinco solicitudes'));
    function sql(){const d=REL_DATOS.consultas[Number($('sql-entrada').value)];$('sql-antes').textContent=d.sql_concatenada;$('sql-valor').textContent='Valor enviado como parámetro: '+JSON.stringify(d.entrada);
      for(const [id,key] of [['sql-filas-antes','antes'],['sql-filas-despues','despues']])$(id).innerHTML='<p class="metrica">'+d[key].length+' fila(s)</p>'+tabla(['codigo'],d[key].map(v=>[esc(v)]));}
    sql();alternar('sql-revelar','sql-resultados','Comparar resultados','Ocultar resultados');$('sql-entrada').addEventListener('change',()=>{sql();$('sql-resultados').hidden=true;$('sql-revelar').setAttribute('aria-expanded','false');$('sql-revelar').textContent='Comparar resultados';});
    $('sql-guardar').addEventListener('click',()=>Portfolio.registrar('e1.prueba-sql','Comparación SQL',REL_DATOS.consultas[Number($('sql-entrada').value)],'Salida SQLite precalculada al generar la demo; no ejecución del alumno'));
    $('r-importar').addEventListener('change',async()=>{try{const f=$('r-importar').files[0];if(!f)return;if(f.size>150000)throw Error('El archivo supera 150 KB.');const d=R.validarLab(JSON.parse(await f.text()));Portfolio.registrar('e1.lab-local','Registro aportado del laboratorio relacional',d,'JSON importado del laboratorio SQLite local');$('r-importado').textContent='Registro incorporado. Restauración coincidente: '+(d.restauracion.coincide?'sí':'no')+'. Duración local: '+d.restauracion.restauracion_y_validacion_ms+' ms. No demuestra TDE ni RTO de servicio.';}catch(e){$('r-importado').textContent=e.message;}finally{$('r-importar').value='';}});
    function objetivos(){try{if(!$('r-rpo').value||!$('r-rto').value||!$('r-rpo').checkValidity()||!$('r-rto').checkValidity())throw Error('Introduce intervalos válidos no negativos.');objetivoActual=R.objetivos(Number($('r-rpo').value),Number($('r-rto').value));$('r-objetivos').innerHTML='<p>'+estado(objetivoActual.rpo_cumple,'RPO: '+(objetivoActual.rpo_cumple?'cumple':'supera el objetivo'))+' · '+estado(objetivoActual.rto_cumple,'RTO: '+(objetivoActual.rto_cumple?'cumple':'supera el objetivo'))+'</p>';$('r-guardar-objetivos').disabled=false;}catch(e){objetivoActual=null;$('r-objetivos').textContent=e.message;$('r-guardar-objetivos').disabled=true;}}
    $('r-calcular').addEventListener('click',objetivos);objetivos();for(const id of ['r-rpo','r-rto'])$(id).addEventListener('input',()=>{objetivoActual=null;$('r-guardar-objetivos').disabled=true;$('r-objetivos').textContent='Vuelve a contrastar los intervalos modificados.';});
    $('r-guardar-objetivos').addEventListener('click',()=>{if(objetivoActual)Portfolio.registrar('e1.objetivos','Contraste de objetivos de recuperación',objetivoActual,'Cálculo de un supuesto; no medida de servicio real');});
  }
  if(tema===4){
    const N=Distribuidas;let planActual=null,checksActual=null,rutasActual=null,rotacionActual=null;
    function rutas(){const p=N.planes[$('n-estado').value];rutasActual=N.accesos(p);$('n-rutas').innerHTML=tabla(['Solicitud','Debería entrar','Decisión del modelo'],rutasActual.map(x=>[esc(x.id+' · '+x.solicitud),x.legitima?'Sí':'No',estado(x.permitido===x.legitima,x.permitido?'Permitido':'Denegado')]));}
    $('n-rutas-ver').addEventListener('click',rutas);$('n-estado').addEventListener('change',()=>{rutasActual=null;$('n-rutas').textContent='Anticipa las decisiones y contrasta las rutas.';});
    $('n-rutas-guardar').addEventListener('click',()=>{if(rutasActual)Portfolio.registrar('e2.rutas-modelo','Rutas del catálogo',rutasActual,'Simulación didáctica; sin conexión a un motor');else $('n-rutas').textContent='Contrasta las rutas antes de conservar el resultado.';});
    function revisar(){try{planActual=JSON.parse($('n-plan').value);checksActual=N.comprobar(planActual);$('n-checks').innerHTML=tabla(['Comprobación','Resultado'],checksActual.map(x=>[esc(x.texto),estado(x.ok,x.ok?'Cumple el plan':'Revisar')]))+'<p class="metrica">'+checksActual.filter(x=>!x.ok).length+' incumplimientos del plan. Despliegue y controles efectivos: pendientes.</p>';$('n-plan-guardar').disabled=false;}catch(e){planActual=null;checksActual=null;$('n-checks').textContent='No se puede comprobar: '+e.message;$('n-plan-guardar').disabled=true;}}
    function cargar(k){$('n-plan').value=JSON.stringify(N.planes[k],null,2);planActual=null;$('n-checks').textContent='Plan cargado: predice qué comprobaciones fallan.';$('n-plan-guardar').disabled=true;}
    $('n-antes').addEventListener('click',()=>cargar('antes'));$('n-propuesta').addEventListener('click',()=>cargar('propuesta'));$('n-revisar').addEventListener('click',revisar);cargar('antes');
    $('n-plan').addEventListener('input',()=>{planActual=null;checksActual=null;$('n-plan-guardar').disabled=true;$('n-checks').textContent='Texto modificado. Vuelve a comprobar el plan.';});
    $('n-plan-guardar').addEventListener('click',()=>{if(planActual)Portfolio.registrar('e2.plan-revisado','Plan de despliegue y revisión',{plan:planActual,comprobaciones:checksActual},'Revisión automatizada de un contrato didáctico, no despliegue de Kubernetes');});
    function rotar(){rotacionActual=N.rotacion($('n-fase').value);$('n-rotacion').innerHTML='<div class="caso-matriz">'+rotacionActual.nodos.map((x,i)=>'<div><b>Miembro '+(i+1)+'</b><p>Acepta '+esc(x.join(' y '))+'</p></div>').join('')+'</div>'+tabla(['Par','Confianza compartida en el modelo'],rotacionActual.pares.map(x=>[x.a+' ↔ '+x.b,estado(x.compatible,x.compatible?'Compatible':'Sin clave común')]))+'<p>Compatibilidad entre pares: '+rotacionActual.compatibles+'/3. No mide elecciones ni disponibilidad real.</p>';}
    $('n-rotar').addEventListener('click',rotar);$('n-fase').addEventListener('change',()=>{rotacionActual=null;$('n-rotacion').textContent='Anticipa qué pares conservan confianza y compruébalo.';});
    $('n-rotacion-guardar').addEventListener('click',()=>{if(rotacionActual)Portfolio.registrar('e2.compatibilidad','Compatibilidad de miembros',rotacionActual,'Modelo de conjuntos de claves aceptadas; no rotación ejecutada');else $('n-rotacion').textContent='Comprueba esta fase antes de conservarla.';});
  }
  if(tema===5){
    const C=Criptografia;let pruebaActual=null,cicloActual=null;
    $('c-ejecutar').addEventListener('click',async()=>{pruebaActual=null;$('c-ejecutar').disabled=true;$('c-guardar').disabled=true;$('c-resultado').textContent='Ejecutando cifrado y tres comprobaciones…';try{pruebaActual=await C.probar();$('c-resultado').textContent=JSON.stringify(pruebaActual,null,2);$('c-guardar').disabled=false;}catch(e){$('c-resultado').textContent=e.message;}finally{$('c-ejecutar').disabled=false;}});
    $('c-guardar').addEventListener('click',()=>{if(pruebaActual){Portfolio.registrar('e1.cripto-local','Pruebas criptográficas locales',pruebaActual,'Ejecución Web Crypto local sobre un texto ficticio');Portfolio.registrar('e2.cripto-local','Pruebas criptográficas locales',pruebaActual,'Ejecución Web Crypto local; no verificación de TLS ni KMS');}});
    function ciclo(){cicloActual=C.ciclo($('c-fase').value);$('c-ciclo').innerHTML='<p><b>Nuevas copias:</b> '+esc(cicloActual.nuevas)+'</p><p><b>Dependencia de la copia antigua:</b> '+esc(cicloActual.antigua)+'</p><p>'+estado(cicloActual.recuperable,cicloActual.recuperable?'Recuperación prevista posible':'Se pierde capacidad de descifrar')+'</p><p>'+esc(cicloActual.texto)+'</p>';}
    $('c-ciclo-ver').addEventListener('click',ciclo);$('c-fase').addEventListener('change',()=>{cicloActual=null;$('c-ciclo').textContent='Anticipa la dependencia de la copia y compruébala.';});
    $('c-ciclo-guardar').addEventListener('click',()=>{if(cicloActual){Portfolio.registrar('e1.dependencia-claves','Dependencia de las copias',cicloActual,'Modelo de ciclo de claves, no migración ejecutada');Portfolio.registrar('e2.dependencia-claves','Dependencia de las copias',cicloActual,'Modelo de ciclo de claves, no migración ejecutada');}else $('c-ciclo').textContent='Comprueba el escenario antes de conservarlo.';});
  }
})();
