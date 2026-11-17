import { collidesBuilding, inRoad } from './world.js';
export function addCar(s,x,y,angle=0,kind='civilian') { const c={x,y,angle,speed:0,health:100,maxHealth:100,kind,color:['#e25f4d','#50a6a3','#e9c466','#d8e1d4','#bf6b4e'][Math.floor(s.random()*5)],occupied:false}; s.cars.push(c); return c; }
export function updateCars(s,input,dt,crime) {
  const p=s.player, c=p.vehicle;
  for(const car of s.cars) {
    if(car===c) {
      const gas=(input.pressed('KeyW')?1:0)-(input.pressed('KeyS')?1:0);
      car.speed=Math.max(-100,Math.min(380,car.speed+gas*260*dt-(gas?0:car.speed*0.8*dt)));
      car.angle+=((input.pressed('KeyD')?1:0)-(input.pressed('KeyA')?1:0))*Math.min(1,Math.abs(car.speed)/95)*2.35*dt;
      const nx=car.x+Math.cos(car.angle)*car.speed*dt, ny=car.y+Math.sin(car.angle)*car.speed*dt;
      if(collidesBuilding(s.city,nx,ny,19)){car.health-=Math.abs(car.speed)*.07; car.speed*=-.28; s.shake=.28; s.particles.push({x:car.x,y:car.y,life:.4,color:'#f1c45c'}); if(car.health<=0){p.vehicle=null; car.occupied=false; car.speed=0; crime(1);} }
      else { car.x=nx;car.y=ny; }
      if(input.pressed('Space')) { if(Math.abs(car.speed)>85&&s.random()<dt*4){s.skids.push({x:car.x-Math.cos(car.angle)*9,y:car.y-Math.sin(car.angle)*9,angle:car.angle,life:7});if(s.skids.length>120)s.skids.shift();} car.speed*=Math.max(0,1-3*dt); }
    } else if(car.kind==='traffic') {
      car.speed=car.speed||55; car.x+=Math.cos(car.angle)*car.speed*dt;car.y+=Math.sin(car.angle)*car.speed*dt;
      if(!inRoad(car.x,car.y)||car.x<10||car.y<10||car.x>2630||car.y>2190) { car.angle+=Math.PI/2; car.speed=48; }
    }
  }
  if(!c && input.justPressed('KeyE')) {
    const near=s.cars.find(v=>!v.occupied&&Math.hypot(v.x-p.x,v.y-p.y)<42);
    if(near){p.vehicle=near;near.occupied=true;p.x=near.x;p.y=near.y;if(near.kind!=='player')crime(1);near.kind='player';}
  } else if(c && input.justPressed('KeyE')) { c.occupied=false;p.vehicle=null;p.x=c.x+Math.cos(c.angle+1.5)*27;p.y=c.y+Math.sin(c.angle+1.5)*27;c.speed*=.5; }
  if(c){p.x=c.x;p.y=c.y;p.angle=c.angle;}
}
