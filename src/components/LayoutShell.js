"use client";
import Sidebar from "./Sidebar";
import Player from "./Player";
import styles from "./LayoutShell.module.css";
import { useSession } from "next-auth/react";

export default function LayoutShell({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    return <main className={styles.loginWrapper}><div className={styles.loader}></div></main>;
  }

  if (status === "unauthenticated") {
    return <main className={styles.loginWrapper}>{children}</main>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebarSection}>
        <Sidebar />
      </aside>
      <main className={styles.mainSection}>
        <div className={styles.contentScroll}>
          {children}
        </div>
      </main>
      <footer className={styles.playerSection}>
        <Player />
      </footer>
    </div>
  );
}
