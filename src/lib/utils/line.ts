import { MOUSE_POINT_OFFSET } from "../constants";
import {
  BoundingBoxCoordinate,
  ClientCoordinate,
  LineCoordinate,
  Offest,
  XYCoordinate,
} from "../types";

export const drawLine = (
  context: CanvasRenderingContext2D,
  { dx, dy }: Offest,
  input: {
    coordintate: LineCoordinate;
  }
) => {
  context.beginPath();
  context.strokeStyle = "yellow";
  context.moveTo(input.coordintate.x1 + dx, input.coordintate.y1 + dy);
  context.lineTo(input.coordintate.x2 + dx, input.coordintate.y2 + dy);
  context.stroke();
};

export const getLineCoordatesForUserDraw = (
  mousePos: XYCoordinate,
  client: ClientCoordinate,
  offset: Offest
) => {
  const x1 = mousePos.x - offset.dx - MOUSE_POINT_OFFSET;
  const y1 = mousePos.y - offset.dy - MOUSE_POINT_OFFSET;
  const x2 = client.clientX - offset.dx - MOUSE_POINT_OFFSET;
  const y2 = client.clientY - offset.dy - MOUSE_POINT_OFFSET;

  return { x1, y1, x2, y2 };
};
