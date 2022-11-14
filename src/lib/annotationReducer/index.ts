import {
  AnnotationsState,
  BoundingBoxAnnotation,
  LineAnnotation,
} from "../types/index";
import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
} from "../types";
import { AnnotationAction } from "./types";

type BoundingBoxOrLineAnnotation = BoundingBoxAnnotation | LineAnnotation;

const filterDuplicateAnnotations = <T>(
  annotations: BoundingBoxOrLineAnnotation[]
) => {
  const filteredAnnotations: BoundingBoxOrLineAnnotation[] = [];

  annotations.forEach((annotation: BoundingBoxOrLineAnnotation) => {
    const isDuplicate = filteredAnnotations.some(
      (filteredAnnotation) => filteredAnnotation.id === annotation.id
    );
    if (!isDuplicate) {
      filteredAnnotations.push(annotation);
    }
  });
  return filteredAnnotations as T[];
};

export const annotationImageReducer = (
  state: AnnotationsState,
  action: AnnotationAction
): AnnotationsState => {
  switch (action.type) {
    case "ADD_BB_ANNOTATION": {
      const newAnnotationBox = {
        ...(action.payload.coordinates as BoundingBoxCoordinate),
        displayed: true,
        styles: action.payload.styles as BBAnnotationStyles,
        id: action.payload.id,
      } as BoundingBoxAnnotation;

      const newStateAddBB: AnnotationsState = {
        ...state,
        boundingBoxes: filterDuplicateAnnotations<BoundingBoxAnnotation>([
          ...state.boundingBoxes,
          newAnnotationBox,
        ]),
      };

      if (action.payload.onAnnotationDraw) {
        action.payload.onAnnotationDraw(newStateAddBB, {
          boundingBoxCoordinate: newAnnotationBox,
        });
      }

      return newStateAddBB;
    }
    case "UPDATE_BB_ANNOTATION": {
      const updatedBoundingBoxes = state.boundingBoxes.map((box) => {
        if (box.id === action.payload.id) {
          return {
            ...box,
            ...(action.payload.coordinates as BoundingBoxCoordinate),
            styles: action.payload.styles as BBAnnotationStyles,
          };
        }

        return box;
      });

      const newStateUpdateBB: AnnotationsState = {
        ...state,
        boundingBoxes: updatedBoundingBoxes,
      };

      if (action.payload.onAnnotationMoving) {
        action.payload.onAnnotationMoving(newStateUpdateBB, {
          boundingBoxCoordinate: updatedBoundingBoxes.find(
            (box) => box.id === action.payload.id
          ) as BoundingBoxAnnotation,
        });
      }

      return newStateUpdateBB;
    }
    case "ADD_LINE_ANNOTATION": {
      const newAnnotationLine = {
        ...(action.payload.coordinates as LineCoordinate),
        displayed: true,
        id: action.payload.id,
        styles: action.payload.styles as LineAnnotationStyles,
      } as LineAnnotation;

      const newStateAddLine = {
        ...state,
        lines: filterDuplicateAnnotations<LineAnnotation>([
          ...state.lines,
          newAnnotationLine,
        ]),
      };

      if (action.payload.onAnnotationDraw) {
        action.payload.onAnnotationDraw(newStateAddLine, {
          lineCoordinate: newAnnotationLine,
        });
      }

      return newStateAddLine;
    }
    case "UPDATE_LINE_ANNOTATION": {
      const updatedLines = state.lines.map((line) => {
        if (line.id === action.payload.id) {
          return {
            ...line,
            ...(action.payload.coordinates as LineCoordinate),
            styles: action.payload.styles as LineAnnotationStyles,
          };
        }

        return line;
      });

      const newStateUpdateLine: AnnotationsState = {
        ...state,
        lines: updatedLines,
      };

      if (action.payload.onAnnotationMoving) {
        action.payload.onAnnotationMoving(newStateUpdateLine, {
          lineCoordinate: updatedLines.find(
            (line) => line.id === action.payload.id
          ) as LineAnnotation,
        });
      }

      return newStateUpdateLine;
    }
    default: {
      return state;
    }
  }
};
