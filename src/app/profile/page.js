import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserProfile, getUserTopArtists } from "@/lib/spotify";
import { redirect } from "next/navigation";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import styles from "./profile.module.css";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [profile, topArtistsRes] = await Promise.all([
    getUserProfile(session.user.accessToken).catch(() => null),
    getUserTopArtists(session.user.accessToken).catch(() => null),
  ]);

  const topArtists = topArtistsRes?.items || [];
  const avatarUrl = profile?.images?.[0]?.url || null;
  const displayName = profile?.display_name || session.user.name || "User";
  const followers = profile?.followers?.total ?? 0;
  const country = profile?.country || "—";
  const productType = profile?.product === "premium" ? "Spotify Premium" : "Spotify Free";

  return (
    <PageTransition>
    <div className={styles.container}>
      {/* Hero section */}
      <div className={styles.hero}>
        {avatarUrl ? (
          <div className={styles.avatarWrapper}>
            <Image src={avatarUrl} alt={displayName} fill sizes="140px" style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <div className={styles.avatarPlaceholder}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.heroInfo}>
          <p className={styles.userBadge}>Profile</p>
          <h1 className={styles.userName}>{displayName}</h1>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{followers.toLocaleString()}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{country}</span>
              <span className={styles.statLabel}>Country</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{productType}</span>
              <span className={styles.statLabel}>Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists */}
      {topArtists.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Your Top Artists</h2>
          <div className={styles.artistsGrid}>
            {topArtists.map((artist) => (
              <div key={artist.id} className={styles.artistCard}>
                {artist.images?.[0]?.url ? (
                  <div className={styles.artistImageWrapper}>
                    <Image
                      src={artist.images[0].url}
                      alt={artist.name}
                      fill
                      sizes="100px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className={styles.artistPlaceholder}>
                    <User size={36} />
                  </div>
                )}
                <span className={styles.artistName}>{artist.name}</span>
                {artist.genres?.[0] && (
                  <span className={styles.artistGenres}>{artist.genres.slice(0, 2).join(", ")}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
    </PageTransition>
  );
}
