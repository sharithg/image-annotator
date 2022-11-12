import {
  AnnotationAction,
  AnnotationState,
  AnyAnnotation,
  BoundingBoxCoordinate,
  BoundingBoxCoordinateState,
  LineCoordinate,
  LineCoordinateState,
  Offest,
} from "./types";
import { drawBox } from "./utils/box";
import { drawLine } from "./utils/line";

export const annotationImageReducer = (
  state: AnnotationState,
  action: AnnotationAction
) => {
  switch (action.type) {
    case "ADD_BB_ANNOTATION":
      drawBox(action.payload.context, action.payload.offsets, {
        coordintate: action.payload.coordinates as BoundingBoxCoordinate,
      });
      const newAnnotationBox = {
        ...(action.payload.coordinates as BoundingBoxCoordinate),
        displayed: true,
        id: state.boundingBoxes.length,
      };
      if (action.payload.onAnnotationChange) {
        action.payload.onAnnotationChange(state, {
          id: newAnnotationBox.id,
          type: "box",
          x: newAnnotationBox.x,
          y: newAnnotationBox.y,
          width: newAnnotationBox.width,
          height: newAnnotationBox.height,
        });
      }
      return {
        ...state,
        boundingBoxes: [...state.boundingBoxes, newAnnotationBox],
      };
    case "ADD_LINE_ANNOTATION":
      drawLine(action.payload.context, action.payload.offsets, {
        coordintate: action.payload.coordinates as LineCoordinate,
      });
      const newAnnotationLine = {
        ...(action.payload.coordinates as LineCoordinate),
        displayed: true,
        id: state.lines.length,
      };
      if (action.payload.onAnnotationChange) {
        action.payload.onAnnotationChange(state, {
          id: newAnnotationLine.id,
          type: "line",
          x1: newAnnotationLine.x1,
          y1: newAnnotationLine.y1,
          x2: newAnnotationLine.x2,
          y2: newAnnotationLine.y2,
        });
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            ...(action.payload.coordinates as LineCoordinate),
            displayed: true,
            id: state.lines.length,
          },
        ],
      };
    default:
      return state;
  }
};
