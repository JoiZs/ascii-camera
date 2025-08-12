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

  useEffect(() => {
    function draw(canvasCtx: CanvasRenderingContext2D) {
      if (
        vdoRef.current?.readyState === vdoRef.current?.HAVE_ENOUGH_DATA &&
        vdoRef.current &&
        canvasRef.current
      ) {
        canvasCtx?.drawImage(
          vdoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      animationFrameId.current = requestAnimationFrame(() => draw(canvasCtx));
    }

    const setupCanvas = () => {
      if (!canvasRef.current) return;
      if (!vdoRef.current) return;
      if (!settings) return;
      if (!stream) return;

      vdoRef.current.srcObject = stream;
      vdoRef.current.play();

      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;

      vdoRef.current.addEventListener("playing", () => draw(canvasCtx));

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
        vdoRef.current?.pause();
        vdoRef.current.srcObject = null;
      }
    };
  }, [settings]);

  return (
    <div className="row-span-6">
      <video ref={vdoRef} className="hidden invisible" />
      <canvas ref={canvasRef} className="bg-teal-200 w-full"></canvas>
    </div>
  );
};

export default Display;
