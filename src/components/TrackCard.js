"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";
import { playSong } from "@/lib/spotify";
import { useSession } from "next-auth/react";

export default function TrackCard({ track, styles }) {
  const { data: session } = useSession();
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);

  const handlePlay = async () => {
    if (!session) return;
    
    // Update global state immediately for fast UI feedback
    setCurrentTrack(track);
    setIsPlaying(true);

    try {
      await playSong(session.user.accessToken, track.uri);
    } catch (err) {
      console.error("Failed to play song. Make sure you have an active Spotify device open.", err);
      setIsPlaying(false);
      alert(err.message || "Failed to start playback. Make sure you have Spotify open on a device!");
    }
  };

  return (
    <div className={styles.trackCard} onClick={handlePlay} role="button" tabIndex={0}>
      <div className={styles.imgWrapper}>
        <Image 
          src={track.album.images[0].url} 
          alt={track.name} 
          width={80} 
          height={80} 
          className={styles.cover}
        />
      </div>
      <div className={styles.info}>
        <h3>{track.name}</h3>
        <p>{track.artists.map(a => a.name).join(", ")}</p>
      </div>
    </div>
  );
}
