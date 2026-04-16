const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
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
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    if (res.status === 204) return null; // Expected for some actions like play/pause
    throw new Error(`Error fetching API: ${res.status} ${res.statusText}`);
  }

  return res.status === 204 ? null : await res.json();
};
