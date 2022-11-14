import {
  AnnotationsStateInternal,
  ClientCoordinate,
  Offest,
  XYCoordinate,
} from "../types";

export const getClientCoordinatesOnCanavs = (
  event: ClientCoordinate,
  offset: Offest,
  mousePointOffset: DOMRect
): XYCoordinate => {
  const { clientX, clientY } = event;
  const x = clientX - offset.dx - mousePointOffset.left;
  const y = clientY - offset.dy - mousePointOffset.top;
  return { x, y };
};

const distancePointFromLine = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return (
    Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) /
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  );
};

function isPointOnLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number
) {
  return distancePointFromLine(px, py, x1, y1, x2, y2) <= width / 2;
}

export const distanceBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return {
    xDistance: Math.abs(x1 - x2),
    yDistance: Math.abs(y1 - y2),
  };
};

export const isHoveringOnBoxAnnotation = (
  currentAnnotations: AnnotationsStateInternal,
  coordinates: { x: number; y: number }
) => {
  const { x: interactionX, y: interactionY } = coordinates;

  return currentAnnotations.boundingBoxes.find((box) => {
    const { y, x, height, width } = box;

    const isInteractingWithLeftSide =
      interactionX >= x + width &&
      interactionX <= x + width + box.styles.strokeWidth &&
      interactionY >= y &&
      interactionY <= y + height + box.styles.strokeWidth;

    const isInteractingWithRightSide =
      interactionX >= x &&
      interactionX <= x + box.styles.strokeWidth &&
      interactionY >= y &&
      interactionY <= y + height + box.styles.strokeWidth;

    const isInteractingWithTopSide =
      interactionX >= x &&
      interactionX <= x + width + box.styles.strokeWidth &&
      interactionY >= y &&
      interactionY <= y + box.styles.strokeWidth;

    const isInteractingWithBottomSide =
      interactionX >= x &&
      interactionX <= x + width + box.styles.strokeWidth &&
      interactionY >= y + height &&
      interactionY <= y + height + box.styles.strokeWidth;

    const isInteractingWithBox =
      isInteractingWithLeftSide ||
      isInteractingWithRightSide ||
      isInteractingWithTopSide ||
      isInteractingWithBottomSide;

    return isInteractingWithBox;
  });
};

export const isHoveringOnLineAnnotation = (
  currentAnnotations: AnnotationsStateInternal,
  coordinates: { x: number; y: number }
) => {
  const { x: interactionX, y: interactionY } = coordinates;

  for (const line of currentAnnotations.lines) {
    const { x1, x2, y1, y2, styles } = line;

    if (styles.showHandles) {
      const isInteractingWithFirstHandle =
        interactionX >= x1 - 5 &&
        interactionX <= x1 + 5 &&
        interactionY >= y1 - 5 &&
        interactionY <= y1 + 5;

      const isInteractingWithSecondHandle =
        interactionX >= x2 - 5 &&
        interactionX <= x2 + 5 &&
        interactionY >= y2 - 5 &&
        interactionY <= y2 + 5;

      const isInteractingWithLine =
        isInteractingWithFirstHandle || isInteractingWithSecondHandle;

      if (isInteractingWithLine) {
        return {
          annotaion: line,
          handle: isInteractingWithFirstHandle ? "first" : "second",
        };
      }
    }

    const isInteractingWithLine = isPointOnLine(
      interactionX,
      interactionY,
      x1,
      y1,
      x2,
      y2,
      styles.strokeWidth
    );

    if (isInteractingWithLine) {
      return {
        annotaion: line,
        handle: "line",
      };
    }
  }
};
