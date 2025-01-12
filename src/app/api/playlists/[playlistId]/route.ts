import { google } from "googleapis";

const youtube = google.youtube("v3");

export async function GET(
  req: Request,
  { params }: { params: { playlistId: string } },
) {
  // Await params to resolve it properly
  const { playlistId } = await params;

  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API Key is required" }), {
      status: 400,
    });
  }

  try {
    // Fetch videos in the specified playlist
    const response = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId,
      maxResults: 10,
      key: API_KEY,
    });

    const videos = response.data.items || [];

    // Ensure we're returning the expected array
    return new Response(JSON.stringify(videos), { status: 200 });
  } catch (error) {
    console.error("Error fetching playlist videos:", error);

    // Handle the case where the playlist doesn't exist
    if (error?.response?.status === 404) {
      return new Response(JSON.stringify({ error: "Playlist not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ error: "Failed to fetch playlist videos" }),
      { status: 500 },
    );
  }
}
