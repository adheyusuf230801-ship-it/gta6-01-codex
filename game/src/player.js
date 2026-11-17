import { collidesBuilding } from './world.js';
import { raiseWanted } from './police.js';
export function updatePlayer(s, input, dt, fire) {
  const p=s.player;
  if (p.vehicle) return;
  const x=(input.pressed('KeyD')?1:0)-(input.pressed('KeyA')?1:0), y=(input.pressed('KeyS')?1:0)-(input.pressed('KeyW')?1:0);
  const mag=Math.hypot(x,y)||1, speed=input.pressed('ShiftLeft')||input.pressed('ShiftRight')?245:170;
  const nx=p.x+x/mag*speed*dt, ny=p.y+y/mag*speed*dt;
  if (!collidesBuilding(s.city,nx,p.y,10)) p.x=Math.max(8,Math.min(2632,nx));
  if (!collidesBuilding(s.city,p.x,ny,10)) p.y=Math.max(8,Math.min(2170,ny));
  p.angle=Math.atan2(input.mouse.y-input.mouse.height/2,input.mouse.x-input.mouse.width/2);
  if ((input.mouse.down||input.pressed('Space')) && fire) fire();
  if(input.justPressed('KeyF')){
    const target=s.peds.find(v=>v.alive&&Math.hypot(v.x-p.x,v.y-p.y)<30);
    if(target){target.alive=false;if(s.side==='rampage')s.rampage+=50;raiseWanted(s,1);s.events.push('PUNCH CONNECTS');}
  }
  p.invuln=Math.max(0,p.invuln-dt);
}
