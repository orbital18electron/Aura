import { create } from 'zustand';

export const useStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  playingSince: null,
  userPlaylists: [],
  showLyrics: false,
  
  setCurrentTrack: (track) => set({ currentTrack: track, playingSince: Date.now() }),
  setIsPlaying: (isPlaying) => set({ isPlaying, playingSince: isPlaying ? Date.now() : null }),
  setUserPlaylists: (playlists) => set({ userPlaylists: playlists }),
  toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
}));
