import { MOUSE_POINT_OFFSET } from "../constants";
import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  ClientCoordinate,
  Offest,
  XYCoordinate,
} from "../types";

export const drawBox = (input: {
  coordintate: BoundingBoxCoordinate;
  styles: BBAnnotationStyles;
  context: CanvasRenderingContext2D;
  offset: Offest;
}) => {
  const { coordintate, styles, context, offset } = input;
  context.beginPath();
  context.strokeStyle = styles.strokeColor;
  context.lineWidth = styles.strokeWidth;
  context.rect(
    coordintate.x + offset.dx,
    coordintate.y + offset.dy,
    coordintate.width,
    coordintate.height
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
