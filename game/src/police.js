import { addCar } from './vehicles.js';
export function raiseWanted(s,amount=1){s.wanted=Math.min(5,s.wanted+amount);s.wantedHeat=18;s.events.push('POLICE ALERT');s.events=s.events.slice(-5);}
export function updatePolice(s,dt,shoot) {
  if(s.wantedHeat>0)s.wantedHeat-=dt;else if(s.wanted>0&&s.random()<dt*.08)s.wanted--;
  s.cops=s.cops.filter(c=>c.health>0);
  if(s.cops.length>s.wanted*2){const removed=s.cops.splice(s.wanted*2);s.cars=s.cars.filter(car=>!removed.includes(car));}
  while(s.cops.length<s.wanted*2){const a=s.random()*Math.PI*2,d=420+s.random()*220;const c=addCar(s,Math.max(30,Math.min(2610,s.player.x+Math.cos(a)*d)),Math.max(30,Math.min(2170,s.player.y+Math.sin(a)*d)),a,'police');s.cops.push(c);}
  s.footCops=s.footCops.filter(c=>c.health>0);
  if(s.footCops.length>s.wanted)s.footCops.length=s.wanted;
  while(s.footCops.length<s.wanted){const a=s.random()*Math.PI*2,d=170+s.random()*100;s.footCops.push({x:Math.max(25,Math.min(2615,s.player.x+Math.cos(a)*d)),y:Math.max(25,Math.min(2150,s.player.y+Math.sin(a)*d)),health:100,angle:a,kind:'police'});}
  for(const c of s.cops){const p=s.player,angle=Math.atan2(p.y-c.y,p.x-c.x),d=Math.hypot(p.x-c.x,p.y-c.y);c.angle=angle;c.speed=Math.min(145,c.speed+35*dt);c.x+=Math.cos(angle)*c.speed*dt;c.y+=Math.sin(angle)*c.speed*dt;
    if(d<265&&s.random()<dt*.5)shoot(c);
    if(d<30&&!p.vehicle&&p.invuln<=0){p.health-=12*dt;p.invuln=.5;}
  }
  for(const c of s.footCops){const p=s.player,angle=Math.atan2(p.y-c.y,p.x-c.x),d=Math.hypot(p.x-c.x,p.y-c.y);c.angle=angle;c.x+=Math.cos(angle)*72*dt;c.y+=Math.sin(angle)*72*dt;if(d<210&&s.random()<dt*.7)shoot(c);if(d<22&&!p.vehicle&&p.invuln<=0){p.health-=9;p.invuln=.6;}}
}
