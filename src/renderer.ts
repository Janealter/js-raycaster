const MAP_PIXELS = 512;
const MAX_BLOCKS = 16;
const WALL_COLOR = '#e22b2b';
const RECTANGLE_SIZE = MAP_PIXELS / MAX_BLOCKS;

function renderMap (ctx: CanvasRenderingContext2D, schema: MapSchema) {
  const wallsSchema = new Array(MAX_BLOCKS * 2).fill(undefined) as WallsSchema;

  for (let i = 0; i < schema.length; i++) {
    const row = schema[i];

    for (let n = 0; n < row.length; n++) {
      const block = row[n];
      if (!block) continue;
      const currentBlockParams = {
        x: RECTANGLE_SIZE * n,
        y: RECTANGLE_SIZE * i,
        width: RECTANGLE_SIZE,
        height: RECTANGLE_SIZE,
        fill: WALL_COLOR,
      };
      drawRectangle(ctx, currentBlockParams);
      wallsSchema[n + (i * MAX_BLOCKS)] = { x: n, y: i };
    }
  }

  return wallsSchema;
}

function renderPlayer (ctx: CanvasRenderingContext2D, { x, y }: TCoordinates) {
  const WIDTH = 10;
  const HEIGHT = 10;
  
  drawRectangle(ctx, {
    x: (x * RECTANGLE_SIZE) - (WIDTH / 2),
    y: (y * RECTANGLE_SIZE) - (HEIGHT / 2),
    width: WIDTH,
    height: HEIGHT,
    fill: '#000000',
  });
}

function render3DView (ctx: CanvasRenderingContext2D, rayToWallDistances: RayParams[], playerAngle: number) {
  drawRectangle(ctx, { x: 0, y: 0, width: MAP_PIXELS, height: MAP_PIXELS, fill: '#dcdcdc' });

  for (let x = 0; x < rayToWallDistances.length; x++) {
    const { distance, angle } = rayToWallDistances[x];
    const lineHeight = MAP_PIXELS / (distance * Math.cos(angle - playerAngle));
    const lineBeginY = (MAP_PIXELS - lineHeight) / 2;
    const lineEndY = lineBeginY + lineHeight;

    drawLine(ctx, { x, y: lineBeginY }, { x, y: lineEndY }, { fill: WALL_COLOR });
  }
}

function drawRectangle (ctx: CanvasRenderingContext2D, { x, y, width, height, fill = '#ff0000' }: RectangleParams) {
  const rectangle = new Path2D();

  rectangle.rect(x, y, width, height);
  ctx.fillStyle = fill;
  ctx.fill(rectangle);
}

function renderLine (
  ctx: CanvasRenderingContext2D,
  { x: beginX, y: beginY }: TCoordinates,
  { x: endX, y: endY }: TCoordinates,
  params?: DrawLineParams,
) {
  drawLine(
    ctx,
    { x: beginX * RECTANGLE_SIZE, y: beginY * RECTANGLE_SIZE },
    { x: endX * RECTANGLE_SIZE, y: endY * RECTANGLE_SIZE },
    params,
  );
}

type DrawLineParams = {
  fill?: string;
  width?: number;
};
function drawLine (
  ctx: CanvasRenderingContext2D,
  { x: beginX, y: beginY }: TCoordinates,
  { x: endX, y: endY }: TCoordinates,
  { fill = '#000000', width = 1 }: DrawLineParams = {},
) {
  const line = new Path2D();

  ctx.beginPath();
  line.moveTo(beginX, beginY);
  line.lineTo(endX, endY);
  ctx.lineWidth = width;
  ctx.strokeStyle = fill;
  ctx.stroke(line);
  ctx.beginPath();
}

export { renderMap, renderPlayer, renderLine, render3DView, MAP_PIXELS, MAX_BLOCKS };
