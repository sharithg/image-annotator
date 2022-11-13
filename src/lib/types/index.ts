export type XYCoordinate = { x: number; y: number };
export type ClientCoordinate = { clientX: number; clientY: number };

export type BoundingBoxCoordinate = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoundingBoxCoordinateState = {
  displayed: boolean;
  id: string | number;
} & BoundingBoxCoordinate;

export type LineCoordinate = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type LineCoordinateState = {
  displayed: boolean;
  id: string | number;
} & LineCoordinate;

export type Offest = { dx: number; dy: number };

export type LineAnnotationStyles = {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  showHandles: boolean;
};

export type BBAnnotationStyles = {
  strokeColor: string;
  strokeWidth: number;
};

export type AnnotationReducerConfig = {
  defaultBoundingBoxStyles: BBAnnotationStyles;
  defaultLineStyles: LineAnnotationStyles;
};

export type LineAnnotationPropsInternal = {
  styles: LineAnnotationStyles;
  id: string;
} & LineCoordinate;

export type BoundingBoxAnnotationPropsInternal = {
  styles: BBAnnotationStyles;
  id: string;
} & BoundingBoxCoordinate;

export type AnnotationsStateInternal = {
  boundingBoxes: BoundingBoxAnnotationPropsInternal[];
  lines: LineAnnotationPropsInternal[];
};

export type AnyAnnotation = {
  lineCoordinate?: LineAnnotationPropsInternal;
  boundingBoxCoordinate?: BoundingBoxAnnotationPropsInternal;
};

export enum AnnotationTypes {
  BoundingBox = "BoundingBox",
  Line = "Line",
}

export type CurrentlyInteractingAnnotation = {
  type: AnnotationTypes;
  annotationSide: "lineStart" | "lineEnd" | "boundingBox";
  annotation: BoundingBoxAnnotationPropsInternal | LineAnnotationPropsInternal;
};

export type OnAnnotationDraw = (
  currentAnnotationState: AnnotationsStateInternal,
  newAnnotation: AnyAnnotation
) => void;

export type OnAnnotationMoving = (
  currentAnnotationState: AnnotationsStateInternal,
  updatedAnnotation: AnyAnnotation
) => void;
