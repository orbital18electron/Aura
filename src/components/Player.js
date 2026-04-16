"use client";
import styles from "./Player.module.css";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { playSong, pauseSong } from "@/lib/spotify";

export default function Player() {
  const { data: session } = useSession();
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);

  const togglePlay = async () => {
    if (!session || !currentTrack) return;
    try {
      if (isPlaying) {
        await pauseSong(session.user.accessToken);
        setIsPlaying(false);
      } else {
        await playSong(session.user.accessToken, currentTrack.uri);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback error", err);
      alert(err.message || "Failed to start playback. Make sure you have Spotify open on a device!");
    }
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.trackInfo}>
        {currentTrack ? (
           <img src={currentTrack.album.images[0].url} className={styles.coverPlaceholder} alt="cover" />
        ) : (
           <div className={styles.coverPlaceholder} />
        )}
        <div className={styles.textDetails}>
          <h4>{currentTrack ? currentTrack.name : "Select a song"}</h4>
          <p>{currentTrack ? currentTrack.artists.map(a => a.name).join(", ") : "Aura"}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.controlBtn}><SkipBack size={20} /></button>
        <button className={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
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
