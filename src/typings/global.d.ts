type MapSchemaRow<T> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T];
type MapSchemaCommon<T> = [
  MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>,
  MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>,
  MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>,
  MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>, MapSchemaRow<T>,
];

type TCoordinates = {
  x: number;
  y: number;
};

type RectangleParams = TCoordinates & {
  width: number;
  height: number;
  fill?: string;
};

type MapSchema = MapSchemaCommon<1 | 0>;
type WallsSchema = Array<TCoordinates | undefined>;

type RayParams = {
  angle: number;
  distance: number;
};
