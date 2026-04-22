import { NextResponse } from 'next/server';

// Generic fallback if API fails
const FALLBACK_PLAYLISTS: Record<string, { playlistId: string, ambientType: string }> = {
  "deep work": { playlistId: "37i9dQZF1DWZeKCadgRdKQ", ambientType: "Deep Focus" },
  "revision": { playlistId: "37i9dQZF1DX8Uebhn9wzrS", ambientType: "Chill Lofi Study Beats" },
  "quick tasks": { playlistId: "37i9dQZF1DX4sWSpwq3LiO", ambientType: "Peaceful Piano" }
};

export async function POST(req: Request) {
  try {
    const { focusMode } = await req.json();
    const lowercaseMode = (focusMode || "").toLowerCase();
    
    // 1. Get Spotify Client Credentials Access Token
    const authString = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    if (!tokenResponse.ok) {
      console.error("Spotify Auth Error:", await tokenResponse.text());
      return handleFallback(lowercaseMode);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Search Spotify for a playlist matching the focus Mode (e.g. "Deep Work Focus")
    const searchParams = new URLSearchParams({
       q: `${focusMode} focus`,
       type: 'playlist',
       limit: '1'
    });

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams.toString()}`, {
       headers: {
          'Authorization': `Bearer ${access_token}`
       }
    });

    if (!searchResponse.ok) {
       console.error("Spotify Search Error:", await searchResponse.text());
       return handleFallback(lowercaseMode);
    }

    const searchData = await searchResponse.json();
    
    if (searchData.playlists && searchData.playlists.items.length > 0) {
       const bestMatch = searchData.playlists.items[0];
       return NextResponse.json({
          playlistId: bestMatch.id,
          ambientType: bestMatch.name,
          source: "Live Dynamic Spotify"
       });
    }

    // 3. Fallback if search somehow returns empty
    return handleFallback(lowercaseMode);

  } catch (error) {
    console.error("Internal Music Fetch Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function handleFallback(mode: string) {
   let key = "deep work";
   if (mode.includes("revision")) key = "revision";
   if (mode.includes("quick")) key = "quick tasks";

   return NextResponse.json(FALLBACK_PLAYLISTS[key]);
}
