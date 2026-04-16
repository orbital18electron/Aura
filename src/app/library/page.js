import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserPlaylists, getSavedTracks } from "@/lib/spotify";
import { redirect } from "next/navigation";
import Image from "next/image";
import TrackCard from "@/components/TrackCard";
import styles from "./library.module.css";
import pageStyles from "../page.module.css";
import { Music } from "lucide-react";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch both concurrently
  const [playlistsRes, savedTracksRes] = await Promise.all([
    getUserPlaylists(session.user.accessToken).catch(() => null),
    getSavedTracks(session.user.accessToken).catch(() => null)
  ]);

  const playlists = playlistsRes?.items || [];
  // saved tracks endpoint wraps tracks inside a `track` object
  const savedTracks = savedTracksRes?.items?.map(item => item.track) || [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Library</h1>
      </header>

      <section>
        <h2 className={styles.sectionTitle}>Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className={styles.emptyMessage}>You don't have any playlists yet.</p>
        ) : (
          <div className={styles.playlistsGrid}>
            {playlists.map((playlist) => (
              <div key={playlist.id} className={styles.playlistCard}>
                <div className={styles.coverWrapper}>
                  {playlist.images && playlist.images.length > 0 ? (
                    <Image 
                      src={playlist.images[0].url} 
                      alt={playlist.name} 
                      fill 
                      sizes="200px"
                      className={styles.coverImage}
                    />
                  ) : (
                    <Music size={40} className={styles.emptyCover} />
                  )}
                </div>
                <div className={styles.playlistInfo}>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.owner.display_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Liked Songs</h2>
        {savedTracks.length === 0 ? (
          <p className={styles.emptyMessage}>You haven't liked any songs yet.</p>
        ) : (
          <div className={styles.tracksGrid}>
            {savedTracks.map((track) => (
              <TrackCard key={track.id} track={track} styles={pageStyles} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
