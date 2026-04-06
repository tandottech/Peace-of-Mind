import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { focusMode } = await req.json();
    
    // In a real application, an LLM agent could generate a dynamic query 
    // to search Spotify APIs. For this implementation, we return curated Spotify IFrame IDs.
    
    let suggestedMusic = {
      playlistId: "37i9dQZF1DWZeKCadgRdKQ", // Default "Deep Focus"
      ambientType: "Ambient Focus"
    };

    const lowercaseMode = (focusMode || "").toLowerCase();

    if (lowercaseMode.includes("deep work")) {
      suggestedMusic.playlistId = "0vvXsWCC9xrXsKd4FsNdNc"; // Lofi Girl (Lofi Beats)
      suggestedMusic.ambientType = "Lofi Beats";
    } else if (lowercaseMode.includes("revision")) {
      suggestedMusic.playlistId = "37i9dQZF1DX8Uebhn9wzrS"; // Chill Lofi Study Beats
      suggestedMusic.ambientType = "Acoustic / Ambient";
    } else if (lowercaseMode.includes("quick")) {
      suggestedMusic.playlistId = "37i9dQZF1DX4sWSpwq3LiO"; // Peaceful Piano
      suggestedMusic.ambientType = "Piano Instrumental";
    }

    return NextResponse.json(suggestedMusic);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
