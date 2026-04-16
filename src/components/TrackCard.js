"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { playSong } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { ListPlus, FolderPlus } from "lucide-react";
import { useState } from "react";
import AddToPlaylistModal from "./AddToPlaylistModal";

export default function TrackCard({ track, styles }) {
  const { data: session } = useSession();
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const addToQueue = useStore((state) => state.addToQueue);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const handlePlay = async () => {
    if (!session) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    try {
      await playSong(session.user.accessToken, track.uri);
    } catch (err) {
      console.error("Failed to play song.", err);
      setIsPlaying(false);
    }
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(track);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    setShowPlaylistModal(true);
  };

  const albumArt = track?.album?.images?.[0]?.url;

  return (
    <>
      <div className={styles.trackCard} onClick={handlePlay} role="button" tabIndex={0}>
        <div className={styles.imgWrapper}>
          {albumArt ? (
            <Image 
              src={albumArt} 
              alt={track.name} 
              width={80} 
              height={80} 
              className={styles.cover}
            />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
          )}
        </div>
        <div className={styles.info}>
          <h3>{track.name}</h3>
          <p>
            {track.artists?.map((a, i) => (
              <span key={a.id}>
                <Link
                  href={`/artist/${a.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-tertiary)'}
                  onMouseLeave={(e) => e.target.style.color = 'inherit'}
                >
                  {a.name}
                </Link>
                {i < track.artists.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.trackActions || ""} style={{
          display: 'flex', gap: '4px', flexShrink: 0,
          opacity: 0, transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <button
            onClick={handleAddToQueue}
            title="Add to Queue"
            style={{
              background: 'none', border: '1px solid var(--border-color)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-tertiary)'; e.currentTarget.style.borderColor = 'var(--accent-tertiary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <ListPlus size={14} />
          </button>
          <button
            onClick={handleAddToPlaylist}
            title="Add to Playlist"
            style={{
              background: 'none', border: '1px solid var(--border-color)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.borderColor = 'var(--accent-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal track={track} onClose={() => setShowPlaylistModal(false)} />
      )}
    </>
  );
}
