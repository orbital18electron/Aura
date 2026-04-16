"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createPlaylist } from "@/lib/spotify";
import styles from "./CreatePlaylistModal.module.css";
import { X } from "lucide-react";

export default function CreatePlaylistModal({ onClose }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !session) return;
    
    setIsSubmitting(true);
    try {
      await createPlaylist(session.user.accessToken, session.user.username, name, description);
      onClose(); // Close on success
      // Ideally trigger a context/store refresh of user playlists here
    } catch (err) {
      console.error("Failed to create playlist", err);
      alert("Failed to create playlist. Make sure you accepted the new Spotify permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        
        <h2>Create a playlist</h2>
        
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="playlist-name">Name</label>
            <input 
              id="playlist-name"
              type="text" 
              placeholder="My Awesome Playlist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="playlist-desc">Description (Optional)</label>
            <textarea 
              id="playlist-desc"
              placeholder="Vibes for the weekend..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
