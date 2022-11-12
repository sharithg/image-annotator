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

export type Annotations = {
  boundingBoxes: BoundingBoxCoordinate[];
  lines: LineCoordinate[];
};

export type AnnotationsState = {
  boundingBoxes: BoundingBoxCoordinateState[];
  lines: LineCoordinateState[];
};

export type DrawModes = "box" | "line";

export type Offest = { dx: number; dy: number };

export type AnyAnnotation = {
  id: string | number;
  type: "box" | "line";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};
