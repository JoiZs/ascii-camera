import { useContext, useEffect } from "react";
import { MInpCtx } from "../provider";
import { useStore } from "zustand";
import Nav from "../components/nav";
import Display from "../components/display";
import Footer from "../components/footer";

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
    <div className="w-full h-screen max-w-lg m-auto font-mono grid grid-rows-8">
      <Nav />
      <Display />
      <Footer />
    </div>
  );
};

export default Home;
