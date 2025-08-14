import { useContext, useEffect, useRef } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";

const Display = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vdoRef = useRef<HTMLVideoElement>(null);
  const animationFrameId = useRef<number>(null);

  const store = useContext(MInpCtx);
  if (!store) throw new Error("Missing MInpCtx.Provider in the tree");

  const settings = useStore(store, (s) => s.settings);
  const stream = useStore(store, (s) => s.stream);
  const config = useStore(store, (s) => s.config);

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current;
      const video = vdoRef.current;

      if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameId.current = requestAnimationFrame(draw);
        return;
      }

      const canvasCtx = canvasRef.current?.getContext("2d", {
        willReadFrequently: true,
      });

      if (!canvasCtx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Get frame pixel data directly without drawing original image to canvas again if only ASCII is to be shown
      canvasCtx.drawImage(video, 0, 0, width, height);
      const imgData = canvasCtx.getImageData(0, 0, width, height);

      canvasCtx.clearRect(0, 0, width, height);

      const asciiChars = config.is_short
        ? " .:-=+*#%@"
        : ' .`^",:;Il!i~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

      const asciiLen = asciiChars.length - 1;

      const fontSize = config.size;
      canvasCtx.font = `${fontSize}px monospace`;
      canvasCtx.fillStyle = config.foreground;
      canvasCtx.textBaseline = "top";

      const cols = Math.floor(width / fontSize);
      const rows = Math.floor(height / fontSize);

      const xRatio = imgData.width / cols;
      const yRatio = imgData.height / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = Math.floor(col * xRatio);
          const py = Math.floor(row * yRatio);
          const offset = (py * imgData.width + px) * 4;

          let r = imgData.data[offset];
          let g = imgData.data[offset + 1];
          let b = imgData.data[offset + 2];

          if (config.is_invert) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
          }

          const lum = config.is_grayscale
            ? 0.299 * r + 0.587 * g + 0.114 * b
            : 0.2126 * r + 0.7152 * g + 0.0722 * b;

          const charIndex = Math.floor((lum / 255) * asciiLen);

          canvasCtx.fillText(
            asciiChars.charAt(charIndex),
            col * fontSize,
            row * fontSize
          );
        }
      }

      animationFrameId.current = requestAnimationFrame(draw);
    }

    const setupCanvas = () => {
      if (!canvasRef.current) return;
      if (!vdoRef.current) return;
      if (!settings) return;
      if (!stream) return;

      vdoRef.current.srcObject = stream;
      vdoRef.current.play();

      vdoRef.current.addEventListener("playing", draw);

      canvasRef.current.width = settings.width || canvasRef.current.width;
      canvasRef.current.height = settings.height || canvasRef.current.height;
      //   console.log(canvasRef.current?.width, canvasRef.current.height);
      //   console.log(settings);
    };
    setupCanvas();

    return () => {
      animationFrameId.current &&
        cancelAnimationFrame(animationFrameId.current);

      if (vdoRef.current) {
        vdoRef.current.pause();
        vdoRef.current.srcObject = null;
        vdoRef.current.removeEventListener("playing", draw);
      }
    };
  }, [settings, config]);

  return (
    <div className="row-span-6 flex items-center">
      <video ref={vdoRef} className="hidden invisible" />
      <canvas
        ref={canvasRef}
        style={{ background: config.background }}
        className={`w-full`}
      ></canvas>
    </div>
  );
};

export default Display;
