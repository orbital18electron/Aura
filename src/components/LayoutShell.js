"use client";
import Sidebar from "./Sidebar";
import Player from "./Player";
import LyricsViewer from "./LyricsViewer";
import styles from "./LayoutShell.module.css";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";

export default function LayoutShell({ children }) {
  const { status } = useSession();
  const showLyrics = useStore((state) => state.showLyrics);

  if (status === "loading") {
    return <main className={styles.loginWrapper}><div className={styles.loader}></div></main>;
  }

  if (status === "unauthenticated") {
    return <main className={styles.loginWrapper}>{children}</main>;
  }

  return (
    <div className={`${styles.container} ${showLyrics ? styles.lyricsOpen : styles.lyricsClosed}`}>
      <aside className={styles.sidebarSection}>
        <Sidebar />
      </aside>
      <main className={styles.mainSection}>
        <div className={styles.contentScroll}>
          {children}
        </div>
      </main>
      {showLyrics && (
        <aside className={styles.lyricsSection}>
          <LyricsViewer />
        </aside>
      )}
      <footer className={styles.playerSection}>
        <Player />
      </footer>
    </div>
  );
}
