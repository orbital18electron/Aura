"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, LogOut, Plus, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import CreatePlaylistModal from "./CreatePlaylistModal";

export default function Sidebar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Library },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>Aura.</h2>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.label} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button className={styles.navItem} onClick={() => setShowModal(true)}>
            <Plus size={20} />
            <span>Create Playlist</span>
          </button>
        </nav>

        <div className={styles.footer}>
          <button onClick={() => signOut()} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
    </>
  );
}
