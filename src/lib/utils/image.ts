export const drawImage = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageSrc: string,
  imageFetchHeaders: HeadersInit | null,
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
