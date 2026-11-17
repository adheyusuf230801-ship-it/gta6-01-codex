import { addCar } from './vehicles.js';
import { raiseWanted } from './police.js';
export function stageShot(name,s){const p=s.player;
  if(name==='start')return {screen:'title'};
  if(name==='mission'){s.mission=0;p.x=5*220+85;p.y=5*220+27;p.angle=0;s.targetCar=addCar(s,p.x+48,p.y+7,0,'civilian');s.targetCar.color='#50cfc1';s.events.push('JOB ACCEPTED: BORROWED TIME');}
  if(name==='drive'){p.x=5*220+110;p.y=5*220+27;p.angle=0;p.vehicle=addCar(s,p.x,p.y,0,'player');p.vehicle.occupied=true;p.vehicle.speed=220;for(let i=0;i<5;i++)addCar(s,p.x+230+i*95,p.y+(i%3-1)*32,Math.PI,'traffic');for(let i=0;i<6;i++)s.skids.push({x:p.x-35-i*27,y:p.y+(i%2?13:-13),angle:0,life:5});}
  if(name==='chase'){p.x=6*220;p.y=4*220;p.angle=0;p.vehicle=addCar(s,p.x,p.y,0,'player');p.vehicle.occupied=true;p.vehicle.speed=150;raiseWanted(s,3);s.wanted=3;for(let i=0;i<3;i++){const c=addCar(s,p.x-92-i*74,p.y+(i-1)*31,0,'police');c.angle=0;s.cops.push(c);}s.mission=0;s.events.push('POLICE PURSUIT - 3 STAR ALERT');}
  return {screen:'playing'};
}
