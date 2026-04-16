import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Playback
  currentTrack: null,
  isPlaying: false,
  playingSince: null,
  pausedElapsed: 0,   // ms elapsed when paused — for accurate progress resume
  
  // Playlists
  userPlaylists: [],
  
  // UI toggles
  showLyrics: false,
  showQueue: false,
  showKeyboardHelp: false,
  
  // Queue
  queue: [],
  
  // Actions — Playback
  setCurrentTrack: (track) => set({ currentTrack: track, playingSince: Date.now(), pausedElapsed: 0 }),
  setIsPlaying: (isPlaying) => {
    const state = get();
    if (isPlaying) {
      // Resuming — adjust playingSince so elapsed calculation stays accurate
      const adjustedStart = Date.now() - state.pausedElapsed;
      set({ isPlaying: true, playingSince: adjustedStart });
    } else {
      // Pausing — capture how far we've played
      const elapsed = state.playingSince ? Date.now() - state.playingSince : 0;
      set({ isPlaying: false, pausedElapsed: elapsed });
    }
  },
  setUserPlaylists: (playlists) => set({ userPlaylists: playlists }),
  
  // Actions — UI toggles
  toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics, showQueue: false })),
  toggleQueue: () => set((state) => ({ showQueue: !state.showQueue, showLyrics: false })),
  toggleKeyboardHelp: () => set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),
  
  // Actions — Queue
  addToQueue: (track) => set((state) => {
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
    set({ queue: rest, currentTrack: next, isPlaying: true, playingSince: Date.now(), pausedElapsed: 0 });
    return next;
  },
  clearQueue: () => set({ queue: [] }),
}));
