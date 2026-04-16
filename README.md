<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Spotify-API-1DB954?style=for-the-badge&logo=spotify" />
  <img src="https://img.shields.io/badge/Zustand-5-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-purple?style=for-the-badge&logo=framer" />
</p>

<h1 align="center">
  🪷 Aura — ऑरा
</h1>

<p align="center">
  <strong>A retro-maximalist music streaming experience inspired by 70s–80s Indian cinema aesthetics.</strong>
</p>

<p align="center">
  <em>Hand-painted Bollywood typography · Saffron & Sindoor palettes · Film-grain textures · Ornate gold borders</em>
</p>

<p align="center">
  <a href="#-features">Features</a> ·
  <a href="#-design-philosophy">Design</a> ·
  <a href="#️-tech-stack">Tech Stack</a> ·
  <a href="#-getting-started">Setup</a> ·
  <a href="#️-keyboard-shortcuts">Shortcuts</a> ·
  <a href="#-architecture">Architecture</a>
</p>

---

## ✨ Features

### 🎵 Core Playback
| Feature | Description |
|---------|-------------|
| **Now Playing** | Embedded on the home page with spinning vinyl album art, full playback controls (play/pause, skip), volume slider, and a live progress bar |
| **Remote Control** | Acts as a Spotify Connect remote — commands are sent to your active Spotify Desktop/Web Player device |
| **Progress Tracking** | Real-time elapsed/total time display with a gradient progress bar and hover dot indicator |
| **Volume Control** | Functional volume slider that calls the Spotify API (requires Premium + Desktop/Web Player) |
| **Dynamic Player Bar** | Bottom player bar with album-art-based color extraction — the background gradient shifts to match whatever you're listening to |

### 🎤 Lyrics
| Feature | Description |
|---------|-------------|
| **Synced Lyrics** | Real-time synchronized lyrics via the LRCLib API, auto-scrolling to the active line |
| **Collapsible Panel** | Toggle lyrics on/off with the 🎤 mic button in the player bar (or press `L`) — just like Spotify's desktop app |
| **Turquoise Glow** | Active lyric line glows in Indian turquoise with a subtle text shadow |

### 📋 Queue Management
| Feature | Description |
|---------|-------------|
| **Local Queue** | Add any track to your queue from any track card — hover to reveal the `+` button |
| **Queue Panel** | Toggle a slide-in queue panel from the player bar (or press `Q`) showing "Now Playing" and "Next Up" |
| **Queue Actions** | Play any queued track immediately, remove individual tracks, or clear the entire queue |

### 🎨 Social Sharing Cards
| Feature | Description |
|---------|-------------|
| **"Share Your Vibe"** | One-click button in the Now Playing section generates a stunning retro-styled card |
| **Card Design** | Blurred album art background, track/artist info in Teko/Rajdhani fonts, tri-color saffron→gold→turquoise stripes, and an "Aura ✦ ऑरा" watermark |
| **Export Options** | Download as PNG or share via the native OS share dialog (on supported browsers) |

### 🎤 Artist Deep-Dive
| Feature | Description |
|---------|-------------|
| **Artist Page** | Click any artist name → full `/artist/[id]` page with large hero image, follower count, and genre tags |
| **Top Tracks** | Numbered list of the artist's top 10 tracks — fully playable with queue support |
| **Discography** | Album/single grid with cover art, release year, and hover zoom effects |
| **Related Artists** | Circular avatar carousel of "Fans Also Like" artists — click to navigate to their page |

### 🎵 Smart Recommendations
| Feature | Description |
|---------|-------------|
| **"If you like this…"** | Appears below the Now Playing section, showing 5 related tracks seeded by whatever you're currently listening to |
| **Instant Play** | Click any recommendation to play it immediately |
| **Add to Queue** | Hover to reveal a queue button on each recommendation |

### ⌨️ Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Skip Forward |
| `←` | Skip Back |
| `L` | Toggle Lyrics |
| `Q` | Toggle Queue |
| `M` | Mute / Unmute |
| `?` | Show Shortcuts Help |

> Press `?` anywhere to see a retro-styled help modal with all shortcuts.

### 🌙 Theme System
| Feature | Description |
|---------|-------------|
| **Dark Mode** | Deep mahogany & rosewood backgrounds with glowing saffron and turquoise accents |
| **Light Mode** | Aged parchment & cream backgrounds with warm terracotta tones |
| **Animated Toggle** | Sun/Moon icon spins 360° with a scale bounce on toggle |
| **Smooth Transition** | Background and text colors transition over 0.5s for a cinematic feel |

### 📱 Responsive Design
| Feature | Description |
|---------|-------------|
| **Mobile Layout** | Sidebar collapses into a bottom icon-only tab bar at `≤768px` |
| **Full-screen Panels** | Lyrics and queue panels become full-screen overlays on mobile |
| **Responsive Typography** | Heading sizes scale down gracefully for smaller screens |

---

## 🎨 Design Philosophy

Aura rejects the flat, minimalist aesthetic of modern streaming apps in favor of a **retro-maximalist** approach inspired by:

