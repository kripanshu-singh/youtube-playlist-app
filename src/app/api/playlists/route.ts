import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const youtube = google.youtube("v3");

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { accessToken } = session;
  console.log("Access Token:", accessToken);

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  try {
    // Fetch all playlists owned by the user
    const response = await youtube.playlists.list({
      auth,
      part: ["snippet", "contentDetails", "status"],
      mine: true,
      maxResults: 50, // Fetch up to 50 playlists
    });

    const playlists = response?.data?.items || [];
    // console.log(`\n ~ GET ~ playlists :- `, playlists);

    // Enrich playlists with video count
    const enrichedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const detailsResponse = await youtube.playlistItems.list({
          auth,
          part: ["snippet"],
          playlistId: playlist.id!,
          maxResults: 1, // Fetch at least one video to get a count
        });
        // console.log(`\n ~ playlists.map ~ details :- `, details?.data?.items[0]);
        const details = detailsResponse?.data?.items || [];
        const videoCount = playlist.contentDetails?.itemCount || 0;
        const privacyStatus = playlist.status?.privacyStatus || "unknown"; // Privacy status: public, private, unlisted

        return {
          ...playlist,
          snippet: {
            ...playlist.snippet,
            videoCount,
            privacyStatus,
          },
          details,
        };
      }),
    );
    console.log(`\n ~ GET ~ enrichedPlaylists :- `, enrichedPlaylists);

    return new Response(JSON.stringify(enrichedPlaylists), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching playlists:", error);

    // Log more details for debugging
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else if (error.message) {
      console.error("Error Message:", error.message);
    }

    return new Response(
      JSON.stringify({ error: "Failed to fetch playlists" }),
      { status: 500 },
    );
  }
}
