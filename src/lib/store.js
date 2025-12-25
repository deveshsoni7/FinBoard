import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            widgets: [],
            isEditMode: false,
            theme: 'dark', // Default to dark as per design

            addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),

            removeWidget: (id) => set((state) => ({
                widgets: state.widgets.filter((w) => w.id !== id)
            })),

            updateWidget: (id, config) => set((state) => ({
                widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...config } : w)),
            })),

            reorderWidgets: (widgets) => set({ widgets }),

            importData: (data) => set({ widgets: data }),

            setTheme: (theme) => set({ theme }),

            toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
        }),
        {
            name: 'finboard-storage',
        }
    )
);
