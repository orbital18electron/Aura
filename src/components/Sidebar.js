"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Library },
  ];

  return (
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
      </nav>

      <div className={styles.footer}>
        <button onClick={() => signOut()} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
