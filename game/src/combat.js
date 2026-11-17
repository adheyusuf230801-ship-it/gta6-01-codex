import { raiseWanted } from './police.js';
export function shoot(s,aim,origin=s.player){if(s.player.ammo<=0)return;s.player.ammo--;s.bullets.push({x:origin.x+Math.cos(aim)*20,y:origin.y+Math.sin(aim)*20,vx:Math.cos(aim)*560,vy:Math.sin(aim)*560,life:.65,owner:origin});s.particles.push({x:origin.x+Math.cos(aim)*23,y:origin.y+Math.sin(aim)*23,life:.11,color:'#ffd17a'});raiseWanted(s,1);s.events=s.events.slice(-5);}
export function updateCombat(s,dt){for(const b of s.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.owner?.kind==='police'&&!s.player.vehicle&&s.player.invuln<=0&&Math.hypot(s.player.x-b.x,s.player.y-b.y)<13){s.player.health-=12;s.player.invuln=.42;b.life=-1;s.particles.push({x:b.x,y:b.y,life:.25,color:'#ff734e'});}
  for(const c of [...s.cops,...s.footCops]){if(c.health>0&&Math.hypot(c.x-b.x,c.y-b.y)<21){c.health-=34;b.life=-1;s.particles.push({x:b.x,y:b.y,life:.2,color:'#ff734e'});}}
  for(const ped of s.peds){if(ped.alive&&Math.hypot(ped.x-b.x,ped.y-b.y)<10){ped.alive=false;b.life=-1;raiseWanted(s,1);}}
}s.bullets=s.bullets.filter(b=>b.life>0);}
