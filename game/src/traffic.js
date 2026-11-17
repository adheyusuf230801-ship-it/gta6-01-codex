import { addCar } from './vehicles.js';
export function seedTraffic(s) {
  for(let i=0;i<18;i++){const col=(i*7)%12,row=(i*11)%8,vertical=i%2===0;addCar(s,col*220+22+(i%3)*5,row*220+90+(i%4)*12,vertical?Math.PI/2:0,'traffic');}
  for(let i=0;i<42;i++){const x=80+s.random()*2480,y=75+s.random()*1680;s.peds.push({x,y,angle:s.random()*Math.PI*2,speed:12+s.random()*14,panic:0,alive:true,color:['#f0d7a0','#a8d4c3','#e79b79','#e0cde5'][i%4]});}
}
export function updateTraffic(s,dt) {
  const p=s.player;
  for(const ped of s.peds){if(!ped.alive)continue; const d=Math.hypot(p.x-ped.x,p.y-ped.y);if(s.wanted&&d<180)ped.panic=1.7;
    if(ped.panic>0){ped.angle=Math.atan2(ped.y-p.y,ped.x-p.x);ped.panic-=dt;}
    else if(s.random()<dt*.35)ped.angle+=(s.random()-.5)*1.3;
    const nx=ped.x+Math.cos(ped.angle)*ped.speed*dt,ny=ped.y+Math.sin(ped.angle)*ped.speed*dt;
    if(!s.city.buildings.some(b=>nx>b.x&&nx<b.x+b.w&&ny>b.y&&ny<b.y+b.h)){ped.x=nx;ped.y=ny;}else ped.angle+=Math.PI*.7;
    if(p.vehicle&&Math.hypot(p.x-ped.x,ped.y-p.y)<24&&Math.abs(p.vehicle.speed)>60){ped.alive=false;s.wantedHeat+=7;if(s.side==='rampage')s.rampage+=100;s.shake=.15;}
  }
}
