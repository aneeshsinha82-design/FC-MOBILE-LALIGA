const tableBody=document.getElementById('table');
const panel=document.querySelector('.standings-panel');

const formFromStats=t=>{
  const played=[];
  for(let i=0;i<t.w;i++)played.push('W');
  for(let i=0;i<t.d;i++)played.push('D');
  for(let i=0;i<t.l;i++)played.push('L');
  played.sort(()=>Math.random()-.5);
  return [...played.slice(-5),...Array(Math.max(0,5-played.length)).fill('-')];
};

fetch('data.json')
.then(r=>{if(!r.ok)throw new Error('Data unavailable');return r.json()})
.then(teams=>{
  teams.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.team.localeCompare(b.team));
  tableBody.innerHTML=teams.map((t,i)=>{
    const form=formFromStats(t).map((x,n)=>{
      const cls=x==='W'?'win':x==='D'?'draw':x==='L'?'loss':'none';
      const icon=x==='W'?'✓':x==='D'?'–':x==='L'?'×':'·';
      return '<b class="'+cls+'" style="animation-delay:'+((i*0.08)+(n*0.07)+0.25)+'s">'+icon+'</b>';
    }).join('');
    return '<tr class="'+(i===0?'first rank-top':'')+'"><td class="position">'+(i+1)+'</td><td class="club-col"><span class="badge">'+t.team.slice(0,2)+'</span>'+t.team+'</td><td>'+t.p+'</td><td>'+t.w+'</td><td>'+t.d+'</td><td>'+t.l+'</td><td>'+t.gf+'</td><td>'+t.ga+'</td><td>'+t.gd+'</td><td class="points">'+t.pts+'</td><td><div class="form">'+form+'</div></td></tr>';
  }).join('');
  requestAnimationFrame(()=>panel.classList.add('visible'));
})
.catch(()=>{tableBody.innerHTML='<tr><td colspan="11">Unable to load standings.</td></tr>';panel.classList.add('visible')});

document.addEventListener('mousemove',e=>{
  const x=(e.clientX/window.innerWidth-.5)*10;
  const y=(e.clientY/window.innerHeight-.5)*10;
  document.querySelector('.hero-copy').style.transform='translate('+x*.35+'px,'+y*.25+'px)';
  document.querySelector('.ball-one').style.marginLeft=x*.6+'px';
  document.querySelector('.ball-two').style.marginRight=x*.45+'px';
});

window.addEventListener('scroll',()=>{
  const progress=Math.min(window.scrollY/(window.innerHeight*.7),1);
  document.querySelector('.hero-copy').style.opacity=String(1-progress*.7);
  document.querySelector('.hero-copy').style.filter='blur('+progress*3+'px)';
},{passive:true});