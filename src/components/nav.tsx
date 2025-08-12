import { useContext } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";

const Nav = () => {
  const store = useContext(MInpCtx);
  if (!store) throw new Error("Missing MInpCtx.Provider in the tree");
  const devs = useStore(store, (s) => s.devs);

  return (
    <div className="p-4 flex justify-center items-center text-sm">
      <label className="text-xs font-bold">Select your camera:</label>
      <select id="camera-slector" className="font-extralight text-xs">
        {devs.map((el) => (
          <option key={el.deviceId}>{el.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Nav;
