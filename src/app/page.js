import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { fetchWebApi } from "@/lib/spotify";
import styles from "./page.module.css";
import Image from "next/image";
import { redirect } from "next/navigation";

async function getTopTracks(token) {
  try {
    return await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET', null, token);
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const topTracks = await getTopTracks(session.user.accessToken);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Good Evening.</h1>
        <p className={styles.subtitle}>Here are your current obsessions.</p>
      </header>

      <section className={styles.tracksGrid}>
        {topTracks?.items?.map((track) => (
          <div key={track.id} className={styles.trackCard}>
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
        ))}
        {(!topTracks || !topTracks.items) && (
          <p className={styles.subtitle}>Please engage with some tracks to see recommendations.</p>
        )}
      </section>
    </div>
  );
}
