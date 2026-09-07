
(function(){
const seqs={
 oracle:Array.from({length:20},(_,i)=>({path:`oracle/episode-${String(i+1).padStart(2,'0')}.html`,title:`Oracle Episode ${String(i+1).padStart(2,'0')}`})),
 archetypes:[1,2,3].map(i=>({path:`archetypes/issue-${String(i).padStart(2,'0')}.html`,title:`Archetypes Issue ${i}`})),
 laundry:[
  {path:'acad/laundry-list.html',title:'The Laundry List'},
  {path:'acad/other-laundry-list.html',title:'The Other Laundry List'},
  {path:'acad/flip-side-laundry-list.html',title:'The Flip Side of the Laundry List'},
  {path:'acad/flip-side-other-laundry-list.html',title:'The Flip Side of the Other Laundry List'}],
 acad:[
  {path:'acad/tonys-steps.html',title:'Tony’s Steps'},
  {path:'acad/aca-12-steps.html',title:'ACAD 12 Steps'},
  {path:'acad/problem.html',title:'The Problem'},
  {path:'acad/solution.html',title:'The Solution'},
  {path:'acad/promises.html',title:'The Promises'},
  {path:'acad/laundry-lists.html',title:'Laundry Lists'},
  {path:'acad/12-traditions.html',title:'12 Traditions'},
  {path:'acad/bill-of-rights.html',title:'Bill of Rights'},
  {path:'acad/daily-meditation.html',title:'Daily Meditation'},
  {path:'newcomers.html',title:'Newcomer Guide'},
  {path:'seventh-tradition.html',title:'Seventh Tradition'}],
 resources:[
  {path:'https://drive.google.com/open?id=1v17Q0tTIf3ypSqQBg4QXDC7vwUYVwMGS&usp=drive_fs',title:'Newcomer Guide'},
  {path:'https://drive.google.com/file/d/1h1b1BmFaBXVh4q_QKH0tlmDndHkmh_1z/view?usp=drivesdk',title:'LSWG'},
  {path:'https://drive.google.com/open?id=1dp0ArVLCTxRIpNUpOGhRe0-bKW02h1am&usp=drive_fs',title:'LSWCJ'},
  {path:'archetypes.html',title:'Archetypes Newsletter'},
  {path:'brotherhood-prayer.html',title:'Tribe Brotherhood Prayer'},
  {path:'serenity-prayer.html',title:'Serenity Prayer'},
  {path:'https://drive.google.com/open?id=1smfeT1aa8hj4YgbUt80KOpEtwU6ZC3e4&usp=drive_fs',title:'New Hope Beginners Guide'},
  {path:'https://drive.google.com/open?id=1u-MuyyZ9mAEBAIBRho2xbSt5HsKIoVAx&usp=drive_fs',title:"Tony A's 12 Step Workbook"},
  {path:'https://drive.google.com/open?id=1xQhYxlE9FjEm1b3ZHBnUoKpNVH1fU_7F&usp=drive_fs',title:'The Meetings List'},
  {path:'meetings.html?view=acad-all',title:'Find All ACAD Meetings'}]
};
function clean(p){return decodeURIComponent((p||'').replace(/^.*?\/site\//,'').replace(/^\/+/,''));}
const current=clean(location.pathname);let seq=null,idx=-1;
for(const key of ['oracle','archetypes','laundry','acad','resources']){const i=seqs[key].findIndex(x=>current.endsWith(x.path));if(i>=0){seq=seqs[key];idx=i;break}}
if(!seq||seq.length<2)return;
const prev=seq[(idx-1+seq.length)%seq.length],next=seq[(idx+1)%seq.length];
const depth=(current.match(/\//g)||[]).length;const rootPrefix='../'.repeat(depth);
const href=x=>/^(?:https?:|mailto:|#)/.test(x.path)?x.path:rootPrefix+x.path;
const nav=document.createElement('nav');nav.className='ttob-floating-sequence-nav is-near-top';nav.setAttribute('aria-label','Previous and next library item');
nav.innerHTML=`<a class="ttob-floating-sequence-link" data-dir="prev" href="${href(prev)}" title="Previous: ${prev.title}" aria-label="Previous: ${prev.title}">←<span class="sr-only">Previous: ${prev.title}</span></a><a class="ttob-floating-sequence-link" data-dir="next" href="${href(next)}" title="Next: ${next.title}" aria-label="Next: ${next.title}">→<span class="sr-only">Next: ${next.title}</span></a>`;
document.body.appendChild(nav);
const stop=document.querySelector('.reading-nav')||document.querySelector('.episode-nav')||document.querySelector('.reading-bottom-actions')||document.querySelector('.reading-actions')||document.querySelector('.reading-footer')||document.querySelector('.copyright-footer')||document.querySelector('footer');
let raf=0;
function update(){raf=0;nav.classList.toggle('is-near-top',scrollY<180);if(!stop)return;const h=(innerWidth<=760?46:58);const gap=92;const stopDoc=stop.getBoundingClientRect().top+scrollY-gap-h;const fixedDoc=scrollY+innerHeight-(innerWidth<=760?82:74)-h;if(fixedDoc>=stopDoc){nav.classList.add('is-parked');nav.style.top=Math.max(0,stopDoc)+'px';nav.style.bottom='auto'}else{nav.classList.remove('is-parked');nav.style.top='';nav.style.bottom=''}}
function request(){if(!raf)raf=requestAnimationFrame(update)}addEventListener('scroll',request,{passive:true});addEventListener('resize',request);update();
})();
