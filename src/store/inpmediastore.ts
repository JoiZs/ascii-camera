import { createStore } from "zustand";

interface MInpProps {
  dev_count: number;
  devs: MediaDeviceInfo[];
}

interface MInpState extends MInpProps {
  update: (state: MediaDeviceInfo[]) => void;
}

export const createMInpStore = (initProps?: Partial<MInpProps>) => {
  const DEFAULT_PROPS: MInpProps = {
    dev_count: 0,
    devs: [],
  };

  return createStore<MInpState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    update: (mDevs: MediaDeviceInfo[]) =>
      set(() => ({ dev_count: mDevs.length, devs: mDevs })),
  }));
};
