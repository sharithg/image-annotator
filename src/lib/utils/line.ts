import { MOUSE_POINT_OFFSET } from "../constants";
import {
  ClientCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
  Offest,
  XYCoordinate,
} from "../types";

export const drawLine = (input: {
  context: CanvasRenderingContext2D;
  offset: Offest;
  coordintate: LineCoordinate;
  styles: LineAnnotationStyles;
}) => {
  const { context, offset, coordintate, styles } = input;
  // line
  context.beginPath();
  context.strokeStyle = styles.strokeColor;
  context.lineWidth = styles.strokeWidth;
  context.setLineDash([5, 3]);
  context.moveTo(coordintate.x1 + offset.dx, coordintate.y1 + offset.dy);
  context.lineTo(coordintate.x2 + offset.dx, coordintate.y2 + offset.dy);
  context.stroke();

  // handles
  context.setLineDash([]);
  if (styles.showHandles) {
    context.beginPath();
    context.arc(
      coordintate.x1 + offset.dx,
      coordintate.y1 + offset.dy,
      5,
      0,
      2 * Math.PI
    );
    context.stroke();
    context.beginPath();
    context.arc(
      coordintate.x2 + offset.dx,
      coordintate.y2 + offset.dy,
      5,
      0,
      2 * Math.PI
    );
    context.stroke();
  }
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
