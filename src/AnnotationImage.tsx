import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { drawBox, getBoxCoordatesForUserDraw } from "./utils/box";
import {
  Annotations,
  AnyAnnotation,
  BoundingBoxCoordinate,
  BoundingBoxCoordinateState,
  DrawModes,
  LineCoordinate,
  LineCoordinateState,
  XYCoordinate,
} from "./types";
import { validateAnnotations } from "./utils/annotations";
import { drawLine, getLineCoordatesForUserDraw } from "./utils/line";
import { v4 as uuidv4 } from "uuid";
import {
  annotationImageReducer,
  AnnotationState,
} from "./annotationImageReducer";

const drawImage = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageSrc: string,
  onImageLoad: (dx: number, dy: number) => void
) => {
  const img = new Image();
  img.onload = function () {
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    const dx = (canvas.width - img.width * ratio) / 2;
    const dy = (canvas.height - img.height * ratio) / 2;

    context.drawImage(img, dx, dy, img.width * ratio, img.height * ratio); // draw the image offset by half
    onImageLoad(dx, dy);
  };
  img.src = imageSrc;
};

interface Props {
  annotations: Annotations;
  imageSrc: string;
  drawMode?: string;
  onAnnotationChange?: (
    annotations: AnnotationState,
    newAnnotation: AnyAnnotation
  ) => void;
  height?: number;
  width?: number;
}

const AnnotationImage: React.FC<Props> = ({
  annotations,
  imageSrc,
  drawMode,
  onAnnotationChange,
  width,
  height,
}) => {
  validateAnnotations(annotations);

  const canvasHeightAndWidth = {
    height: height ?? 600,
    width: width ?? 1000,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [currentDrawingMousePosition, setCurrentDrawingMousePosition] =
    useState<XYCoordinate | null>(null);

  const context = canvasRef.current?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  const [, dispatchAnnotation] = useReducer(annotationImageReducer, {
    boundingBoxes: [],
    lines: [],
  });

  const offsets = {
    dx: xOffset,
    dy: yOffset,
  };

  useEffect(() => {
    if (imageLoaded) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    drawImage(context, canvas as HTMLCanvasElement, imageSrc, (dx, dy) => {
      setImageLoaded(true);
      setXOffset(dx);
      setYOffset(dy);
    });
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      validateAnnotations(annotations);
      annotations.boundingBoxes.forEach((box) => {
        drawBox(context, offsets, {
          coordintate: box,
        });
        dispatchAnnotation({
          type: "ADD_BB_ANNOTATION",
          payload: {
            coordinates: box,
            context,
            offsets,
          },
        });
      });
      annotations.lines.forEach((line) => {
        dispatchAnnotation({
          type: "ADD_BB_ANNOTATION",
          payload: {
            coordinates: line,
            context,
            offsets,
          },
        });
      });
    }
  }, [imageLoaded]);

  const handleDrawLine = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (currentDrawingMousePosition) {
      const coordintates = getLineCoordatesForUserDraw(
        currentDrawingMousePosition,
        e,
        offsets
      );
      dispatchAnnotation({
        type: "ADD_LINE_ANNOTATION",
        payload: {
          coordinates: coordintates,
          context,
          offsets,
          onAnnotationChange,
        },
      });
    }
  };

  const handleDrawBox = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (currentDrawingMousePosition) {
      const cordinates = getBoxCoordatesForUserDraw(
        currentDrawingMousePosition,
        e,
        offsets
      );
      dispatchAnnotation({
        type: "ADD_BB_ANNOTATION",
        payload: {
          coordinates: cordinates,
          context,
          offsets,
          onAnnotationChange,
        },
      });
    }
  };

  const handleDrawAnnotation = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawMode) return;
    if (drawMode === "line") {
      handleDrawLine(e);
    }
    if (drawMode === "box") {
      handleDrawBox(e);
    }
    setCurrentDrawingMousePosition(null);
  };

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          setCurrentDrawingMousePosition({
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseUp={handleDrawAnnotation}
        {...canvasHeightAndWidth}
      />
    </div>
  );
};

export default AnnotationImage;
