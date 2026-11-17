import { CITY, TILE } from './config.js';

export function createCity(random) {
  const buildings = [];
  const parks = [];
  const roads = [];
  for (let y = 0; y < CITY.rows; y += 1) for (let x = 0; x < CITY.cols; x += 1) {
    const bx = x * TILE, by = y * TILE;
    roads.push({ x: bx, y: by, w: TILE, h: CITY.road });
    roads.push({ x: bx, y: by, w: CITY.road, h: TILE });
    if (y >= CITY.beachRow) continue;
    if (x === 9 && y >= 5 || x === 3 && y === 4 || x === 7 && y === 2) {
      parks.push({ x: bx + CITY.road, y: by + CITY.road, w: TILE - CITY.road, h: TILE - CITY.road });
      continue;
    }
    const pad = 13 + random() * 13;
    const width = TILE - CITY.road - pad * 2;
    const height = TILE - CITY.road - pad * 2;
    buildings.push({ x: bx + CITY.road + pad, y: by + CITY.road + pad, w: width, h: height, tone: Math.floor(random() * 4), seed: random() });
  }
  return { buildings, parks, roads, beachY: 8 * TILE, port: { x: 10 * TILE, y: 6 * TILE, w: 2 * TILE, h: 2 * TILE } };
}

export function collidesBuilding(city, x, y, radius = 12) {
  return city.buildings.some(b => x + radius > b.x && x - radius < b.x + b.w && y + radius > b.y && y - radius < b.y + b.h);
}

export function inRoad(x, y) {
  const lx = ((x % TILE) + TILE) % TILE, ly = ((y % TILE) + TILE) % TILE;
  return lx < CITY.road || ly < CITY.road || y >= 8 * TILE;
}

export function createGameWorld(seed, rng) {
  const random = rng;
  const city = createCity(random);
  const state = {
    seed, city, random, player: { x: 5 * TILE + 85, y: 5 * TILE + 27, angle: 0, health: 100, cash: 350, ammo: 18, vehicle: null, invuln: 0 },
    cars: [], peds: [], cops: [], footCops: [], bullets: [], particles: [], skids: [], targetCar: null, pickups: [{ x: 4 * TILE + 26, y: 3 * TILE + 27, type: 'pistol' }],
    wanted: 0, wantedHeat: 0, mission: 0, missionStage: 0, missionTimer: 0, completed: 0, side: '', sideTimer: 0,
    shake: 0, time: 0, events: [], taxiPin: null, rampage: 0,
  };
  return state;
}
