import { useContext, useEffect } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";
import Nav from "../components/nav";

const Home = () => {
  const store = useContext(MInpCtx);
  if (!store) throw new Error("Missing MInpCtx.Provider in the tree");
  const update = useStore(store, (s) => s.update);

  useEffect(() => {
    const updateDevice = async () => {
      update(
        (await navigator.mediaDevices.enumerateDevices()).filter(
          (el) => el.kind == "videoinput"
        )
      );
    };
    updateDevice();

    return;
  }, []);
  return (
    <div className="w-full h-full max-w-lg m-auto font-mono">
      <Nav />
    </div>
  );
};

export default Home;
