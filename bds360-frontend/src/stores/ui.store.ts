// @/stores/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    isMapView: boolean;
    setMapView: (val: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            // Tạm thời mặc định luôn là true (View Map)
            isMapView: true,
            setMapView: (val) => set({ isMapView: val }),
        }),
        {
            name: 'bds360-ui-preferences', // Tên lưu trong LocalStorage
        }
    )
);