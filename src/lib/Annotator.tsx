import React, { useEffect, useRef, useState } from "react";
import AnnotationImage from "./AnnotationImage";
import { useAnnotations } from "./AnnotationImageContext";
import { SharedComponentProps } from "./types/props";
import { drawImage } from "./utils/image";

type Props = {
  height?: number;
  width?: number;
} & SharedComponentProps;

const Annotator: React.FC<Props> = ({
  imageSrc,
  annotations,
  drawMode,
  height,
  width,
  onAnnotationDraw,
  onAnnotationMoving,
  onAnnotationUpdate,
}) => {
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { imageFetchHeaders } = useAnnotations();

  const offsets = {
    dx: xOffset,
    dy: yOffset,
  };

  const canvasHeightAndWidth = {
    height: height ?? 600,
    width: width ?? 1000,
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
        setXOffset(dx + 5);
        setYOffset(dy + 5);
      }
    );
  }, [imageLoaded]);

  return (
    <div
      style={{
        position: "relative",
        height: canvasHeightAndWidth.height,
        width: canvasHeightAndWidth.width,
      }}
    >
      <canvas
        ref={canvasRef}
        {...canvasHeightAndWidth}
        style={{
          position: "absolute",
        }}
      />
      {imageLoaded && (
        <AnnotationImage
          annotations={annotations}
          drawMode={drawMode}
          canvasHeightAndWidth={canvasHeightAndWidth}
          imageSrc={imageSrc}
          offsets={offsets}
          onAnnotationMoving={onAnnotationMoving}
          onAnnotationDraw={onAnnotationDraw}
          onAnnotationUpdate={onAnnotationUpdate}
        />
      )}
    </div>
  );
};

export default Annotator;
