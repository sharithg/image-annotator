import { AnnotationReducerConfig } from "./types/index";
import {
  AnnotationAction,
  AnnotationState,
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
} from "./types";
import { drawBox } from "./utils/box";
import { drawLine } from "./utils/line";

const checkIfAnnotationIsDisplayed = (
  id: string,
  state: AnnotationState
): boolean => {
  const { currentAnnotationIds } = state;
  return currentAnnotationIds.has(id);
};

export const annotationImageReducer =
  (config: AnnotationReducerConfig) =>
  (state: AnnotationState, action: AnnotationAction): AnnotationState => {
    switch (action.type) {
      case "ADD_BB_ANNOTATION":
        const isBBDisplayed = checkIfAnnotationIsDisplayed(
          action.payload.id,
          state
        );
        if (isBBDisplayed) {
          return state;
        }
        drawBox({
          context: action.payload.context,
          offset: action.payload.offsets,
          coordintate: action.payload.coordinates as BoundingBoxCoordinate,
          styles:
            (action.payload.styles as BBAnnotationStyles) ??
            config.defaultBoundingBoxStyles,
        });
        const newAnnotationBox = {
          ...(action.payload.coordinates as BoundingBoxCoordinate),
          displayed: true,
          id: action.payload.id,
        };

        return {
          ...state,
          boundingBoxes: [...state.boundingBoxes, newAnnotationBox],
          currentAnnotationIds: state.currentAnnotationIds.add(
            action.payload.id
          ),
        };
      case "ADD_LINE_ANNOTATION":
        const isLineDisplayed = checkIfAnnotationIsDisplayed(
          action.payload.id,
          state
        );
        if (isLineDisplayed) {
          return state;
        }
        drawLine({
          context: action.payload.context,
          offset: action.payload.offsets,
          coordintate: action.payload.coordinates as LineCoordinate,
          styles:
            (action.payload.styles as LineAnnotationStyles) ??
            config.defaultLineStyles,
        });
        const newAnnotationLine = {
          ...(action.payload.coordinates as LineCoordinate),
          displayed: true,
          id: action.payload.id,
        };

        return {
          ...state,
          lines: [...state.lines, newAnnotationLine],
          currentAnnotationIds: state.currentAnnotationIds.add(
            action.payload.id
          ),
        };
      default:
        return state;
    }
  };
