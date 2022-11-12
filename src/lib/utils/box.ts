import { MOUSE_POINT_OFFSET } from "../constants";
import {
  BoundingBoxCoordinate,
  ClientCoordinate,
  Offest,
  XYCoordinate,
} from "../types";

export const drawBox = (
  context: CanvasRenderingContext2D,
  { dx, dy }: Offest,
  input: {
    coordintate: BoundingBoxCoordinate;
  }
) => {
  context.beginPath();
  context.strokeStyle = "red";
  context.rect(
    input.coordintate.x + dx,
    input.coordintate.y + dy,
    input.coordintate.width,
    input.coordintate.height
  );
  context.stroke();
};

export const getBoxCoordatesForUserDraw = (
  mousePos: XYCoordinate,
  client: ClientCoordinate,
  offset: Offest
) => {
  const x = mousePos.x - offset.dx - MOUSE_POINT_OFFSET;
  const y = mousePos.y - offset.dy - MOUSE_POINT_OFFSET;
  const width = client.clientX - mousePos.x;
  const height = client.clientY - mousePos.y;

  return { x, y, width, height };
};
