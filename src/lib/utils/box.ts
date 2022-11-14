import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
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
  startCoordinates: XYCoordinate,
  endCoordinates: XYCoordinate
) => {
  const x = startCoordinates.x;
  const y = startCoordinates.y;
  const width = endCoordinates.x - x;
  const height = endCoordinates.y - y;

  return { x, y, width, height };
};

export const getBoxCoordatesForUserUpdate = (
  startCoordinates: XYCoordinate,
  size: { width: number; height: number }
) => {
  const x = startCoordinates.x;
  const y = startCoordinates.y;
  const width = size.width;
  const height = size.height;

  return { x, y, width, height };
};
