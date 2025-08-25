import { create } from "zustand";

type WeaponState = {
  weapon: string | null;
  skin: string | null;
  wireframe: boolean;
  rotation: boolean;
  setWeapon: (weapon: string | null) => void;
  setSkin: (skin: string | null) => void;
  toggleWireframe: () => void;
  toggleRotation: () => void;
};

export const useWeaponStore = create<WeaponState>((set) => ({
  weapon: "AK-47", // default weapon
  skin: "Asiimov", // default skin
  wireframe: false,
  rotation: false,

  setWeapon: (weapon) => set({ weapon }),
  setSkin: (skin) => set({ skin }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  toggleRotation: () => set((state) => ({ rotation: !state.rotation })),
}));