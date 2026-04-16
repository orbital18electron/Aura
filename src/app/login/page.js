"use client";

import { signIn } from "next-auth/react";
import styles from "./login.module.css";
import { Headphones } from "lucide-react";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <Headphones size={48} className={styles.icon} />
        <h1>Aura</h1>
      </div>
      <p className={styles.subtitle}>Your music. Your vibe. Your era.</p>
      <button className={styles.loginBtn} onClick={() => signIn("spotify", { callbackUrl: "/" })}>
        Continue with Spotify
      </button>
    </div>
  );
}
