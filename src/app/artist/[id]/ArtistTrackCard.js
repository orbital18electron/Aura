"use client";

import { useStore } from "@/lib/store";
import { playSong } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { Play, ListPlus } from "lucide-react";
import styles from "./artist.module.css";

export default function ArtistTrackCard({ track, index }) {
  const { data: session } = useSession();
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const addToQueue = useStore((state) => state.addToQueue);

  const handlePlay = async () => {
    if (!session) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    try {
      await playSong(session.user.accessToken, track.uri);
    } catch (err) {
      console.error("Playback error", err);
      setIsPlaying(false);
    }
  };

  const albumArt = track?.album?.images?.[0]?.url;

  return (
    <div className={styles.trackRow} onClick={handlePlay} role="button" tabIndex={0}>
      <span className={styles.trackIndex}>{index}</span>
      {albumArt ? (
        <img src={albumArt} alt="" className={styles.trackThumb} />
      ) : (
        <div className={styles.trackThumb} />
      )}
      <div className={styles.trackInfo}>
        <p className={styles.trackName}>{track.name}</p>
        <p className={styles.trackAlbum}>{track.album?.name}</p>
      </div>
      <span className={styles.trackDuration}>
        {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
      </span>
      <button
        className={styles.trackQueueBtn}
        onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
        title="Add to Queue"
      >
        <ListPlus size={16} />
      </button>
    </div>
  );
}
