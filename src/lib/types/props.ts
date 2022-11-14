import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
  OnAnnotationDraw,
  OnAnnotationMoving,
} from "../types";

export type LineAnnotationProps = {
  styles?: LineAnnotationStyles;
  id: string;
} & LineCoordinate;

export type BoundingBoxAnnotationProps = {
  styles?: BBAnnotationStyles;
  id: string;
} & BoundingBoxCoordinate;

export type AnnotationsProps = {
  boundingBoxes: BoundingBoxAnnotationProps[];
  lines: LineAnnotationProps[];
};

export type SharedComponentProps = {
  annotations: AnnotationsProps;
  imageSrc: string;
  drawMode?: string;
  onAnnotationDraw?: OnAnnotationDraw;
  onAnnotationMoving?: OnAnnotationMoving;
  onAnnotationUpdate?: OnAnnotationMoving;
};
