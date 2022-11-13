import {
  BBAnnotationStyles,
  BoundingBoxCoordinate,
  LineAnnotationStyles,
  LineCoordinate,
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
