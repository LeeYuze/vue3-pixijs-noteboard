import { Point } from "pixi.js";

export const CopyPoint = (point: Point) => {
  const { x, y } = point;
  return new Point(x, y);
};