- 🎬 **Vintage Bollywood** — hand-painted movie poster typography, dramatic color contrasts
- 🏪 **Chai-stall signage** — bold condensed lettering, stacked uppercase text
- 🇮🇳 **Indian tricolor** — saffron, gold, and turquoise accent stripes throughout the UI
- 📽️ **Old cinema** — film-grain texture overlay, warm glow shadows, ornate gold borders

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Sindoor Red | `#e85d26` / `#f07030` | Primary accent, CTA buttons, active states |
| Harvest Gold | `#d4a940` / `#e8b84d` | Secondary accent, borders, text shadows |
| Indian Turquoise | `#0e9aa7` / `#14c4d0` | Tertiary accent, navigation, lyrics glow |
| Parchment | `#faf3e8` | Light mode background |
| Mahogany | `#140a06` | Dark mode background |

### Typography

| Font | Style | Usage |
|------|-------|-------|
| **Teko** | Bold condensed | Display headings, track names, buttons |
| **Rajdhani** | Geometric Indian | Body text, labels, metadata |
| **Yatra One** | Devanagari-inspired | Accent headings, greeting text |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Server Components) |
| UI Library | **React 19** |
| State Management | **Zustand 5** |
| Animation | **Framer Motion 11** |
| Image Generation | **html2canvas** |
| Authentication | **NextAuth 4** (Spotify OAuth) |
| Theming | **next-themes** |
| Icons | **Lucide React** |
| Styling | **CSS Modules** (vanilla CSS, no Tailwind) |
| Lyrics | **LRCLib API** (free, open-source synced lyrics) |
| Music Data | **Spotify Web API** |
| Deployment | **Vercel** |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Spotify Developer Account** — [Create an app](https://developer.spotify.com/dashboard) to get your Client ID and Secret
- **Spotify Premium** — Required for playback control (free accounts can still browse)

### 1. Clone & Install

```bash
git clone https://github.com/orbital18electron/Aura.git
cd Aura
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string
```

> **Important**: In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add `http://localhost:3000/api/auth/callback/spotify` as a Redirect URI.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your Spotify account.

### 4. How Playback Works

Aura acts as a **remote control** for Spotify. You must have an active Spotify device (Desktop app or Web Player) running in the background. When you click play in Aura, it sends commands to that active device.

---

## 🏗️ Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.js                 # Home — greeting, Now Playing, top tracks, recently played
│   ├── search/page.js          # Search with debounced Spotify API calls
│   ├── library/page.js         # User playlists and liked songs
│   ├── profile/page.js         # User profile with stats and top artists
│   ├── artist/[id]/page.js     # Artist deep-dive (SSR)
│   ├── login/page.js           # OAuth login page
│   └── api/auth/[...nextauth]/ # NextAuth Spotify provider + token refresh
│
├── components/                 # React components
│   ├── LayoutShell.js          # Main grid layout (sidebar + content + panel + player)
│   ├── Player.js               # Bottom player bar with controls + progress
│   ├── NowPlaying.js           # Home page embedded player with vinyl animation
│   ├── LyricsViewer.js         # Synced lyrics with auto-scroll
│   ├── QueuePanel.js           # Queue management sidebar
│   ├── Sidebar.js              # Navigation + responsive bottom tab bar
│   ├── TrackCard.js            # Reusable track card with play + queue + artist links
│   ├── ShareCard.js            # Social sharing card generator
│   ├── Recommendations.js      # Seed-based track recommendations
│   ├── KeyboardShortcuts.js    # Global keyboard event listener + help modal
│   ├── PageTransition.js       # Framer Motion page entry animation
│   ├── ThemeToggle.js          # Animated dark/light mode toggle
│   └── CreatePlaylistModal.js  # Playlist creation form
│
├── lib/
│   ├── spotify.js              # All Spotify Web API functions (20+ endpoints)
│   └── store.js                # Zustand global state (playback, queue, UI toggles)
│
└── app/globals.css             # Design system — colors, typography, film-grain, responsive
```

---

## 📡 Spotify API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/me` | User profile |
| `GET /v1/me/top/tracks` | Top tracks |
| `GET /v1/me/top/artists` | Top artists |
| `GET /v1/me/player/recently-played` | Recently played |
| `GET /v1/me/playlists` | User playlists |
| `GET /v1/me/tracks` | Liked songs |
| `GET /v1/search` | Search tracks |
| `PUT /v1/me/player/play` | Play a track |
| `PUT /v1/me/player/pause` | Pause playback |
| `PUT /v1/me/player/volume` | Set volume |
| `POST /v1/me/player/queue` | Add to queue |
| `GET /v1/artists/{id}` | Artist details |
| `GET /v1/artists/{id}/top-tracks` | Artist top tracks |
| `GET /v1/artists/{id}/albums` | Artist albums |
| `GET /v1/artists/{id}/related-artists` | Related artists |
| `GET /v1/recommendations` | Track recommendations |
| `POST /v1/users/{id}/playlists` | Create playlist |
| `PUT /v1/playlists/{id}/images` | Upload playlist cover |

---

## 📄 License

MIT — build something beautiful with it.

---

<p align="center">
  <em>Built with 🪷 and an unhealthy amount of chai.</em>
</p>
