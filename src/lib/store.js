import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Playback
  currentTrack: null,
  isPlaying: false,
  playingSince: null,
  
  // Playlists
  userPlaylists: [],
  
  // UI toggles
  showLyrics: false,
  showQueue: false,
  showKeyboardHelp: false,
  
  // Queue
  queue: [],
  
  // Actions — Playback
  setCurrentTrack: (track) => set({ currentTrack: track, playingSince: Date.now() }),
  setIsPlaying: (isPlaying) => set({ isPlaying, playingSince: isPlaying ? Date.now() : null }),
  setUserPlaylists: (playlists) => set({ userPlaylists: playlists }),
  
  // Actions — UI toggles
  toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics, showQueue: false })),
  toggleQueue: () => set((state) => ({ showQueue: !state.showQueue, showLyrics: false })),
  toggleKeyboardHelp: () => set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),
  
  // Actions — Queue
  addToQueue: (track) => set((state) => {
    // Don't add duplicates
    if (state.queue.some(t => t.id === track.id)) return state;
    return { queue: [...state.queue, track] };
  }),
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(t => t.id !== trackId),
  })),
  reorderQueue: (fromIndex, toIndex) => set((state) => {
    const newQueue = [...state.queue];
    const [moved] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, moved);
    return { queue: newQueue };
  }),
  playNext: () => {
    const state = get();
    if (state.queue.length === 0) return null;
    const [next, ...rest] = state.queue;
    set({ queue: rest, currentTrack: next, isPlaying: true, playingSince: Date.now() });
    return next;
  },
  clearQueue: () => set({ queue: [] }),
}));
