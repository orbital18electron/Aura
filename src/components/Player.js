"use client";
import styles from "./Player.module.css";
import { Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function Player() {
  return (
    <div className={styles.playerContainer}>
      <div className={styles.trackInfo}>
        <div className={styles.coverPlaceholder} />
        <div className={styles.textDetails}>
          <h4>Select a song</h4>
          <p>Aura</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.controlBtn}><SkipBack size={20} /></button>
        <button className={styles.playBtn}><Play size={24} fill="currentColor" /></button>
        <button className={styles.controlBtn}><SkipForward size={20} /></button>
      </div>

      <div className={styles.actions}>
        <Volume2 size={20} className={styles.icon} />
        <div className={styles.volumeBar}>
          <div className={styles.volumeLevel}></div>
        </div>
      </div>
    </div>
  );
}
