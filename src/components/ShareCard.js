"use client";

import { useStore } from "@/lib/store";
import { useRef, useState } from "react";
import { Share2, Download, X } from "lucide-react";
import styles from "./ShareCard.module.css";

export default function ShareCard() {
  const currentTrack = useStore((state) => state.currentTrack);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  if (!currentTrack) return null;

  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || "Unknown";
  const artistName = currentTrack?.artists?.map(a => a.name).join(", ") || "Unknown";
  const albumName = currentTrack?.album?.name || "";

  const generateImage = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      return canvas;
    } catch (err) {
      console.error("Failed to generate share card", err);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const canvas = await generateImage();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `aura-${trackName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    const canvas = await generateImage();
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "aura-vibe.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: `${trackName} — ${artistName}`,
            text: `Listening to "${trackName}" by ${artistName} on Aura ✦ ऑरा`,
            files: [file],
          });
        } catch {
          // User cancelled share
        }
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "aura-vibe.png";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  return (
    <>
      <button className={styles.shareButton} onClick={() => setShowPreview(true)}>
        <Share2 size={16} />
        <span>Share Your Vibe</span>
      </button>

      {showPreview && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowPreview(false)}>
              <X size={24} />
            </button>

            {/* The card that gets captured */}
            <div ref={cardRef} className={styles.card}>
              <div className={styles.cardBg}>
                {albumArt && (
                  <img src={albumArt} alt="" className={styles.cardBgImg} crossOrigin="anonymous" />
                )}
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardStripe} />
                {albumArt && (
                  <img src={albumArt} alt={trackName} className={styles.cardAlbumArt} crossOrigin="anonymous" />
                )}
                <h2 className={styles.cardTrack}>{trackName}</h2>
                <p className={styles.cardArtist}>{artistName}</p>
                {albumName && <p className={styles.cardAlbum}>{albumName}</p>}
                <div className={styles.cardStripe} />
                <p className={styles.cardWatermark}>Aura ✦ ऑरा</p>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={handleDownload} disabled={generating}>
                <Download size={18} />
                <span>{generating ? "Generating…" : "Download"}</span>
              </button>
              <button className={styles.actionBtn} onClick={handleShare} disabled={generating}>
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
