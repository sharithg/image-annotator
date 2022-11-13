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

  for (let i = 0; i < currentAnnotations.lines.length; i++) {
    const { x1, x2, y1, y2, styles } = currentAnnotations.lines[i];

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
          annotaion: currentAnnotations.lines[i],
          handle: isInteractingWithFirstHandle ? "first" : "second",
        };
      }
    } else {
      const isInteractingWithLine =
        interactionX >= x1 &&
        interactionX <= x2 &&
        interactionY >= y1 &&
        interactionY <= y2;

      if (isInteractingWithLine) {
        return {
          annotaion: currentAnnotations.lines[i],
          handle: "first",
        };
      }
    }
  }
};
