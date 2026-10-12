// Zustand's "traditional" create, the same one sidebar.ts and profile.ts use.
import { createWithEqualityFn } from 'zustand/traditional';
// Middleware that saves the store to browser storage and restores it on load.
import { createJSONStorage, persist } from 'zustand/middleware';

// Limit for expanded chat windows. The store enforces this one.
export const MAX_OPEN_CHATS = 2;

// How many bubbles are visible before the rest fold into a "+N" bubble.
// Display-only: the store keeps every minimized chat, and the bubble stack
// (step 4) uses this to decide what to show.
export const MAX_VISIBLE_BUBBLES = 3;

// The data part of the store: what gets saved.
// Both lists are ordered oldest first, so index 0 is always "the oldest".
interface ChatDockState {
  openIds: number[]; // chat windows currently expanded (max 2)
  minimizedIds: number[]; // chats shown as bubbles (no limit; extras go behind "+N")
}

// Data plus actions, following the same pattern as UseSidebarStore.
interface UseChatDockStore extends ChatDockState {
  openChat: (employeeId: number) => void;
  minimizeChat: (employeeId: number) => void;
  closeChat: (employeeId: number) => void;
  closeAll: () => void;
}

export const useChatDockStore = createWithEqualityFn<UseChatDockStore>()(
  persist(
    (set) => ({
      openIds: [],
      minimizedIds: [],

      openChat: (employeeId) =>
        set((state) => {
          // Already expanded: return the same object, so Zustand skips the update.
          if (state.openIds.includes(employeeId)) return state;

          // New arrays, never edits to the old ones.
          const minimizedIds = state.minimizedIds.filter(
            (id) => id !== employeeId
          );
          const openIds = [...state.openIds, employeeId];

          // Everything except the newest MAX_OPEN_CHATS. Empty when nothing overflows.
          const overflow = openIds.slice(0, -MAX_OPEN_CHATS);

          // A new object, so Zustand sees a change and re-renders.
          return {
            openIds: openIds.slice(-MAX_OPEN_CHATS), // keep the newest 2
            minimizedIds: [...minimizedIds, ...overflow], // overflow becomes the newest bubble
          };
        }),

      minimizeChat: (employeeId) =>
        set((state) => {
          if (!state.openIds.includes(employeeId)) return state;

          const openIds = state.openIds.filter((id) => id !== employeeId);
          const minimizedIds = [...state.minimizedIds, employeeId];

          return {
            openIds,
            minimizedIds,
          };
        }),

      closeChat: (employeeId) =>
        set((state) => {
          const openIds = state.openIds.filter((id) => id !== employeeId);
          const minimizedIds = state.minimizedIds.filter(
            (id) => id !== employeeId
          );

          return {
            openIds,
            minimizedIds,
          };
        }),

      // Passing an object instead of a function: nothing depends on the old state.
      closeAll: () => set({ openIds: [], minimizedIds: [] }),
    }),
    {
      // The key in sessionStorage. Shows up in DevTools under Application > Session Storage.
      name: 'mymis-chat-dock',
      // Where to save. A function, so sessionStorage is only touched when needed.
      storage: createJSONStorage(() => sessionStorage),
      // Save only the two id lists, not the action functions.
      partialize: (state) => ({
        openIds: state.openIds,
        minimizedIds: state.minimizedIds,
      }),
    }
  )
);
