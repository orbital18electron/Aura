"use client";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/lib/store";
import styles from "./LyricsViewer.module.css";

function parseLrc(lrcText) {
  const lines = lrcText.split("\n");
  const parsed = [];

  for (let line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      const timeInMs = (minutes * 60 + seconds) * 1000;
      if (text) {
        parsed.push({ time: timeInMs, text });
      }
    }
  }
  return parsed;
}

export default function LyricsViewer() {
  const currentTrack = useStore((state) => state.currentTrack);
  const isPlaying = useStore((state) => state.isPlaying);
  const playingSince = useStore((state) => state.playingSince);

  const [lyrics, setLyrics] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!currentTrack) return;
    
    // Fetch lyrics from lrclib
    const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(currentTrack.name)}&artist_name=${encodeURIComponent(currentTrack.artists[0].name)}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0 && data[0].syncedLyrics) {
          setLyrics(parseLrc(data[0].syncedLyrics));
          setActiveLineIndex(-1);
        } else {
          setLyrics([{ time: 0, text: "Lyrics not available for this song." }]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch lyrics", err);
        setLyrics([{ time: 0, text: "Failed to load lyrics." }]);
      });
  }, [currentTrack]);

  // Interpolation loop to find active lyric
  useEffect(() => {
    if (!isPlaying || !playingSince || lyrics.length === 0) return;

    const interval = setInterval(() => {
      const currentMs = Date.now() - playingSince;
      
      let nextActiveIndex = -1;
      for (let i = 0; i < lyrics.length; i++) {
        if (currentMs >= lyrics[i].time) {
          nextActiveIndex = i;
        } else {
          break; // Since it's sorted
        }
      }

      if (nextActiveIndex !== activeLineIndex && nextActiveIndex !== -1) {
        setActiveLineIndex(nextActiveIndex);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playingSince, lyrics, activeLineIndex]);

  // Auto-scroll — scoped to lyrics container only (no page scroll leak)
  useEffect(() => {
    if (activeLineIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.children[activeLineIndex];
      if (activeEl) {
        const container = containerRef.current;
        const elTop = activeEl.offsetTop;
        const elHeight = activeEl.offsetHeight;
        const containerHeight = container.clientHeight;
        const targetScroll = elTop - containerHeight / 2 + elHeight / 2;
        container.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  }, [activeLineIndex]);

  if (!currentTrack) return null;

  return (
    <div className={styles.lyricsContainer}>
      <div className={styles.lyricsWrapper} ref={containerRef}>
        {lyrics.map((line, index) => (
          <p 
            key={index} 
            className={`${styles.lyricLine} ${index === activeLineIndex ? styles.active : ""}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
