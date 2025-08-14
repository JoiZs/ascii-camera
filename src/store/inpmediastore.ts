import { createStore } from "zustand";

interface AsciiConfig {
  background: string;
  foreground: string;
  size: number;
  is_short: boolean;
  is_grayscale: boolean;
  is_invert: boolean;
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
      background: "#000000",
      foreground: "#00ee00",
      size: 8,
      is_grayscale: false,
      is_short: true,
      is_invert: false,
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
