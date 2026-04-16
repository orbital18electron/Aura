"use client";
import styles from "./Player.module.css";
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, ListMusic } from "lucide-react";
import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { playSong, pauseSong, setVolume } from "@/lib/spotify";
import { useState, useEffect } from "react";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Player() {
  const { data: session } = useSession();
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const playingSince = useStore((state) => state.playingSince);
  const showLyrics = useStore((state) => state.showLyrics);
  const toggleLyrics = useStore((state) => state.toggleLyrics);
  const showQueue = useStore((state) => state.showQueue);
  const toggleQueue = useStore((state) => state.toggleQueue);
  
  const [volume, setVolumeLevel] = useState(50);
  const [dominantColor, setDominantColor] = useState(null);
  const [progressMs, setProgressMs] = useState(0);

  const durationMs = currentTrack?.duration_ms || 0;

  useEffect(() => {
    if (!isPlaying || !playingSince) return;
    const interval = setInterval(() => {
      setProgressMs(Date.now() - playingSince);
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying, playingSince]);

  useEffect(() => {
    setProgressMs(0);
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack?.album?.images?.[0]?.url) {
      setDominantColor(null);
      return;
    }
    try {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = currentTrack.album.images[0].url;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          setDominantColor(`rgba(${r}, ${g}, ${b}, 0.2)`);
        } catch {
          setDominantColor(null);
        }
      };
      img.onerror = () => setDominantColor(null);
    } catch {
      setDominantColor(null);
    }
  }, [currentTrack]);

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
    }
  };

  const handleVolumeChange = async (e) => {
    const newVol = e.target.value;
    setVolumeLevel(newVol);
    if (session) {
      try { await setVolume(session.user.accessToken, newVol); } catch {}
    }
  };

  const progressPercent = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0;
  const bgStyle = dominantColor ? { background: `linear-gradient(to right, ${dominantColor}, var(--player-bg))` } : {};

  return (
    <div className={styles.playerContainer} style={bgStyle}>
      <div className={styles.trackInfo}>
        {currentTrack?.album?.images?.[0]?.url ? (
           <img src={currentTrack.album.images[0].url} className={styles.coverPlaceholder} alt="cover" />
        ) : (
           <div className={styles.coverPlaceholder} />
        )}
        <div className={styles.textDetails}>
          <h4>{currentTrack ? currentTrack.name : "Select a song"}</h4>
          <p>{currentTrack ? currentTrack.artists?.map(a => a.name).join(", ") : "Aura"}</p>
        </div>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.controls}>
          <button className={styles.controlBtn}><SkipBack size={20} /></button>
          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className={styles.controlBtn}><SkipForward size={20} /></button>
        </div>
        {currentTrack && (
          <div className={styles.progressRow}>
            <span className={styles.timeLabel}>{formatTime(progressMs)}</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            </div>
            <span className={styles.timeLabel}>{formatTime(durationMs)}</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.lyricsBtn} ${showLyrics ? styles.lyricsBtnActive : ""}`}
          onClick={toggleLyrics}
          title="Toggle Lyrics (L)"
        >
          <Mic2 size={18} />
        </button>
        <button
          className={`${styles.lyricsBtn} ${showQueue ? styles.lyricsBtnActive : ""}`}
          onClick={toggleQueue}
          title="Toggle Queue (Q)"
        >
          <ListMusic size={18} />
        </button>
        <Volume2 size={20} className={styles.icon} />
        <input 
           type="range" min="0" max="100" value={volume}
           onChange={handleVolumeChange}
           className={styles.volumeSlider}
        />
      </div>
    </div>
  );
}
