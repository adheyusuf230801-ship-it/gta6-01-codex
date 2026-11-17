import { COLORS, CITY, TILE } from './config.js';
import { STORY } from './missions.js';
export function drawHud(ctx,s,w,h,screen='playing'){
  if(screen!=='playing')return;
  const p=s.player,m=STORY[s.mission];ctx.save();ctx.textBaseline='top';ctx.font='bold 15px system-ui';ctx.fillStyle='#102328d9';ctx.fillRect(16,16,310,88);ctx.fillStyle=COLORS.white;ctx.fillText('SOLARA BAY  /  '+(p.vehicle?'ON WHEELS':'ON FOOT'),28,26);
  ctx.fillStyle='#344347';ctx.fillRect(28,50,190,10);ctx.fillStyle=p.health>35?'#66c78b':'#ed715e';ctx.fillRect(28,50,190*Math.max(0,p.health/100),10);ctx.fillStyle=COLORS.white;ctx.fillText('$'+p.cash+'   ♥ '+Math.ceil(p.health)+'   AMMO '+p.ammo,28,68);
  ctx.font='20px system-ui';ctx.fillStyle='#ff6860';ctx.fillText('★ '.repeat(s.wanted)+'☆ '.repeat(5-s.wanted),w-180,22);
  ctx.font='bold 14px system-ui';ctx.fillStyle='#102328e8';ctx.fillRect(w/2-230,16,460,48);ctx.fillStyle=COLORS.gold;ctx.fillText(m?'JOB '+(s.mission+1)+' / '+m.name:'FREE ROAM  /  JOBS COMPLETE',w/2-214,23);ctx.fillStyle=COLORS.white;ctx.font='13px system-ui';ctx.fillText(m?m.objective:'Explore Solara Bay; find fares and hidden gear.',w/2-214,43);
  const mw=184,mh=148,mx=w-mw-18,my=h-mh-18,scale=mw/CITY.width;ctx.fillStyle='#172b2ddd';ctx.fillRect(mx-4,my-4,mw+8,mh+8);ctx.fillStyle=COLORS.grass;ctx.fillRect(mx,my,mw,mh);
  ctx.fillStyle=COLORS.water;ctx.fillRect(mx,my+8*TILE*scale,mw,mh-8*TILE*scale);ctx.fillStyle=COLORS.road;for(let x=0;x<CITY.width;x+=TILE)ctx.fillRect(mx+x*scale,my,TILE*scale,12*scale);for(let y=0;y<CITY.height;y+=TILE)ctx.fillRect(mx,my+y*scale,12*scale,TILE*scale);
  if(m){ctx.fillStyle=COLORS.gold;ctx.beginPath();ctx.arc(mx+m.x*scale,my+m.y*scale,4,0,Math.PI*2);ctx.fill();}
  for(const c of s.cars){ctx.fillStyle=c.kind==='police'?'#ef685a':'#ffe08c';ctx.fillRect(mx+c.x*scale-1,my+c.y*scale-1,3,3);}for(const c of s.footCops){ctx.fillStyle='#7097ee';ctx.fillRect(mx+c.x*scale-1,my+c.y*scale-1,3,3);}
  ctx.fillStyle=COLORS.cyan;ctx.beginPath();ctx.arc(mx+p.x*scale,my+p.y*scale,3,0,Math.PI*2);ctx.fill();
  if(s.side){ctx.fillStyle=COLORS.gold;ctx.font='bold 13px system-ui';ctx.fillText(s.side==='taxi-pickup'?'TAXI: PICK UP CUSTOMER':s.side==='taxi-dropoff'?'TAXI: DRIVE TO DESTINATION':'RAMPAGE  $'+s.rampage,28,122);}
  if(s.events.length){
    const message=s.events[s.events.length-1],bandY=h-112,bandW=Math.max(280,Math.min(620,w-420));
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 16px system-ui';
    ctx.fillStyle='#102328ed';ctx.fillRect((w-bandW)/2,bandY,bandW,32);
    ctx.strokeStyle=COLORS.gold;ctx.lineWidth=2;ctx.strokeRect((w-bandW)/2,bandY,bandW,32);
    ctx.fillStyle=COLORS.gold;ctx.fillText(message,w/2,bandY+16,bandW-32);
  }ctx.restore();
}
