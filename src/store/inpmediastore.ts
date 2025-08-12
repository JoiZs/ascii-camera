import { createStore } from "zustand";

interface MInpProps {
  dev_count: number;
  devs: MediaDeviceInfo[];
  curr: string | undefined;
  settings: MediaTrackSettings | undefined;
  stream: MediaStream | undefined;
}

interface MInpState extends MInpProps {
  update: (state: MediaDeviceInfo[]) => void;
  change_camera: (
    camera_id: string,
    settings?: MediaTrackSettings,
    stream?: MediaStream
  ) => void;
}

export const createMInpStore = (initProps?: Partial<MInpProps>) => {
  const DEFAULT_PROPS: MInpProps = {
    dev_count: 0,
    devs: [],
    curr: undefined,
    settings: undefined,
    stream: undefined,
  };

  return createStore<MInpState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    change_camera: (
      camera_id: string,
      settings?: MediaTrackSettings,
      stream?: MediaStream
    ) => set(() => ({ curr: camera_id, settings: settings, stream: stream })),
    update: (mDevs: MediaDeviceInfo[]) =>
      set(() => ({ dev_count: mDevs.length, devs: mDevs })),
  }));
};
