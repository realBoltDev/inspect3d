import { create } from "zustand";

type WeaponState = {
  weapon: string | null;
  skin: string | null;
  wireframe: boolean;
  rotation: boolean;
  rotation_speed: number | null;
  setWeapon: (weapon: string | null) => void;
  setSkin: (skin: string | null) => void;
  setRotationSpeed: (speed: number | null) => void;
  toggleWireframe: () => void;
  toggleRotation: () => void;
};

export const useWeaponStore = create<WeaponState>((set) => ({
  weapon: null,
  skin: null,
  wireframe: false,
  rotation: false,
  rotation_speed: null,

  setWeapon: (weapon) => set({ weapon }),
  setSkin: (skin) => set({ skin }),
  setRotationSpeed: (rotation_speed) => set({ rotation_speed }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  toggleRotation: () => set((state) => ({ rotation: !state.rotation })),
}));