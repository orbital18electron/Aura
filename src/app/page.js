import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { fetchWebApi, getRecentlyPlayed } from "@/lib/spotify";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TrackCard from "@/components/TrackCard";

async function getTopTracks(token) {
  try {
    return await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET', null, token);
  } catch (err) {
    return null;
  }
}

async function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [topTracks, recentRes] = await Promise.all([
    getTopTracks(session.user.accessToken),
    getRecentlyPlayed(session.user.accessToken).catch(() => null),
  ]);

  // De-duplicate recently played by track id
  const seen = new Set();
  const recentTracks = (recentRes?.items || [])
    .map(item => item.track)
    .filter(track => {
      if (!track || seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    });

  const greeting = await getGreeting();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>{greeting}.</h1>
        <p className={styles.subtitle}>Here are your current obsessions.</p>
      </header>

      <section>
        <h2 className={styles.sectionTitle}>Your Top Tracks</h2>
        <div className={styles.tracksGrid}>
          {topTracks?.items?.map((track) => (
            <TrackCard key={track.id} track={track} styles={styles} />
          ))}
          {(!topTracks || !topTracks.items) && (
            <p className={styles.subtitle}>Play some tracks on Spotify to see recommendations here.</p>
          )}
        </div>
      </section>

      {recentTracks.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Recently Played</h2>
          <div className={styles.tracksGrid}>
            {recentTracks.map((track) => (
              <TrackCard key={track.id} track={track} styles={styles} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
