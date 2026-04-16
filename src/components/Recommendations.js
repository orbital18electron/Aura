"use client";

import { useStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { getRecommendations, playSong } from "@/lib/spotify";
import { useState, useEffect } from "react";
import { Play, ListPlus } from "lucide-react";
import styles from "./Recommendations.module.css";

export default function Recommendations() {
  const { data: session } = useSession();
  const currentTrack = useStore((state) => state.currentTrack);
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const addToQueue = useStore((state) => state.addToQueue);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    if (!currentTrack?.id || !session) {
      setRecs([]);
      return;
    }

    let cancelled = false;
    getRecommendations(session.user.accessToken, [currentTrack.id])
      .then((data) => {
        if (!cancelled && data?.tracks) {
          setRecs(data.tracks.slice(0, 5));
        }
      })
      .catch(() => {
        if (!cancelled) setRecs([]);
      });

    return () => { cancelled = true; };
  }, [currentTrack?.id, session]);

  if (recs.length === 0) return null;

  const handlePlay = async (track) => {
    if (!session) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    try {
      await playSong(session.user.accessToken, track.uri);
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>If you like this…</h4>
      <div className={styles.recList}>
        {recs.map((track) => (
          <div key={track.id} className={styles.recCard} onClick={() => handlePlay(track)}>
            {track.album?.images?.[0]?.url && (
              <img src={track.album.images[0].url} alt="" className={styles.recImg} />
            )}
            <div className={styles.recInfo}>
              <p className={styles.recName}>{track.name}</p>
              <p className={styles.recArtist}>{track.artists?.map(a => a.name).join(", ")}</p>
            </div>
            <button
              className={styles.recQueueBtn}
              onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
              title="Add to Queue"
            >
              <ListPlus size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
