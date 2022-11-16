export const drawImage = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageSrc: string,
  imageFetchHeaders: HeadersInit | null,
  onImageLoad: (dx: number, dy: number, img: HTMLImageElement) => void
) => {
  const img = new Image();
  img.onload = function () {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);

    const dx = (canvas.width - img.width * ratio) / 2;
    const dy = (canvas.height - img.height * ratio) / 2;

    context.drawImage(img, dx, dy, img.width * ratio, img.height * ratio); // draw the image offset by half
    onImageLoad(dx, dy, img);
  };

  if (imageFetchHeaders) {
    const options = {
      headers: imageFetchHeaders,
    };

    fetch(imageSrc, options)
      .then((res) => res.blob())
      .then((blob) => {
        img.src = URL.createObjectURL(blob);
      });
  } else {
    img.src = imageSrc;
  }
};

export const clearRect = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};
