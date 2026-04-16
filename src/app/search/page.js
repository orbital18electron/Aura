"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { searchSpotify } from "@/lib/spotify";
import TrackCard from "@/components/TrackCard";
import styles from "./search.module.css";
import pageStyles from "../page.module.css"; // Borrowing layout styles for TrackCard consistency
import { Search } from "lucide-react";

export default function SearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim() || !session) {
      setResults([]);
      return;
    }

    const timerId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchSpotify(session.user.accessToken, query);
        if (data && data.tracks) {
          setResults(data.tracks.items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [query, session]);

  return (
    <div className={styles.container}>
      <div className={styles.searchHeader}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
        </div>
      </div>

      <div className={styles.resultsSection}>
        {query && <h2>Top Results</h2>}
        
        {isSearching && <p className={styles.loading}>Searching...</p>}
        
        {!isSearching && query && results.length === 0 && (
          <p className={styles.empty}>No tracks found for "{query}"</p>
        )}

        {!isSearching && results.length > 0 && (
          <div className={styles.tracksGrid}>
            {results.map((track) => (
              <TrackCard key={track.id} track={track} styles={pageStyles} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
