const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read"
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params).toString();

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString}`;

// A centralized fetch helper for making calls to the Spotify Web API
export const fetchWebApi = async (endpoint, method, body, token) => {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === 'POST' || method === 'PUT' ? { 'Content-Type': 'application/json' } : {})
    },
    method,
    cache: 'no-store',
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (!res.ok) {
    if (res.status === 204) return null; // Expected for some actions like play/pause
    let errorDetail = "";
    try {
      const errorData = await res.json();
      errorDetail = errorData.error?.message || JSON.stringify(errorData);
    } catch(e) {}
    throw new Error(`Error ${res.status}: ${errorDetail || res.statusText}`);
  }

  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const playSong = async (token, trackUri) => {
  return await fetchWebApi('v1/me/player/play', 'PUT', { uris: [trackUri] }, token);
};

export const pauseSong = async (token) => {
  return await fetchWebApi('v1/me/player/pause', 'PUT', null, token);
};

export const createPlaylist = async (token, userId, name, description) => {
  return await fetchWebApi(`v1/users/${userId}/playlists`, 'POST', {
    name,
    description,
    public: false
  }, token);
};

export const searchSpotify = async (token, query) => {
  return await fetchWebApi(`v1/search?q=${encodeURIComponent(query)}&type=track`, 'GET', null, token);
};

export const getUserPlaylists = async (token) => {
  return await fetchWebApi(`v1/me/playlists?limit=20`, 'GET', null, token);
};

export const getSavedTracks = async (token) => {
  return await fetchWebApi(`v1/me/tracks?limit=24`, 'GET', null, token);
};

export const setVolume = async (token, volume) => {
  return await fetchWebApi(`v1/me/player/volume?volume_percent=${volume}`, 'PUT', null, token);
};

export const getRecentlyPlayed = async (token) => {
  return await fetchWebApi(`v1/me/player/recently-played?limit=10`, 'GET', null, token);
};

export const getUserProfile = async (token) => {
  return await fetchWebApi(`v1/me`, 'GET', null, token);
};

export const getUserTopArtists = async (token) => {
  return await fetchWebApi(`v1/me/top/artists?limit=10`, 'GET', null, token);
};
