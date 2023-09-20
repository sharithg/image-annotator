import { BBAnnotationStyles, LineAnnotationStyles } from "../../types";
import { validateAnnotations } from "../annotations";
import { describe, it, expect } from "vitest";

describe("validateAnnotations", () => {
  const defaultBoundingBoxStyles: BBAnnotationStyles = {
    strokeColor: "black",
    strokeWidth: 1,
  };

  const defaultLineStyles: LineAnnotationStyles = {
    strokeColor: "black",
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    showHandles: false,
  };

  it("should handle empty annotations", () => {
    const annotations = { boundingBoxes: [], lines: [] };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result).toEqual({ boundingBoxes: [], lines: [] });
  });

  it("should throw error for duplicate bounding box IDs", () => {
    const annotations = {
      boundingBoxes: [
        { id: "1", x: 0, y: 0, width: 10, height: 10 },
        { id: "1", x: 20, y: 20, width: 30, height: 30 },
      ],
      lines: [],
    };
    expect(() =>
      validateAnnotations(
        annotations,
        defaultBoundingBoxStyles,
        defaultLineStyles
      )
    ).toThrowError(/Duplicate bounding box id found/);
  });

  it("should throw error for duplicate line IDs", () => {
    const annotations = {
      boundingBoxes: [],
      lines: [
        { id: "1", x1: 0, y1: 0, x2: 10, y2: 10 },
        { id: "1", x1: 20, y1: 20, x2: 30, y2: 30 },
      ],
    };
    expect(() =>
      validateAnnotations(
        annotations,
        defaultBoundingBoxStyles,
        defaultLineStyles
      )
    ).toThrowError(/Duplicate line id found/);
  });

  it("should assign default styles to bounding boxes", () => {
    const annotations = {
      boundingBoxes: [{ id: "1", x: 0, y: 0, width: 10, height: 10 }],
      lines: [],
    };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result.boundingBoxes[0].styles).toEqual(defaultBoundingBoxStyles);
  });

  it("should assign default styles to lines", () => {
    const annotations = {
      boundingBoxes: [],
      lines: [{ id: "1", x1: 0, y1: 0, x2: 10, y2: 10 }],
    };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result.lines[0].styles).toEqual(defaultLineStyles);
  });

  it("should not overwrite custom styles in bounding boxes", () => {
    const customStyles = { strokeColor: "red", strokeWidth: 3 };
    const annotations = {
      boundingBoxes: [
        { id: "1", x: 0, y: 0, width: 10, height: 10, styles: customStyles },
      ],
      lines: [],
    };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result.boundingBoxes[0].styles).toEqual(customStyles);
  });

  it("should not overwrite custom styles in lines", () => {
    const customStyles = {
      strokeColor: "blue",
      strokeWidth: 3,
      strokeDashArray: [5, 5],
      showHandles: true,
    };
    const annotations = {
      boundingBoxes: [],
      lines: [{ id: "1", x1: 0, y1: 0, x2: 10, y2: 10, styles: customStyles }],
    };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result.lines[0].styles).toEqual(customStyles);
  });

  it("should handle both bounding boxes and lines", () => {
    const annotations = {
      boundingBoxes: [{ id: "1", x: 0, y: 0, width: 10, height: 10 }],
      lines: [{ id: "2", x1: 0, y1: 0, x2: 10, y2: 10 }],
    };
    const result = validateAnnotations(
      annotations,
      defaultBoundingBoxStyles,
      defaultLineStyles
    );
    expect(result.boundingBoxes[0].styles).toEqual(defaultBoundingBoxStyles);
    expect(result.lines[0].styles).toEqual(defaultLineStyles);
  });
});
