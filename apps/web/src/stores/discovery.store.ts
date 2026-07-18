import { create } from 'zustand';

interface DiscoveryState {
  isSearchOverlayOpen: boolean;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  toggleSearchOverlay: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  isSearchOverlayOpen: false,
  openSearchOverlay: () => set({ isSearchOverlayOpen: true }),
  closeSearchOverlay: () => set({ isSearchOverlayOpen: false }),
  toggleSearchOverlay: () => set((state) => ({ isSearchOverlayOpen: !state.isSearchOverlayOpen })),
}));
