import { useContext, type ChangeEvent } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";

const Nav = () => {
  const store = useContext(MInpCtx);
  if (!store) throw new Error("Missing MInpCtx.Provider in the tree");
  const devs = useStore(store, (s) => s.devs);
  const updateCamera = useStore(store, (s) => s.change_camera);

  const cameraChangeHandler = async (e: ChangeEvent<HTMLSelectElement>) => {
    let stream: MediaStream | undefined = undefined;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: e.target.value,
        },
        audio: false,
      });
    } catch (err) {
      alert(`Err at device selection: ${err}`);
    }

    if (!stream) return;

    console.log(stream);

    const curr_track = stream.getVideoTracks();

    if (curr_track.length > 0) {
      updateCamera(e.target.value, curr_track[0].getSettings(), stream);
    } else {
      updateCamera(e.target.value);
    }
  };

  return (
    <div className="p-4 flex justify-center items-center text-sm">
      <select
        onChange={cameraChangeHandler}
        className="font-extralight text-xs"
        defaultValue={""}
      >
        <option value="" disabled hidden>
          Select your camera
        </option>
        {devs.map((el) => (
          <option value={el.deviceId} key={el.deviceId}>
            {el.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Nav;
