import {
  AnnotationsState,
  BBAnnotationStyles,
  LineAnnotationStyles,
} from "../types";
import { AnnotationsProps } from "../types/props";

export const validateAnnotations = (
  annotations: AnnotationsProps,
  defaultBoundingBoxStyles: BBAnnotationStyles,
  defaultLineStyles: LineAnnotationStyles
): AnnotationsState => {
  const { boundingBoxes, lines } = annotations;
  const boundingBoxIds = new Set();
  const lineIds = new Set();

  boundingBoxes.forEach((boundingBox) => {
    if (boundingBoxIds.has(boundingBox.id)) {
      throw new Error(
        `Duplicate bounding box id found: ${boundingBox.id}. Please make sure all bounding box ids are unique.`
      );
    }
    boundingBoxIds.add(boundingBox.id);
  });

  lines.forEach((line) => {
    if (lineIds.has(line.id)) {
      throw new Error(
        `Duplicate line id found: ${line.id}. Please make sure all line ids are unique.`
      );
    }
    lineIds.add(line.id);
  });

  return {
    boundingBoxes: boundingBoxes.map((boundingBox) => ({
      ...boundingBox,
      styles: boundingBox.styles ?? defaultBoundingBoxStyles,
    })),
    lines: lines.map((line) => ({
      ...line,
      styles: line.styles ?? defaultLineStyles,
    })),
  };
};
