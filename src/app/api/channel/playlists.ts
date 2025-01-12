import { google } from "googleapis";

const youtube = google.youtube("v3");

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } },
) {
  const { channelId } = params;

  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API Key is required" }), {
      status: 400,
    });
  }

  try {
    const response = await youtube.playlists.list({
      part: ["snippet", "contentDetails"],
      channelId,
      maxResults: 10,
      key: API_KEY,
    });

    const playlists = response.data.items || [];

    return new Response(JSON.stringify(playlists), { status: 200 });
  } catch (error) {
    console.error("Error fetching channel playlists:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch channel playlists" }),
      { status: 500 },
    );
  }
}
