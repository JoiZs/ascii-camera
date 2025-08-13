import { useContext, type ChangeEvent } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";
import { debounce } from "../lib/debounce";

const Footer = () => {
  const store = useContext(MInpCtx);
  if (!store) throw new Error("Missing MInpCtx.Provider in the tree");

  const currConfig = useStore(store, (s) => s.config);
  const updateConfig = useStore(store, (s) => s.update_config);

  const updateConfigHandler = (
    e: ChangeEvent<HTMLInputElement>,
    type: 0 | 1 | 2
  ) => {
    const currVal = e.target.value;

    if (type == 0) {
      console.log("bg1");
      debounce(() => {
        updateConfig({ background: currVal });
      }, 300)();
    } else if (type == 1) {
      debounce(() => updateConfig({ foreground: currVal }), 1000)();
    } else {
      debounce(() => updateConfig({ size: parseInt(currVal) }), 1000)();
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 text-xs flex-wrap">
      <div className="flex items-center gap-2">
        <label>Background</label>
        <input
          defaultValue={currConfig.background}
          onChange={(e) => updateConfigHandler(e, 0)}
          type="color"
        ></input>
      </div>
      <div className="flex items-center gap-2">
        <label>Foreground</label>
        <input
          defaultValue={currConfig.foreground}
          onChange={(e) => updateConfigHandler(e, 1)}
          type="color"
        ></input>
      </div>
      <div className="flex items-center gap-2">
        <label>Size:</label>
        <input
          onChange={(e) => updateConfigHandler(e, 2)}
          type="range"
          defaultValue={currConfig.size}
          step={2}
          min={2}
          max={32}
        ></input>
      </div>
    </div>
  );
};

export default Footer;
