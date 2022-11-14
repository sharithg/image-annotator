import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  drawBox,
  getBoxCoordatesForUserDraw,
  getBoxCoordatesForUserUpdate,
} from "./utils/box";
import {
  AnnotationTypes,
  BoundingBoxAnnotationPropsInternal,
  ClientCoordinate,
  CurrentlyInteractingAnnotation,
  LineAnnotationPropsInternal,
  LineAnnotationStyles,
  LineCoordinate,
  Offest,
} from "./types";
import { validateAnnotations } from "./utils/annotations";
import {
  drawLine,
  getLineCoordatesForUserDraw,
  getOffsetToCenterOfLine,
} from "./utils/line";
import { SharedComponentProps } from "./types/props";
import { useAnnotations } from "./AnnotationImageContext";
import {
  distanceBetweenPoints,
  getClientCoordinatesOnCanavs,
  isHoveringOnBoxAnnotation,
  isHoveringOnLineAnnotation,
} from "./utils/interactions";
import { v4 as uuidv4 } from "uuid";

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
    currentInterationStartMousePosition,
    setCurrentInterationStartMousePosition,
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

  console.log(userAnnotationState);

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
    if (currentInterationStartMousePosition) {
      const rect = canvas?.getBoundingClientRect() as DOMRect;

      const coordintates = getLineCoordatesForUserDraw(
        {
          x: currentInterationStartMousePosition.clientX,
          y: currentInterationStartMousePosition.clientY,
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
          coordinates: coordintates,
          context,
          offsets,
          styles: defaultLineStyles,
          id: uuidv4(),
        },
      });
    }
  };

  const handleDrawBox = (
    startCoordinate: ClientCoordinate,
    endCoordinate: ClientCoordinate
  ) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;

    const startUserInteractionCoordinates = getClientCoordinatesOnCanavs(
      startCoordinate,
      offsets,
      rect
    );
    const endUserInteractionCoordinates = getClientCoordinatesOnCanavs(
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
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;
    const clientCoordintates = getClientCoordinatesOnCanavs(e, offsets, rect);
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
    setCurrentInterationStartMousePosition(e);
  };

  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (currentInteractionAnnotation && currentInterationStartMousePosition) {
      if (onAnnotationUpdate) {
        onAnnotationUpdate(userAnnotationState, {
          boundingBoxCoordinate:
            currentInteractionAnnotation.type === AnnotationTypes.BoundingBox
              ? (currentInteractionAnnotation.annotation as BoundingBoxAnnotationPropsInternal)
              : undefined,
          lineCoordinate:
            currentInteractionAnnotation.type === AnnotationTypes.Line
              ? (currentInteractionAnnotation.annotation as LineAnnotationPropsInternal)
              : undefined,
        });
      }
      setCurrentInterationStartMousePosition(null);
      setCurrentInteractionAnnotation(null);
      return;
    }
    if (!drawMode) return;
    if (drawMode === "line") {
      handleDrawLine(e);
    }
    if (drawMode === "box") {
      if (currentInterationStartMousePosition) {
        handleDrawBox(currentInterationStartMousePosition, e);
      }
    }
    setCurrentInterationStartMousePosition(null);
    setCurrentInteractionAnnotation(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas?.getBoundingClientRect() as DOMRect;

    const interactionCoordinates = getClientCoordinatesOnCanavs(
      e,
      offsets,
      rect
    );

    if (
      currentInteractionAnnotation &&
      currentInteractionAnnotation.type === AnnotationTypes.BoundingBox &&
      currentInterationStartMousePosition
    ) {
      const currentAnnotation =
        currentInteractionAnnotation.annotation as BoundingBoxAnnotationPropsInternal;
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
      currentInterationStartMousePosition
    ) {
      const annotationSide = currentInteractionAnnotation.annotationSide;

      let newLineCoordinates: LineCoordinate = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      };
      if (annotationSide === "lineStart" || annotationSide === "lineEnd") {
        const currentAnnotation =
          currentInteractionAnnotation.annotation as LineAnnotationPropsInternal;

        const isInteractingWithStart = annotationSide === "lineStart";

        if (isInteractingWithStart) {
          newLineCoordinates = {
            x1: interactionCoordinates.x,
            y1: interactionCoordinates.y,
            x2: currentAnnotation.x2,
            y2: currentAnnotation.y2,
          };
        } else {
          newLineCoordinates = {
            x1: currentAnnotation.x1,
            y1: currentAnnotation.y1,
            x2: interactionCoordinates.x,
            y2: interactionCoordinates.y,
          };
        }
      } else {
        const currentAnnotation =
          currentInteractionAnnotation.annotation as LineAnnotationPropsInternal;

        const lineLength = distanceBetweenPoints(
          currentAnnotation.x1,
          currentAnnotation.y1,
          currentAnnotation.x2,
          currentAnnotation.y2
        );

        const dx = interactionCoordinates.x - currentAnnotation.x1;
        const dy = interactionCoordinates.y - currentAnnotation.y1;

        newLineCoordinates = getOffsetToCenterOfLine(
          currentAnnotation,
          {
            dx,
            dy,
          },
          lineLength
        );
      }
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
