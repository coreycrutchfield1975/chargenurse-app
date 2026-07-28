(function(){
'use strict';

var KEY='clcAppearanceV3';
var LEGACY_KEY='clcAppearanceV2';
var OLDEST_KEY='clcAppearanceV1';
var defaults={
  source:'',
  name:'Page Default',
  overlay:42,
  fit:'cover',
  position:'center center',
  blur:0,
  panelOpacity:94
};

var builtIns=[
  {name:'Page Default',source:'',group:'Neutral'},
  {name:'Clinical Operations',source:'backgrounds/defaults/futuristic-nurse-operations-center.png',group:'Command Center'},
  {name:'Medical Command',source:'backgrounds/defaults/medical-command-center-red-blue.png',group:'Command Center'},
  {name:'Lotus Serenity',source:'backgrounds/defaults/lotus-serenity.png',group:'Calm'},
  {name:'Patriotic Hospital',source:'backgrounds/patriotic-hospital.png',group:'Veterans'},
  {name:'Patriotic Watercolor',source:'backgrounds/patriotic-watercolor.png',group:'Veterans'},
  {name:'Patriotic Stethoscope',source:'backgrounds/patriotic-stethoscope.png',group:'Veterans'},
  {name:'Pink Heart',source:'backgrounds/pink heart and background.png',group:'Warm'},
  {name:'Blue Heart',source:'backgrounds/blue heart.png',group:'Calm'},
  {name:'Nature Lake',source:'backgrounds/pexels-clickerhappy-584420.jpg',group:'Nature'}
];

function parse(value,fallback){
  try{return value?JSON.parse(value):fallback}catch(e){return fallback}
}
function migrate(){
  if(localStorage.getItem(KEY))return;
  var old=parse(localStorage.getItem(LEGACY_KEY),null)||parse(localStorage.getItem(OLDEST_KEY),null);
  if(old)localStorage.setItem(KEY,JSON.stringify(Object.assign({},defaults,old)));
}
function get(){
  migrate();
  return Object.assign({},defaults,parse(localStorage.getItem(KEY),{}));
}
function save(values){
  localStorage.setItem(KEY,JSON.stringify(Object.assign({},get(),values||{})));
  apply();
}
function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0))}
function clearBodyBackground(body){
  body.style.removeProperty('background-image');
  body.style.removeProperty('background-size');
  body.style.removeProperty('background-position');
  body.style.removeProperty('background-attachment');
  body.style.removeProperty('background-repeat');
}
function safeSource(source){
  source=String(source||'').trim();
  if(!source)return '';
  if(/^data:image\/(png|jpeg|webp);base64,/i.test(source)||/^blob:/i.test(source))return source;
  try{return new URL(source,document.baseURI).href}catch(e){return source}
}
function setBackground(body,a,source){
  var shade=clamp(a.overlay,0,90)/100;
  body.style.backgroundImage='linear-gradient(rgba(12,20,25,'+shade+'),rgba(12,20,25,'+shade+')),url("'+String(source).replace(/"/g,'%22')+'")';
  body.style.backgroundSize=a.fit||'cover';
  body.style.backgroundPosition=a.position||'center center';
  body.style.backgroundAttachment='fixed';
  body.style.backgroundRepeat='no-repeat';
  document.documentElement.dataset.customBackground='true';
  requestAnimationFrame(function(){document.documentElement.classList.add('clc-bg-ready')});
}
function apply(){
  var a=get(),body=document.body;
  if(!body)return;

  document.documentElement.style.setProperty('--clc-panel-opacity',String(clamp(a.panelOpacity,55,100)/100));
  document.documentElement.style.setProperty('--clc-bg-blur',clamp(a.blur,0,10)+'px');
  document.documentElement.classList.remove('clc-bg-error');

  if(a.source){
    var resolved=safeSource(a.source),img=new Image();
    document.documentElement.classList.remove('clc-bg-ready');
    img.onload=function(){setBackground(body,a,resolved)};
    img.onerror=function(){
      clearBodyBackground(body);
      document.documentElement.dataset.customBackground='false';
      document.documentElement.classList.add('clc-bg-error','clc-bg-ready');
      console.warn('ChargeNurse background could not be loaded:',a.source);
      window.dispatchEvent(new CustomEvent('clcbackgrounderror',{detail:{source:a.source}}));
    };
    img.src=resolved;
  }else{
    clearBodyBackground(body);
    document.documentElement.dataset.customBackground='false';
    document.documentElement.classList.add('clc-bg-ready');
  }

  window.dispatchEvent(new CustomEvent('clcappearancechange',{detail:a}));
}
function reset(){
  localStorage.removeItem(KEY);
  apply();
  refreshPanel();
}
function esc(value){
  return String(value||'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function ensureStyles(){
  if(document.getElementById('clcAppearanceStyles'))return;
  var style=document.createElement('style');
  style.id='clcAppearanceStyles';
  style.textContent=`
    :root{--clc-panel-opacity:.94;--clc-bg-blur:0px}\n    html{background:#e8eeeb} body{opacity:.01;transition:opacity .34s ease,background-color .34s ease} html.clc-bg-ready body{opacity:1}\n    html.clc-bg-error body:before{content:"Selected background unavailable — page default restored";position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:10000;background:#7f2630;color:#fff;padding:8px 12px;border-radius:999px;font:800 11px system-ui,sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.22);animation:clcNotice 5s both}\n    @keyframes clcNotice{0%{opacity:0;transform:translate(-50%,-8px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
    [data-custom-background="true"] .panel,
    [data-custom-background="true"] .clock,
    [data-custom-background="true"] .metric,
    [data-custom-background="true"] .card,
    [data-custom-background="true"] .glass{
      background-color:rgba(255,253,249,var(--clc-panel-opacity))!important;
      backdrop-filter:blur(var(--clc-bg-blur));
    }
    .clc-appearance-launcher{
      position:fixed;right:18px;bottom:18px;z-index:9998;
      border:1px solid rgba(255,255,255,.28);background:#243e4c;color:#fff;
      border-radius:999px;padding:11px 15px;font:800 12px/1 system-ui,sans-serif;
      box-shadow:0 12px 34px rgba(0,0,0,.24);cursor:pointer
    }
    .clc-appearance-launcher:hover{transform:translateY(-1px)}
    .clc-appearance-backdrop{
      display:none;position:fixed;inset:0;z-index:9999;background:rgba(10,18,23,.72);
      align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(5px)
    }
    .clc-appearance-backdrop.show{display:flex}
    .clc-appearance-panel{
      width:min(980px,100%);max-height:94vh;overflow:auto;background:#fffdf9;color:#17222b;
      border-radius:24px;box-shadow:0 32px 90px rgba(0,0,0,.38);padding:22px;
      font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif
    }
    .clc-appearance-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
    .clc-appearance-header h2{margin:0;font-size:28px;letter-spacing:-.03em}
    .clc-appearance-header p{margin:6px 0 0;color:#66737d;line-height:1.45}
    .clc-close{border:1px solid #d8d2c8;background:#fff;border-radius:11px;padding:8px 10px;cursor:pointer}
    .clc-appearance-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-top:18px}
    .clc-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .clc-bg-choice{border:2px solid transparent;border-radius:15px;overflow:hidden;background:#f3f0e9;cursor:pointer;text-align:left;padding:0}
    .clc-bg-choice.active{border-color:#2f7d78;box-shadow:0 0 0 3px rgba(47,125,120,.15)}
    .clc-bg-choice img,.clc-bg-swatch{display:block;width:100%;height:92px;object-fit:cover;background:linear-gradient(145deg,#ece9e2,#d6dedb)}
    .clc-bg-choice span{display:block;padding:8px 9px;font:800 11px system-ui,sans-serif;color:#34434c}
    .clc-settings{display:grid;gap:12px}
    .clc-field{display:grid;gap:5px}
    .clc-field label{font:850 11px system-ui,sans-serif;color:#52616a}
    .clc-field input,.clc-field select{width:100%;border:1px solid #cec7bc;border-radius:10px;padding:10px;background:#fff;color:#17222b}
    .clc-range-row{display:grid;grid-template-columns:1fr 48px;gap:8px;align-items:center}
    .clc-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
    .clc-btn{border:1px solid #d8d2c8;background:#fff;color:#34434c;border-radius:11px;padding:9px 11px;font:800 11px system-ui,sans-serif;cursor:pointer}
    .clc-btn.primary{background:#2f7d78;color:#fff;border-color:#2f7d78}
    .clc-btn.danger{background:#b83c45;color:#fff;border-color:#b83c45}
    .clc-note{font-size:10px;line-height:1.45;color:#6d7478;background:#f4f1eb;border-radius:11px;padding:10px}
    .clc-preview{height:128px;border-radius:16px;border:1px solid #d8d2c8;background:#ece9e2 center/cover no-repeat;position:relative;overflow:hidden}
    .clc-preview:after{content:"Preview";position:absolute;left:10px;bottom:9px;background:rgba(0,0,0,.58);color:#fff;padding:5px 8px;border-radius:999px;font:800 9px system-ui,sans-serif}
    @media(max-width:760px){
      .clc-appearance-grid{grid-template-columns:1fr}.clc-gallery{grid-template-columns:repeat(2,1fr)}
      .clc-appearance-launcher{right:10px;bottom:10px}
    }
    @media(prefers-reduced-motion:reduce){body{transition:none!important}.clc-appearance-launcher{transition:none!important}}\n    @media print{body{opacity:1!important}.clc-appearance-launcher,.clc-appearance-backdrop{display:none!important}}
  `;
  document.head.appendChild(style);
}
function buildPanel(){
  ensureStyles();
  if(document.getElementById('clcAppearanceBackdrop'))return;

  var launcher=document.createElement('button');
  launcher.className='clc-appearance-launcher';
  launcher.type='button';
  launcher.textContent='Appearance';
  launcher.onclick=openPanel;
  document.body.appendChild(launcher);

  var backdrop=document.createElement('div');
  backdrop.id='clcAppearanceBackdrop';
  backdrop.className='clc-appearance-backdrop';
  backdrop.innerHTML=`
    <section class="clc-appearance-panel" role="dialog" aria-modal="true" aria-labelledby="clcAppearanceTitle">
      <div class="clc-appearance-header">
        <div>
          <h2 id="clcAppearanceTitle">Appearance</h2>
          <p>Choose a built-in background, enter a project image path, or upload a personal image stored only in this browser.</p>
        </div>
        <button class="clc-close" type="button" id="clcAppearanceClose">Close</button>
      </div>
      <div class="clc-appearance-grid">
        <div>
          <div class="clc-gallery" id="clcAppearanceGallery"></div>
        </div>
        <div class="clc-settings">
          <div class="clc-preview" id="clcAppearancePreview"></div>
          <div class="clc-field">
            <label>Project image path</label>
            <input id="clcAppearancePath" placeholder="backgrounds/custom/my-background.jpg">
          </div>
          <div class="clc-actions">
            <button class="clc-btn primary" type="button" id="clcUsePath">Use Project Image</button>
            <button class="clc-btn" type="button" id="clcUploadButton">Upload Personal Image</button>
            <input id="clcUploadInput" type="file" accept="image/png,image/jpeg,image/webp" hidden>
          </div>
          <div class="clc-field">
            <label>Dark overlay</label>
            <div class="clc-range-row">
              <input id="clcOverlay" type="range" min="0" max="90" step="1">
              <span id="clcOverlayValue"></span>
            </div>
          </div>
          <div class="clc-field">
            <label>Panel opacity</label>
            <div class="clc-range-row">
              <input id="clcPanelOpacity" type="range" min="60" max="100" step="1">
              <span id="clcPanelOpacityValue"></span>
            </div>
          </div>
          <div class="clc-field">
            <label>Image fit</label>
            <select id="clcFit"><option value="cover">Cover</option><option value="contain">Contain</option><option value="100% 100%">Stretch</option><option value="auto">Original size</option></select>
          </div>
          <div class="clc-field">
            <label>Image position</label>
            <select id="clcPosition">
              <option value="center center">Center</option><option value="center top">Top</option>
              <option value="center bottom">Bottom</option><option value="left center">Left</option>
              <option value="right center">Right</option>
            </select>
          </div>
          <div class="clc-actions">
            <button class="clc-btn danger" type="button" id="clcResetAppearance">Reset to Page Default</button>
          </div>
          <div class="clc-note">
            Permanent shared images belong in <b>backgrounds/custom/</b> and are referenced by path.
            Personal uploads remain only in this browser. Do not use images containing Veteran information or other PHI.
          </div>
        </div>
      </div>
    </section>
  `;
  document.body.appendChild(backdrop);

  backdrop.addEventListener('click',function(e){if(e.target===backdrop)closePanel()});
  document.getElementById('clcAppearanceClose').onclick=closePanel;
  document.getElementById('clcUsePath').onclick=function(){
    var path=document.getElementById('clcAppearancePath').value.trim();
    if(!path){alert('Enter an image path, such as backgrounds/custom/my-background.jpg');return}
    save({source:path,name:'Project Image'});
    refreshPanel();
  };
  document.getElementById('clcUploadButton').onclick=function(){document.getElementById('clcUploadInput').click()};
  document.getElementById('clcUploadInput').onchange=function(e){
    var file=e.target.files&&e.target.files[0];
    if(!file)return;
    if(!/^image\/(png|jpeg|webp)$/.test(file.type)){alert('Use a JPG, PNG, or WEBP image.');return}
    var reader=new FileReader();
    reader.onload=function(){
      save({source:reader.result,name:file.name});
      refreshPanel();
    };
    reader.readAsDataURL(file);
    e.target.value='';
  };
  document.getElementById('clcOverlay').oninput=function(){
    document.getElementById('clcOverlayValue').textContent=this.value+'%';
    save({overlay:Number(this.value)});
    updatePreview();
  };
  document.getElementById('clcPanelOpacity').oninput=function(){
    document.getElementById('clcPanelOpacityValue').textContent=this.value+'%';
    save({panelOpacity:Number(this.value)});
  };
  document.getElementById('clcFit').onchange=function(){save({fit:this.value});updatePreview()};
  document.getElementById('clcPosition').onchange=function(){save({position:this.value});updatePreview()};
  document.getElementById('clcResetAppearance').onclick=function(){reset()};
}
function renderGallery(){
  var gallery=document.getElementById('clcAppearanceGallery');
  if(!gallery)return;
  var current=get();
  gallery.innerHTML=builtIns.map(function(item){
    var active=current.source===item.source;
    var media=item.source?'<img src="'+esc(item.source)+'" alt="">':'<span class="clc-bg-swatch"></span>';
    return '<button type="button" class="clc-bg-choice '+(active?'active':'')+'" data-source="'+esc(item.source)+'" data-name="'+esc(item.name)+'">'+media+'<span>'+esc(item.name)+'</span></button>';
  }).join('');
  gallery.querySelectorAll('.clc-bg-choice').forEach(function(button){
    button.onclick=function(){
      save({source:this.dataset.source,name:this.dataset.name});
      refreshPanel();
    };
  });
}
function updatePreview(){
  var preview=document.getElementById('clcAppearancePreview');
  if(!preview)return;
  var a=get();
  if(a.source){
    var shade=clamp(a.overlay,0,90)/100;
    preview.style.backgroundImage='linear-gradient(rgba(12,20,25,'+shade+'),rgba(12,20,25,'+shade+')),url("'+String(a.source).replace(/"/g,'%22')+'")';
    preview.style.backgroundSize=a.fit||'cover';
    preview.style.backgroundPosition=a.position||'center center';
  }else{
    preview.style.backgroundImage='linear-gradient(145deg,#ece9e2,#d6dedb)';
  }
}
function refreshPanel(){
  if(!document.getElementById('clcAppearanceBackdrop'))return;
  var a=get();
  renderGallery();
  document.getElementById('clcAppearancePath').value=(a.source&&a.source.indexOf('data:')!==0)?a.source:'';
  document.getElementById('clcOverlay').value=a.overlay;
  document.getElementById('clcOverlayValue').textContent=a.overlay+'%';
  document.getElementById('clcPanelOpacity').value=a.panelOpacity;
  document.getElementById('clcPanelOpacityValue').textContent=a.panelOpacity+'%';
  document.getElementById('clcFit').value=a.fit;
  document.getElementById('clcPosition').value=a.position;
  updatePreview();
}
function openPanel(){
  buildPanel();
  refreshPanel();
  document.getElementById('clcAppearanceBackdrop').classList.add('show');
}
function closePanel(){
  var panel=document.getElementById('clcAppearanceBackdrop');
  if(panel)panel.classList.remove('show');
}

window.CLCAppearance={
  key:KEY,
  get:get,
  save:save,
  apply:apply,
  reset:reset,
  open:openPanel,
  close:closePanel,
  builtIns:builtIns.slice()
};

function init(){
  apply();
  buildPanel();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();