"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { playSong, pauseSong } from "@/lib/spotify";
import { X } from "lucide-react";
import styles from "./KeyboardHelp.module.css";

const shortcuts = [
  { key: "Space", action: "Play / Pause" },
  { key: "→", action: "Skip Forward" },
  { key: "←", action: "Skip Back" },
  { key: "L", action: "Toggle Lyrics" },
  { key: "Q", action: "Toggle Queue" },
  { key: "M", action: "Mute / Unmute" },
  { key: "?", action: "Keyboard Shortcuts" },
];

export default function KeyboardShortcuts() {
  const { data: session } = useSession();
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const toggleLyrics = useStore((state) => state.toggleLyrics);
  const toggleQueue = useStore((state) => state.toggleQueue);
  const toggleKeyboardHelp = useStore((state) => state.toggleKeyboardHelp);
  const showKeyboardHelp = useStore((state) => state.showKeyboardHelp);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when typing in an input/textarea
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (!session || !currentTrack) return;
          if (isPlaying) {
            pauseSong(session.user.accessToken).catch(console.error);
            setIsPlaying(false);
          } else {
            playSong(session.user.accessToken, currentTrack.uri).catch(console.error);
            setIsPlaying(true);
          }
          break;
        case "KeyL":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            toggleLyrics();
          }
          break;
        case "KeyQ":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            toggleQueue();
          }
          break;
        case "Slash":
          if (e.shiftKey) { // "?" key
            e.preventDefault();
            toggleKeyboardHelp();
          }
          break;
        case "Escape":
          if (showKeyboardHelp) {
            toggleKeyboardHelp();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session, currentTrack, isPlaying, setIsPlaying, toggleLyrics, toggleQueue, toggleKeyboardHelp, showKeyboardHelp]);

  if (!showKeyboardHelp) return null;

  return (
    <div className={styles.overlay} onClick={toggleKeyboardHelp}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={toggleKeyboardHelp}>
          <X size={24} />
        </button>
        <h2 className={styles.title}>Keyboard Shortcuts</h2>
        <div className={styles.grid}>
          {shortcuts.map((s) => (
            <div key={s.key} className={styles.row}>
              <kbd className={styles.key}>{s.key}</kbd>
              <span className={styles.action}>{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
