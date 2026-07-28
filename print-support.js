(function(){
  'use strict';
  function makeHeader(){
    if(document.querySelector('.print-report-header')) return;
    var header=document.createElement('div');
    header.className='print-report-header';
    var title=document.body.getAttribute('data-print-title')||document.title.replace(/\s*[·|–-].*$/,'')||'ChargeNurse';
    var subtitle=document.body.getAttribute('data-print-subtitle')||'Libertyville CLC';
    header.innerHTML='<h1></h1><p></p>';
    header.querySelector('h1').textContent=title;
    header.querySelector('p').textContent=subtitle+' · Printed '+new Date().toLocaleString();
    var target=document.querySelector('main,.main,.shell,#main')||document.body;
    target.insertBefore(header,target.firstChild);
  }
  function refresh(){
    makeHeader();
    var p=document.querySelector('.print-report-header p');
    if(p){
      var subtitle=document.body.getAttribute('data-print-subtitle')||'Libertyville CLC';
      p.textContent=subtitle+' · Printed '+new Date().toLocaleString();
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',makeHeader); else makeHeader();
  window.addEventListener('beforeprint',refresh);
})();
