"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = () => {
    setRotating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setRotating(false), 500);
  };

  return (
    <button 
      className={`${styles.toggleBtn} ${rotating ? styles.rotating : ""}`}
      onClick={handleToggle}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={20} className={styles.icon} /> : <Moon size={20} className={styles.icon} />}
    </button>
  );
}
