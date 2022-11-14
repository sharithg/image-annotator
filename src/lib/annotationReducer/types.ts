import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
  Offest,
  OnAnnotationDraw,
  OnAnnotationMoving,
} from "../types";

type AddBBAnnotation = {
  type: "ADD_BB_ANNOTATION";
  payload: {
    coordinates: BoundingBoxCoordinate;
    context: CanvasRenderingContext2D;
    offsets: Offest;
    styles: BBAnnotationStyles;
    onAnnotationDraw?: OnAnnotationDraw;
  };
};

type UpdateBBAnnotation = {
  type: "UPDATE_BB_ANNOTATION";
  payload: {
    coordinates: BoundingBoxCoordinate;
    context: CanvasRenderingContext2D;
    offsets: Offest;
    styles: BBAnnotationStyles;
    id: string;
    onAnnotationMoving?: OnAnnotationMoving;
  };
};

type AddLineAnnotation = {
  type: "ADD_LINE_ANNOTATION";
  payload: {
    coordinates: LineCoordinate;
    context: CanvasRenderingContext2D;
    offsets: Offest;
    styles: LineAnnotationStyles;
    onAnnotationDraw?: OnAnnotationDraw;
  };
};

type UpdateLineAnnotation = {
  type: "UPDATE_LINE_ANNOTATION";
  payload: {
    coordinates: LineCoordinate;
    context: CanvasRenderingContext2D;
    offsets: Offest;
    styles: LineAnnotationStyles;
    id: string;
    onAnnotationMoving?: OnAnnotationMoving;
  };
};

export type AnnotationAction =
  | AddBBAnnotation
  | UpdateBBAnnotation
  | AddLineAnnotation
  | UpdateLineAnnotation;
