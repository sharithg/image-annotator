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

export type AnnotationsState = {
  boundingBoxes: BoundingBoxCoordinateState[];
  lines: LineCoordinateState[];
};

export type DrawModes = "box" | "line";

export type Offest = { dx: number; dy: number };

export type AnyAnnotation = {
  lineCoordinate?: LineCoordinate;
  boundingBoxCoordinate?: BoundingBoxCoordinate;
};

export type AnnotationState = {
  boundingBoxes: BoundingBoxCoordinateState[];
  lines: LineCoordinateState[];
  currentAnnotationIds: Set<string>;
};

export type AnnotationAction = {
  type: string;
  payload: {
    coordinates: BoundingBoxCoordinate | LineCoordinate;
    context: CanvasRenderingContext2D;
    offsets: Offest;
    styles: LineAnnotationStyles | BBAnnotationStyles | null;
    id: string;
  };
};

export type ImageSrc = {
  url: string;
  headers?: { [key: string]: string };
};

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
