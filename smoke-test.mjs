import assert from 'node:assert/strict';
import { createCity, createGameWorld } from './game/src/world.js';
import { createRandom } from './game/src/random.js';
import { STORY, missionStep } from './game/src/missions.js';
import { raiseWanted, updatePolice } from './game/src/police.js';
import { stageShot } from './game/src/shots.js';
import { startRampage, startTaxi, updateSide } from './game/src/missions.js';

const first = createCity(createRandom(73));
const second = createCity(createRandom(73));
assert.equal(JSON.stringify(first), JSON.stringify(second), 'same seed must build the same city');

const missionWorld = createGameWorld(73, createRandom(73));
missionWorld.player.vehicle = {};
missionWorld.targetCar = missionWorld.player.vehicle;
missionWorld.player.x = STORY[0].x;
missionWorld.player.y = STORY[0].y;
missionStep(missionWorld, 1 / 60);
assert.equal(missionWorld.mission, 1);
assert.equal(missionWorld.player.cash, 850, 'first job must pay its listed reward');
assert.equal(missionWorld.wanted, 3);
missionWorld.wanted = 0;
missionWorld.player.x = STORY[1].x;
missionWorld.player.y = STORY[1].y;
missionStep(missionWorld, 1 / 60);
assert.equal(missionWorld.mission, 2, 'cooling off and reaching the pickup must advance the chain');

const policeWorld = createGameWorld(73, createRandom(73));
raiseWanted(policeWorld, 2);
assert.equal(policeWorld.wanted, 2);
policeWorld.wantedHeat = 0;
policeWorld.random = () => 0;
updatePolice(policeWorld, 1 / 60, () => {});
assert.equal(policeWorld.wanted, 1, 'wanted level must cool one star at a time');
assert.equal(policeWorld.cops.length, 2, 'police response should match current heat');

for (const name of ['chase', 'drive', 'mission', 'start']) {
  const staged = createGameWorld(1, createRandom(1));
  const scene = stageShot(name, staged);
  assert.equal(scene.screen, name === 'start' ? 'title' : 'playing');
  if (name === 'chase') assert.equal(staged.wanted, 3);
  if (name === 'drive') assert.ok(staged.player.vehicle);
  if (name === 'mission') assert.ok(staged.targetCar);
}
const sideWorld = createGameWorld(73, createRandom(73));
startTaxi(sideWorld);
sideWorld.player.vehicle = {};
sideWorld.player.x = sideWorld.taxiPin.x;
sideWorld.player.y = sideWorld.taxiPin.y;
updateSide(sideWorld, 1 / 60);
assert.equal(sideWorld.side, 'taxi-dropoff');
startRampage(sideWorld);
sideWorld.rampage = 20;
sideWorld.sideTimer = 29.9;
updateSide(sideWorld, 0.1);
assert.equal(sideWorld.player.cash, 450, 'timed rampage score must pay out');
console.log('smoke ok: deterministic map, mission chain, wanted decay, side payouts, and four shot scenes');
