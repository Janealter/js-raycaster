import map from './map.json';
import { renderMap, renderPlayer, renderLine, render3DView, MAP_PIXELS, MAX_BLOCKS } from './renderer';
import { exponentialRound, getFractionDigitsNumber } from './helpers';
import init from './init';

const MAP_SCHEMA = map as MapSchema;
const FOV = Math.PI / 3;
const PLAYER_ROTATE_SPEED = 0.05;
const PLAYER_WALK_SPEED = 0.2;
const MAX_RADIAN = 6.2;
const playerCoordinates = {
  x: 2,
  y: 2,
};
let playerViewAngle = 0;

const { mapContext, raysContext, viewContext } = init();

const wallsSchema = renderMap(mapContext, MAP_SCHEMA);
renderAll();

document.addEventListener('keydown', (evt) => {
  evt.preventDefault();

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(evt.key)) {
    let newAngle = 0;
    let newX = 0;
    let newY = 0;

    if (evt.key === 'ArrowRight') {
      newAngle = exponentialRound(playerViewAngle + PLAYER_ROTATE_SPEED, getFractionDigitsNumber(PLAYER_ROTATE_SPEED));
      playerViewAngle = newAngle > MAX_RADIAN ? 0 : newAngle; 
    }
    if (evt.key === 'ArrowLeft') {
      newAngle = exponentialRound(playerViewAngle - PLAYER_ROTATE_SPEED, getFractionDigitsNumber(PLAYER_ROTATE_SPEED));
      playerViewAngle = newAngle < 0 ? MAX_RADIAN : newAngle;
    }

    if (evt.key === 'ArrowUp') {
      newX = playerCoordinates.x + (PLAYER_WALK_SPEED * Math.cos(playerViewAngle));
      newY = playerCoordinates.y + (PLAYER_WALK_SPEED * Math.sin(playerViewAngle));

      if (!findCollision(wallsSchema, { x: newX, y: newY })) {
        playerCoordinates.x = newX;
        playerCoordinates.y = newY;
      }
    }
    if (evt.key === 'ArrowDown') {
      newX = playerCoordinates.x - (PLAYER_WALK_SPEED * Math.cos(playerViewAngle));
      newY = playerCoordinates.y - (PLAYER_WALK_SPEED * Math.sin(playerViewAngle));

      if (!findCollision(wallsSchema, { x: newX, y: newY })) {
        playerCoordinates.x = newX;
        playerCoordinates.y = newY;
      }
    }

    renderAll();
  }
});

function renderAll () {
  const rayParams = castRays(raysContext, playerViewAngle);
  renderPlayer(raysContext, playerCoordinates);
  render3DView(viewContext, rayParams, playerViewAngle);
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} angle Angle in radians (min 0, max 6.2)
 */
function castRays (ctx: CanvasRenderingContext2D, angle: number) {
  const rayParams: RayParams[] = [];

  ctx.clearRect(0, 0, MAP_PIXELS, MAP_PIXELS);

  for (let i = 0; i < MAP_PIXELS; i++ ) {
    const rayAngle = (angle - (FOV / 2)) + (FOV * i / MAP_PIXELS);
  
    for (let c = 0; c < 20; c += .05) {
      const cx = playerCoordinates.x + (c * Math.cos(rayAngle));
      const cy = playerCoordinates.y + (c * Math.sin(rayAngle));

      if (findCollision(wallsSchema, {x: cx, y: cy })) {
        renderLine(ctx, {
          x: playerCoordinates.x,
          y: playerCoordinates.y,
        }, {
          x: cx,
          y: cy,
        }, {
          fill: 'gray',
          width: 0.5,
        });
        rayParams.push({ angle: rayAngle, distance: c });
        break;
      }
    }
  }

  return rayParams;
}

function findCollision (schema: WallsSchema, { x, y }: TCoordinates) {
  const intX = Math.floor(x);
  const intY = Math.floor(y);

  return schema[intX + (intY * MAX_BLOCKS)];
}
