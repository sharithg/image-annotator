import { DegreeRotations } from "../types";

export const rotateImage = (
  degrees: DegreeRotations,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: CanvasImageSource
) => {
  context.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
  context.save();
  const contextTransalteX = canvas.width / 2;
  const contextTransalteY = canvas.height / 2;

  context.translate(contextTransalteX, contextTransalteY);

  context.rotate((degrees * Math.PI) / 180);

  const hRatio = canvas.width / (image.height as number);
  const vRatio = canvas.height / (image.width as number);
  const ratio = Math.min(hRatio, vRatio);

  const newImageWidth = (image.width as number) * ratio;
  const newImageHeight = (image.height as number) * ratio;

  const canvasLength = canvas.width;

  if (image.width > image.height) {
    context.drawImage(
      image,
      -canvas.height / 2,
      // center the image
      -canvas.width / 2 + (canvasLength - newImageHeight) / 2,
      newImageWidth,
      newImageHeight
    );
  } else {
    context.drawImage(
      image,
      -canvas.height / 2,
      // center the image
      -canvas.width / 2 + (canvasLength - newImageWidth) / 2,
      newImageWidth,
      newImageHeight
    );
  }
  context.restore();
};
