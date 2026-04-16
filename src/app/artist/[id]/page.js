import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getArtist, getArtistTopTracks, getArtistAlbums, getRelatedArtists } from "@/lib/spotify";
import { redirect } from "next/navigation";
import styles from "./artist.module.css";
import ArtistTrackCard from "./ArtistTrackCard";

export default async function ArtistPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const token = session.user.accessToken;

  const [artist, topTracksRes, albumsRes, relatedRes] = await Promise.all([
    getArtist(token, id).catch(() => null),
    getArtistTopTracks(token, id).catch(() => null),
    getArtistAlbums(token, id).catch(() => null),
    getRelatedArtists(token, id).catch(() => null),
  ]);

  if (!artist) {
    return <div className={styles.container}><p>Artist not found.</p></div>;
  }

  const topTracks = topTracksRes?.tracks || [];
  const albums = albumsRes?.items || [];
  const relatedArtists = relatedRes?.artists?.slice(0, 8) || [];
  const heroImage = artist.images?.[0]?.url;
  const genres = artist.genres || [];
  const followers = artist.followers?.total || 0;

  return (
    <div className={styles.container}>
      {/* Hero */}
      <div className={styles.hero}>
        {heroImage && (
          <img src={heroImage} alt={artist.name} className={styles.heroImg} />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.artistName}>{artist.name}</h1>
          <p className={styles.followers}>{followers.toLocaleString()} followers</p>
          <div className={styles.genres}>
            {genres.map((g) => (
              <span key={g} className={styles.genreTag}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular</h2>
          <div className={styles.trackList}>
            {topTracks.map((track, i) => (
              <ArtistTrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Discography</h2>
          <div className={styles.albumsGrid}>
            {albums.map((album) => (
              <div key={album.id} className={styles.albumCard}>
                {album.images?.[0]?.url && (
                  <img src={album.images[0].url} alt={album.name} className={styles.albumImg} />
                )}
                <p className={styles.albumName}>{album.name}</p>
                <p className={styles.albumYear}>
                  {album.release_date?.slice(0, 4)} · {album.album_type}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Fans Also Like</h2>
          <div className={styles.relatedGrid}>
            {relatedArtists.map((ra) => (
              <a key={ra.id} href={`/artist/${ra.id}`} className={styles.relatedCard}>
                {ra.images?.[0]?.url && (
                  <img src={ra.images[0].url} alt={ra.name} className={styles.relatedImg} />
                )}
                <p className={styles.relatedName}>{ra.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
