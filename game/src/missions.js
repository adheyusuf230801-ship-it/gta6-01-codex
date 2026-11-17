import { raiseWanted } from './police.js';
export const STORY=[
  {name:'Borrowed Time', objective:'Steal the teal coupe and deliver it to Mariner Yard.', x:10*220+26,y:6*220+27,kind:'car'},
  {name:'Quiet Waters', objective:'Lose the 3-star heat, then reach the beach pickup.', x:2*220+26,y:7*220+27,kind:'cool'},
  {name:'Night Current', objective:'Deliver the package to Beacon Point before time runs out.', x:11*220+26,y:1*220+27,kind:'timed'},
];
export function missionStep(s,dt) {
  if(s.mission>=STORY.length)return;
  if(s.mission===1){s.missionTimer+=dt;if(s.wanted===0&&Math.hypot(s.player.x-STORY[1].x,s.player.y-STORY[1].y)<60)completeMission(s);return;}
  if(s.mission===2&&s.missionTimer>0){s.missionTimer-=dt;if(s.missionTimer<=0){s.events.push('DELIVERY MISSED');s.missionTimer=0;}}
  const m=STORY[s.mission];
  if(Math.hypot(s.player.x-m.x,s.player.y-m.y)<55 && (s.mission!==0||s.player.vehicle===s.targetCar))completeMission(s);
}
function completeMission(s){const done=s.mission,reward=500+done*300;s.player.cash+=reward;s.completed++;s.events.push('JOB COMPLETE +$'+reward);s.mission++;s.missionTimer=s.mission===2?55:0;if(done===0)raiseWanted(s,3);}
export function startTaxi(s){s.side='taxi-pickup';s.sideTimer=0;s.taxiPin={x:Math.min(2446,Math.floor(s.player.x/220+2)*220+26),y:Math.max(27,Math.floor(s.player.y/220-1)*220+27)};}
export function startRampage(s){s.side='rampage';s.sideTimer=0;s.rampage=0;}
export function updateSide(s,dt){if(!s.side)return;s.sideTimer+=dt;if(s.side==='taxi-pickup'&&s.player.vehicle&&Math.hypot(s.player.x-s.taxiPin.x,s.player.y-s.taxiPin.y)<55){s.side='taxi-dropoff';s.sideTimer=0;s.taxiPin={x:Math.max(26,Math.floor(s.player.x/220-3)*220+26),y:Math.min(1707,Math.floor(s.player.y/220+2)*220+27)};s.events.push('FARE ON BOARD');}else if(s.side==='taxi-dropoff'&&Math.hypot(s.player.x-s.taxiPin.x,s.player.y-s.taxiPin.y)<60){s.player.cash+=450;s.side='';s.events.push('FARE COMPLETE +$450');}else if(s.side==='rampage'&&s.sideTimer>=30){const reward=Math.floor(s.rampage/10)*50;s.player.cash+=reward;s.side='';s.events.push('RAMPAGE BANKED +$'+reward);}else if(s.side.startsWith('taxi')&&s.sideTimer>75){s.side='';s.events.push('FARE LOST');}}
