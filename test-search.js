const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('./.env.local');

async function test() {
  const authHeader = Buffer.from(
    "0ff93041044d4ef7886265556369fb50" + ":" + "15da5707a2b44a4280ebd5dcaea43a3b"
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body: "grant_type=client_credentials",
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  console.log("Got token:", token.substring(0, 5) + "...");
  const res = await fetch(`https://api.spotify.com/v1/search?q=Alan%20Walker&type=track&limit=20`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Items count:", data.tracks?.items?.length);
  if (data.tracks?.items?.length === 0) {
     console.log("WTF full data:", JSON.stringify(data, null, 2));
  }
}
test();
