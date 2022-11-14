import { BBAnnotationStyles, LineAnnotationStyles } from "../types";
import { AnnotationsProps } from "../types/props";

export const validateAnnotations = (
  annotations: AnnotationsProps,
  defaultBoundingBoxStyles: BBAnnotationStyles,
  defaultLineStyles: LineAnnotationStyles
): AnnotationsProps => {
  const { boundingBoxes, lines } = annotations;

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
