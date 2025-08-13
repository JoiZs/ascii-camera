import { createStore } from "zustand";

interface AsciiConfig {
  background: string;
  foreground: string;
  size: number;
}

interface MInpProps {
  dev_count: number;
  devs: MediaDeviceInfo[];
  curr: string | undefined;
  settings: MediaTrackSettings | undefined;
  stream: MediaStream | undefined;
  config: AsciiConfig;
}

interface MInpState extends MInpProps {
  update_config: (state: Partial<AsciiConfig>) => void;
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
    config: {
      background: "#ffffff",
      foreground: "#000000",
      size: 4,
    },
  };

  return createStore<MInpState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    update_config: (state: Partial<AsciiConfig>) =>
      set((prev) => ({
        config: { ...prev.config, ...state },
      })),
    change_camera: (
      camera_id: string,
      settings?: MediaTrackSettings,
      stream?: MediaStream
    ) => set(() => ({ curr: camera_id, settings: settings, stream: stream })),
    update: (mDevs: MediaDeviceInfo[]) =>
      set(() => ({ dev_count: mDevs.length, devs: mDevs })),
  }));
};
