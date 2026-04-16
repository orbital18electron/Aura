"use client";

import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { playSong, pauseSong, setVolume } from "@/lib/spotify";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./NowPlaying.module.css";
import ShareCard from "./ShareCard";
import Recommendations from "./Recommendations";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function NowPlaying() {
  const { data: session } = useSession();
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const playingSince = useStore((state) => state.playingSince);
  const [volume, setVolumeLevel] = useState(50);
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

  if (!currentTrack) {
    return (
      <div className={styles.emptyState}>
        <Disc3 size={48} className={styles.emptyIcon} />
        <p className={styles.emptyText}>Play a track to see it here</p>
      </div>
    );
  }

  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || "Unknown Track";
  const artistNames = currentTrack?.artists?.map(a => a.name).join(", ") || "Unknown Artist";
  const albumName = currentTrack?.album?.name || "";
  const progressPercent = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0;

  const togglePlay = async () => {
    if (!session) return;
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
    const newVol = parseInt(e.target.value);
    setVolumeLevel(newVol);
    if (session) {
      try { await setVolume(session.user.accessToken, newVol); } catch {}
    }
  };

  return (
    <div className={styles.nowPlaying}>
      <div className={styles.artSection}>
        {albumArt ? (
          <img
            src={albumArt}
            alt={trackName}
            className={`${styles.albumArt} ${isPlaying ? styles.spinning : ""}`}
          />
        ) : (
          <div className={`${styles.albumArt} ${styles.placeholder}`}>
            <Disc3 size={64} />
          </div>
        )}
      </div>

      <div className={styles.detailsSection}>
        <h3 className={styles.trackName}>{trackName}</h3>
        <p className={styles.artistName}>{artistNames}</p>
        {albumName && <p className={styles.albumName}>{albumName}</p>}

        <div className={styles.progressRow}>
          <span className={styles.timeLabel}>{formatTime(progressMs)}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
          <span className={styles.timeLabel}>{formatTime(durationMs)}</span>
        </div>

        <div className={styles.controlsRow}>
          <button className={styles.controlBtn}><SkipBack size={22} /></button>
          <button className={styles.mainPlayBtn} onClick={togglePlay}>
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
          <button className={styles.controlBtn}><SkipForward size={22} /></button>
        </div>

        <div className={styles.volumeRow}>
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <input type="range" min="0" max="100" value={volume}
            onChange={handleVolumeChange} className={styles.volumeSlider} />
          <span className={styles.volumeLabel}>{volume}%</span>
          <ShareCard />
        </div>

        <Recommendations />
      </div>
    </div>
  );
}
