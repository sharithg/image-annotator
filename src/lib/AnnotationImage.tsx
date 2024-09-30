import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  drawBox,
  getBoxCoordatesForUserDraw,
  getBoxCoordatesForUserUpdate,
} from "./utils/box";
import {
  AnnotationTypes,
  BoundingBoxAnnotation,
  ClientCoordinate,
  CurrentlyInteractingAnnotation,
  LineAnnotation,
  LineAnnotationStyles,
  Offest,
} from "./types";
import { validateAnnotations } from "./utils/annotations";
import { drawLine, getLineCoordatesForUserDraw } from "./utils/line";
import { SharedComponentProps } from "./types/props";
import { useAnnotations } from "./AnnotationImageContext";
import {
  getClientCoordinatesOnCanvas,
  isHoveringOnBoxAnnotation,
  isHoveringOnLineAnnotation,
} from "./utils/interactions";
import { v4 as uuidv4 } from "uuid";
import { calculateLineCoordinatesForMouseMove } from "./utils/mouseEvents";

//asd
type AnnotationImageProps = {
  offsets: Offest;
  canvasHeightAndWidth: {
    height: number;
    width: number;
  };
} & SharedComponentProps;

const AnnotationImage: React.FC<AnnotationImageProps> = ({
  annotations,
  drawMode,
  onAnnotationDraw,
  onAnnotationMoving,
  offsets,
  canvasHeightAndWidth,
  onAnnotationUpdate,
}) => {
  const [
    currentInteractionStartMousePosition,
    setCurrentInteractionStartMousePosition,
  ] = useState<React.MouseEvent<HTMLCanvasElement, MouseEvent> | null>(null);

  const [currentInteractionAnnotation, setCurrentInteractionAnnotation] =
    useState<CurrentlyInteractingAnnotation | null>(null);

  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    dispatchAnnotation,
    defaultBoundingBoxStyles,
    defaultLineStyles,
    userAnnotationState,
  } = useAnnotations();

  const userAnnotations = validateAnnotations(
    annotations,
    defaultBoundingBoxStyles,
    defaultLineStyles
  );

  const canvas = drawingCanvasRef.current;
  const context = canvas?.getContext("2d") as CanvasRenderingContext2D;

  useEffect(() => {
    const canvasCurr = drawingCanvasRef.current;
    const contextCurr = canvasCurr?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    userAnnotations.boundingBoxes.forEach((box) => {
      dispatchAnnotation({
        type: "ADD_BB_ANNOTATION",
        payload: {
          coordinates: box,
          context: contextCurr,
          offsets,
          styles: box.styles ?? defaultBoundingBoxStyles,
          onAnnotationDraw,
          id: box.id,
        },
      });
    });
    userAnnotations.lines.forEach((line) => {
      dispatchAnnotation({
        type: "ADD_LINE_ANNOTATION",
        payload: {
          coordinates: line,
          context: contextCurr,
          offsets,
          styles: line.styles ?? defaultLineStyles,
          onAnnotationDraw,
          id: line.id,
        },
      });
    });
  }, []);

  useEffect(() => {
    const canvasCurr = drawingCanvasRef.current;
    const contextCurr = canvasCurr?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    contextCurr.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);

    userAnnotationState.boundingBoxes.forEach((box) => {
      drawBox({
        context: contextCurr,
        offset: offsets,
        coordintate: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
        styles: box.styles,
      });
    });
    userAnnotationState.lines.forEach((line) => {
      drawLine({
        context: contextCurr,
        offset: offsets,
        coordintate: {
          x1: line.x1,
          y1: line.y1,
          x2: line.x2,
          y2: line.y2,
        },
        styles: line.styles,
      });
    });
  }, [userAnnotationState]);

  const handleDrawLine = (mouseCoordinates: ClientCoordinate) => {
    if (currentInteractionStartMousePosition) {
      const rect = canvas?.getBoundingClientRect() as DOMRect;

      const coordinates = getLineCoordatesForUserDraw(
        {
          x: currentInteractionStartMousePosition.clientX,
          y: currentInteractionStartMousePosition.clientY,
        },
        mouseCoordinates,
        offsets,
        {
          dx: rect.left,
          dy: rect.top,
        }
      );
      dispatchAnnotation({
        type: "ADD_LINE_ANNOTATION",
        payload: {
          coordinates,
          context,
          offsets,
          styles: defaultLineStyles,
          id: uuidv4(),
          onAnnotationDraw,
        },
      });
    }
  };

  const handleDrawBox = (
    startCoordinate: ClientCoordinate,
    endCoordinate: ClientCoordinate
  ) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;

    const startUserInteractionCoordinates = getClientCoordinatesOnCanvas(
      startCoordinate,
      offsets,
      rect
    );
    const endUserInteractionCoordinates = getClientCoordinatesOnCanvas(
      endCoordinate,
      offsets,
      rect
    );

    const cordinates = getBoxCoordatesForUserDraw(
      startUserInteractionCoordinates,
      endUserInteractionCoordinates
    );
    dispatchAnnotation({
      type: "ADD_BB_ANNOTATION",
      payload: {
        coordinates: cordinates,
        context,
        offsets,
        styles: defaultBoundingBoxStyles,
        id: uuidv4(),
        onAnnotationDraw,
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;
    const clientCoordintates = getClientCoordinatesOnCanvas(e, offsets, rect);
    const hoveringBoxAnnotation = isHoveringOnBoxAnnotation(
      userAnnotationState,
      clientCoordintates
    );
    const hoveringLine = isHoveringOnLineAnnotation(
      userAnnotationState,
      clientCoordintates
    );
    if (hoveringBoxAnnotation) {
      setCurrentInteractionAnnotation({
        type: AnnotationTypes.BoundingBox,
        annotation: hoveringBoxAnnotation,
        annotationSide: "boundingBox",
      });
    }
    if (hoveringLine) {
      setCurrentInteractionAnnotation({
        type: AnnotationTypes.Line,
        annotation: hoveringLine.annotaion,
        annotationSide:
          hoveringLine.handle === "first"
            ? "lineStart"
            : hoveringLine.handle === "line"
            ? "line"
            : "lineEnd",
      });
    }
    setCurrentInteractionStartMousePosition(e);
  };

  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (currentInteractionAnnotation && currentInteractionStartMousePosition) {
      if (onAnnotationUpdate) {
        onAnnotationUpdate(userAnnotationState, {
          boundingBoxCoordinate:
            currentInteractionAnnotation.type === AnnotationTypes.BoundingBox
              ? (currentInteractionAnnotation.annotation as BoundingBoxAnnotation)
              : undefined,
          lineCoordinate:
            currentInteractionAnnotation.type === AnnotationTypes.Line
              ? (currentInteractionAnnotation.annotation as LineAnnotation)
              : undefined,
        });
      }
      setCurrentInteractionStartMousePosition(null);
      setCurrentInteractionAnnotation(null);
      return;
    }
    if (!drawMode) return;
    if (drawMode === "line") {
      handleDrawLine(e);
    }
    if (drawMode === "box") {
      if (currentInteractionStartMousePosition) {
        handleDrawBox(currentInteractionStartMousePosition, e);
      }
    }
    setCurrentInteractionStartMousePosition(null);
    setCurrentInteractionAnnotation(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;

    const interactionCoordinates = getClientCoordinatesOnCanvas(
      e,
      offsets,
      rect
    );

    if (
      currentInteractionAnnotation &&
      currentInteractionAnnotation.type === AnnotationTypes.BoundingBox &&
      currentInteractionStartMousePosition
    ) {
      const currentAnnotation =
        currentInteractionAnnotation.annotation as BoundingBoxAnnotation;
      const cordinates = getBoxCoordatesForUserUpdate(interactionCoordinates, {
        height: currentAnnotation.height,
        width: currentAnnotation.width,
      });
      dispatchAnnotation({
        type: "UPDATE_BB_ANNOTATION",
        payload: {
          coordinates: cordinates,
          context,
          offsets,
          styles: currentInteractionAnnotation.annotation.styles,
          id: currentInteractionAnnotation.annotation.id,
          onAnnotationMoving,
        },
      });
    }

    if (
      currentInteractionAnnotation &&
      currentInteractionAnnotation.type === AnnotationTypes.Line &&
      currentInteractionStartMousePosition
    ) {
      const newLineCoordinates = calculateLineCoordinatesForMouseMove(
        currentInteractionAnnotation,
        interactionCoordinates
      );
      dispatchAnnotation({
        type: "UPDATE_LINE_ANNOTATION",
        payload: {
          coordinates: newLineCoordinates,
          context,
          offsets,
          styles: currentInteractionAnnotation.annotation
            .styles as LineAnnotationStyles,
          id: currentInteractionAnnotation.annotation.id,
          onAnnotationMoving,
        },
      });
    }
  };

  return (
    <canvas
      {...canvasHeightAndWidth}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={drawingCanvasRef}
    />
  );
};

export default AnnotationImage;
