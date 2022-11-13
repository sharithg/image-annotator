import { useEffect, useRef, useState } from "react";
import { getBoxCoordatesForUserDraw } from "./utils/box";
import { AnyAnnotation, XYCoordinate } from "./types";
import { validateAnnotations } from "./utils/annotations";
import { getLineCoordatesForUserDraw } from "./utils/line";
import { AnnotationsProps } from "./types/props";
import { useAnnotations } from "./AnnotationImageContext";
import { drawImage } from "./utils/image";

interface Props {
  annotations: AnnotationsProps;
  imageSrc: string;
  drawMode?: string;
  onAnnotationDraw?: (newAnnotation: AnyAnnotation) => void;
  height?: number;
  width?: number;
}

const AnnotationImage: React.FC<Props> = ({
  annotations,
  imageSrc,
  drawMode,
  onAnnotationDraw,
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

  const { dispatchAnnotation, imageFetchHeaders, activeAnnotations } =
    useAnnotations();

  const context = canvasRef.current?.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

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

    drawImage(
      context,
      canvas as HTMLCanvasElement,
      imageSrc,
      imageFetchHeaders ?? null,
      (dx, dy) => {
        setImageLoaded(true);
        setXOffset(dx);
        setYOffset(dy);
      }
    );
  }, [imageLoaded]);

  useEffect(() => {
    if (imageLoaded) {
      annotations.boundingBoxes.forEach((box) => {
        dispatchAnnotation({
          type: "ADD_BB_ANNOTATION",
          payload: {
            coordinates: box,
            context,
            offsets,
            styles: box.styles ?? null,
            id: box.id,
          },
        });
      });
    }
  }, [imageLoaded, annotations]);

  useEffect(() => {
    if (imageLoaded) {
      annotations.lines.forEach((line) => {
        dispatchAnnotation({
          type: "ADD_LINE_ANNOTATION",
          payload: {
            coordinates: line,
            context,
            offsets,
            styles: line.styles ?? null,
            id: line.id,
          },
        });
      });
    }
  }, [imageLoaded, annotations]);

  const handleDrawLine = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (currentDrawingMousePosition) {
      const coordintates = getLineCoordatesForUserDraw(
        currentDrawingMousePosition,
        e,
        offsets
      );
      if (onAnnotationDraw) {
        onAnnotationDraw({
          lineCoordinate: coordintates,
        });
      }
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
      if (onAnnotationDraw) {
        onAnnotationDraw({
          boundingBoxCoordinate: cordinates,
        });
      }
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
