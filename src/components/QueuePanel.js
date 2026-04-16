"use client";

import { useStore } from "@/lib/store";
import { X, GripVertical, Play, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { playSong } from "@/lib/spotify";
import styles from "./QueuePanel.module.css";

export default function QueuePanel() {
  const { data: session } = useSession();
  const queue = useStore((state) => state.queue);
  const removeFromQueue = useStore((state) => state.removeFromQueue);
  const clearQueue = useStore((state) => state.clearQueue);
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const currentTrack = useStore((state) => state.currentTrack);

  const handlePlayFromQueue = async (track, index) => {
    if (!session) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    removeFromQueue(track.id);
    try {
      await playSong(session.user.accessToken, track.uri);
    } catch (err) {
      console.error("Failed to play from queue", err);
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Queue</h3>
        {queue.length > 0 && (
          <button className={styles.clearBtn} onClick={clearQueue}>
            Clear All
          </button>
        )}
      </div>

      {currentTrack && (
        <div className={styles.nowPlayingSection}>
          <p className={styles.sectionLabel}>Now Playing</p>
          <div className={styles.queueItem}>
            <div className={styles.queueItemInfo}>
              {currentTrack?.album?.images?.[0]?.url ? (
                <img src={currentTrack.album.images[0].url} alt="" className={styles.queueThumb} />
              ) : (
                <div className={styles.queueThumb} />
              )}
              <div className={styles.queueText}>
                <p className={styles.queueTrackName}>{currentTrack.name}</p>
                <p className={styles.queueArtist}>{currentTrack.artists?.map(a => a.name).join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.queueSection}>
        <p className={styles.sectionLabel}>Next Up ({queue.length})</p>
        {queue.length === 0 ? (
          <p className={styles.emptyText}>Add songs to your queue</p>
        ) : (
          <div className={styles.queueList}>
            {queue.map((track, index) => (
              <div key={track.id} className={styles.queueItem}>
                <div className={styles.queueItemInfo}>
                  <span className={styles.queueIndex}>{index + 1}</span>
                  {track?.album?.images?.[0]?.url ? (
                    <img src={track.album.images[0].url} alt="" className={styles.queueThumb} />
                  ) : (
                    <div className={styles.queueThumb} />
                  )}
                  <div className={styles.queueText}>
                    <p className={styles.queueTrackName}>{track.name}</p>
                    <p className={styles.queueArtist}>{track.artists?.map(a => a.name).join(", ")}</p>
                  </div>
                </div>
                <div className={styles.queueActions}>
                  <button
                    className={styles.queueActionBtn}
                    onClick={() => handlePlayFromQueue(track, index)}
                    title="Play Now"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                  <button
                    className={styles.queueActionBtn}
                    onClick={() => removeFromQueue(track.id)}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
