import { createContext } from "react";
import type { createMInpStore } from "../store/inpmediastore";

type MInpStore = ReturnType<typeof createMInpStore>;

export const MInpCtx = createContext<MInpStore | null>(null);
