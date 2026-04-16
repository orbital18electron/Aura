"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserPlaylists, addTrackToPlaylist } from "@/lib/spotify";
import { X, Check, Music, Loader2 } from "lucide-react";
import styles from "./AddToPlaylistModal.module.css";

export default function AddToPlaylistModal({ track, onClose }) {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState(null);
  const [addedTo, setAddedTo] = useState(new Set());

  useEffect(() => {
    if (!session) return;
    getUserPlaylists(session.user.accessToken)
      .then((data) => {
        // Only show playlists owned by the user (can't add to others')
        const owned = (data?.items || []).filter(
          (p) => p.owner?.id === session.user.username
        );
        setPlaylists(owned);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleAdd = async (playlistId) => {
    if (!session || addingTo) return;
    setAddingTo(playlistId);
    try {
      await addTrackToPlaylist(session.user.accessToken, playlistId, track.uri);
      setAddedTo((prev) => new Set([...prev, playlistId]));
    } catch (err) {
      console.error("Failed to add to playlist", err);
    } finally {
      setAddingTo(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={22} />
        </button>

        <h3 className={styles.title}>Add to Playlist</h3>
        <p className={styles.trackLabel}>
          {track.name} — {track.artists?.map((a) => a.name).join(", ")}
        </p>

        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={24} className={styles.spinner} />
          </div>
        ) : playlists.length === 0 ? (
          <p className={styles.emptyMsg}>No playlists found. Create one first!</p>
        ) : (
          <div className={styles.playlistList}>
            {playlists.map((pl) => (
              <button
                key={pl.id}
                className={`${styles.playlistRow} ${addedTo.has(pl.id) ? styles.added : ""}`}
                onClick={() => handleAdd(pl.id)}
                disabled={addingTo === pl.id || addedTo.has(pl.id)}
              >
                <div className={styles.playlistCover}>
                  {pl.images?.[0]?.url ? (
                    <img src={pl.images[0].url} alt="" className={styles.coverImg} />
                  ) : (
                    <Music size={18} />
                  )}
                </div>
                <div className={styles.playlistInfo}>
                  <span className={styles.playlistName}>{pl.name}</span>
                  <span className={styles.playlistCount}>{pl.tracks?.total || 0} tracks</span>
                </div>
                <div className={styles.playlistAction}>
                  {addedTo.has(pl.id) ? (
                    <Check size={18} className={styles.checkIcon} />
                  ) : addingTo === pl.id ? (
                    <Loader2 size={16} className={styles.spinner} />
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
