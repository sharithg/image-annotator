import {
  getClientCoordinatesOnCanvas,
  distanceBetweenPoints,
  isHoveringOnBoxAnnotation,
  isHoveringOnLineAnnotation,
  distancePointFromLine,
} from "../interactions"; // Replace with the actual path to your module
import { describe, it, expect } from "vitest";

describe("Annotation Utilities", () => {
  describe("distancePointFromLine", () => {
    it("should return 0 when the point is on the line", () => {
      const distance = distancePointFromLine(0, 0, 0, 0, 1, 1);
      expect(distance).toBeCloseTo(0);
    });

    it("should return the correct distance for a horizontal line", () => {
      const distance = distancePointFromLine(1, 2, 0, 0, 3, 0);
      expect(distance).toBeCloseTo(2);
    });

    it("should return the correct distance for a vertical line", () => {
      const distance = distancePointFromLine(1, 2, 0, 0, 0, 3);
      expect(distance).toBeCloseTo(1);
    });

    it("should return the correct distance for a diagonal line", () => {
      const distance = distancePointFromLine(0, 0, 1, 1, 3, 3);
      expect(distance).toBe(0);
    });

    it("should return the correct distance for points not origin-centered", () => {
      const distance = distancePointFromLine(5, 6, 5, 5, 6, 5);
      expect(distance).toBeCloseTo(1);
    });

    it("should handle negative coordinates", () => {
      const distance = distancePointFromLine(-1, -2, -2, -2, -2, -1);
      expect(distance).toBeCloseTo(1);
    });
  });

  describe("getClientCoordinatesOnCanvas", () => {
    it("should correctly calculate canvas coordinates", () => {
      const event = { clientX: 100, clientY: 100 };
      const offset = { dx: 10, dy: 10 };
      const mousePointOffset = { left: 5, top: 5 };
      const result = getClientCoordinatesOnCanvas(
        event,
        offset,
        mousePointOffset as DOMRect
      );
      expect(result).toEqual({ x: 85, y: 85 });
    });
  });

  describe("distanceBetweenPoints", () => {
    it("should correctly calculate distance between points", () => {
      const result = distanceBetweenPoints(1, 1, 4, 5);
      expect(result).toEqual({ xDistance: 3, yDistance: 4 });
    });
  });

  describe("isHoveringOnBoxAnnotation", () => {
    const mockAnnotations = {
      boundingBoxes: [
        {
          id: "1",
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          styles: {
            strokeColor: "black",
            strokeWidth: 5,
          },
        },
      ],
      lines: [],
    };

    it("should detect hovering on a bounding box", () => {
      const result = isHoveringOnBoxAnnotation(mockAnnotations, {
        x: 15,
        y: 15,
      });
      expect(result).toBeTruthy();
    });

    it("should not detect hovering outside of a bounding box", () => {
      const result = isHoveringOnBoxAnnotation(mockAnnotations, {
        x: 200,
        y: 200,
      });
      expect(result).toBeFalsy();
    });
  });

  describe("isHoveringOnLineAnnotation", () => {
    const mockAnnotations = {
      boundingBoxes: [],
      lines: [
        {
          id: "1",
          x1: 10,
          y1: 10,
          x2: 20,
          y2: 20,
          styles: {
            strokeColor: "black",
            strokeWidth: 5,
            strokeDashArray: [],
            showHandles: true,
          },
        },
      ],
    };

    it("should detect hovering on a line", () => {
      const result = isHoveringOnLineAnnotation(mockAnnotations, {
        x: 15,
        y: 15,
      });
      expect(result).toBeTruthy();
    });

    it("should not detect hovering outside of a line", () => {
      const result = isHoveringOnLineAnnotation(mockAnnotations, {
        x: 200,
        y: 200,
      });
      expect(result).toBeFalsy();
    });
  });
});
