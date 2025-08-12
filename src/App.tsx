import { useRef } from "react";
import { MInpCtx } from "./provider/index.tsx";
import { createMInpStore } from "./store/inpmediastore.ts";
import Home from "./layout/home.tsx";

function App() {
  const store = useRef(createMInpStore()).current;

  return (
    <MInpCtx.Provider value={store}>
      <Home />
    </MInpCtx.Provider>
  );
}

export default App;
