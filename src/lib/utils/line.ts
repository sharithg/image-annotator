import {
  ClientCoordinate,
  LineAnnotationPropsInternal,
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
  offset: Offest,
  mousePointOffset: Offest
) => {
  const x1 = mousePos.x - offset.dx - mousePointOffset.dx;
  const y1 = mousePos.y - offset.dy - mousePointOffset.dy;
  const x2 = client.clientX - offset.dx - mousePointOffset.dx;
  const y2 = client.clientY - offset.dy - mousePointOffset.dy;

  return { x1, y1, x2, y2 };
};

export const getLineCoordatesForUserUpdate = (
  startCoordinates: XYCoordinate,
  endCoordinates: XYCoordinate
) => {
  return {
    x1: startCoordinates.x,
    y1: startCoordinates.y,
    x2: endCoordinates.x,
    y2: endCoordinates.y,
  };
};

const operators = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
};

export const getOffsetToCenterOfLine = (
  coordinates: LineAnnotationPropsInternal,
  offset: Offest,
  lineLength: { xDistance: number; yDistance: number }
) => {
  let xOperator: keyof typeof operators = "+";
  let yOperator: keyof typeof operators = "-";

  if (coordinates.x1 < coordinates.x2) {
    xOperator = "-";
  }

  if (coordinates.y1 > coordinates.y2) {
    yOperator = "+";
  }

  return {
    x1: operators[xOperator](
      coordinates.x1 + offset.dx,
      lineLength.xDistance / 2
    ),
    y1: operators[yOperator](
      coordinates.y1 + offset.dy,
      lineLength.yDistance / 2
    ),
    x2: operators[xOperator](
      coordinates.x2 + offset.dx,
      lineLength.xDistance / 2
    ),
    y2: operators[yOperator](
      coordinates.y2 + offset.dy,
      lineLength.yDistance / 2
    ),
  };
};
