import { CITY, STEP, BEST_KEY } from './config.js';
import { createRandom } from './random.js';
import { createGameWorld } from './world.js';
import { createInput } from './input.js';
import { addCar, updateCars } from './vehicles.js';
import { seedTraffic, updateTraffic } from './traffic.js';
import { raiseWanted, updatePolice } from './police.js';
import { shoot, updateCombat } from './combat.js';
import { missionStep, startRampage, startTaxi, updateSide } from './missions.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { createAudio } from './audio.js';
import { updatePlayer } from './player.js';

const params=new URLSearchParams(location.search),seed=Number(params.get('seed'))||1;
const canvas=document.querySelector('#game'),renderer=createRenderer(canvas),input=createInput(canvas),audio=createAudio();
let best=0;try{best=Number(localStorage.getItem(BEST_KEY))||0;}catch{}
let s=createGameWorld(seed,createRandom(seed));seedTraffic(s);s.targetCar=addCar(s,s.player.x-40,s.player.y,0,'civilian');s.targetCar.color='#50cfc1';for(let i=0;i<8;i++)addCar(s,230+i*290,70+(i%4)*440,0,'civilian');
let screen=params.has('shot')?'playing':'title';
if(params.has('shot')){const staged=stageShot(params.get('shot'),s);screen=staged.screen;requestAnimationFrame(()=>{renderer.draw(s,screen,best);requestAnimationFrame(()=>{renderer.draw(s,screen,best);window.__shotReady=true;});});}
let last=performance.now(),acc=0,fireCooldown=0;
function step(dt){s.time+=dt;s.shake=Math.max(0,s.shake-dt);fireCooldown=Math.max(0,fireCooldown-dt);
 const fire=()=>{if(fireCooldown<=0&&s.player.ammo>0){shoot(s,Math.atan2(input.mouse.y-input.mouse.height/2,input.mouse.x-input.mouse.width/2));audio.shot();fireCooldown=.24;}};
 updatePlayer(s,input,dt,fire);updateCars(s,input,dt,n=>raiseWanted(s,n));updateTraffic(s,dt);updatePolice(s,dt,c=>{s.bullets.push({x:c.x,y:c.y,vx:(s.player.x-c.x)*1.6,vy:(s.player.y-c.y)*1.6,life:1,owner:c});});updateCombat(s,dt);missionStep(s,dt);updateSide(s,dt);
 for(const q of s.particles)q.life-=dt;s.particles=s.particles.filter(q=>q.life>0);for(const skid of s.skids)skid.life-=dt;s.skids=s.skids.filter(skid=>skid.life>0);
 for(const pickup of s.pickups)if(!pickup.taken&&Math.hypot(s.player.x-pickup.x,s.player.y-pickup.y)<25){pickup.taken=true;s.player.ammo+=24;s.events.push('PISTOL + 24 ROUNDS');audio.blip();}
 if(s.player.health<=0)screen='gameover';if(s.player.cash>best){best=s.player.cash;try{localStorage.setItem(BEST_KEY,String(best));}catch{}}
 audio.engine(s.player.vehicle?.speed||0);if(s.wanted>0&&Math.floor(s.time*2)%4===0&&Math.floor((s.time-dt)*2)%4!==0)audio.siren();
}
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.1,(now-last)/1000);last=now;if(screen==='playing'){acc+=dt;while(acc>=STEP){step(STEP);acc-=STEP;}}else acc=0;if(input.justPressed('KeyP')||input.justPressed('Escape'))screen=screen==='playing'?'paused':screen==='paused'?'playing':screen;if(screen==='title'&&input.takeClick()){screen='playing';audio.unlock();}if(input.justPressed('Enter')){if(screen==='title'){screen='playing';audio.unlock();}else if(screen==='gameover')location.reload();}if(input.justPressed('KeyT')){if(!s.side)startTaxi(s);else s.side='';}if(input.justPressed('KeyR')&&!s.side)startRampage(s);if(input.justPressed('KeyM'))audio.toggleMuted();renderer.draw(s,screen,best);}
if(!params.has('shot'))requestAnimationFrame(loop);
