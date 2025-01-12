"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { MultiStepLoader } from "./components/ui/multi-step-loader";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { HeroHighlightDemo } from "./components/HeroPage";

const HomePage = () => {
  const loadingStates = [
    { text: "Gathering YouTube data..." },
    { text: "Fetching your playlists..." },
    { text: "Grabbing the popcorn for your videos..." },
    { text: "Connecting to your video universe..." },
    { text: "Loading your playlist adventures..." },
    { text: "Almost ready... 🎥" },
  ];

  const { data: session, status } = useSession();
  const router = useRouter();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const sortPlaylists = (playlists: any[]) => {
    return playlists.sort((a, b) => {
      const order = {
        public: 1,
        unlisted: 2,
        private: 3,
      };
      return order[a.status.privacyStatus] - order[b.status.privacyStatus];
    });
  };

  // Fetch playlists
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/playlists")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Failed to fetch playlists:", data.error);
            alert("Failed to fetch playlists. Please try again later.");
          } else {
            const sortedPlaylists = sortPlaylists(data); // Sort playlists
            console.log(`\n ~ .then ~ sortedPlaylists :- `, sortedPlaylists);
            setPlaylists(sortedPlaylists); // Set sorted playlists
          }
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error);
          alert("An unexpected error occurred. Please try again later.");
        });
    }
  }, [status]);

  const handlePlaylistClick = (playlistId: string, privacyStatus: string) => {
    if (privacyStatus === "private") {
      setFeedbackMessage(
        "Sorry, the YouTube Data API v3 does not allow access to private playlists.",
      );
      return;
    }
    router.push(`/playlists/${playlistId}`);
  };

  const closeFeedback = () => {
    setFeedbackMessage(null);
  };

  if (status === "loading") return <p></p>;
  if (status === "unauthenticated")
    return (
      <>
        <Navbar />
        <HeroHighlightDemo />
      </>
    );

  return (
    <div>
      <Navbar className="z-50" />
      {!(playlists.length > 0) && (
        <MultiStepLoader
          loadingStates={loadingStates}
          duration={500}
          loading={true}
        />
      )}
      <div className="pb-[50px] overflow-y-auto h-[calc(100dvh-150px)] flex flex-wrap gap-8 justify-center -z-50">
        {playlists.length > 0 &&
          playlists.map((playlist) => (
            <div className="group/card" key={playlist.id}>
              <div
                className={cn(
                  "cursor-pointer overflow-hidden relative card h-96 rounded-2xl shadow-xl mx-auto flex flex-col justify-between p-4",
                )}
                style={{
                  height: "300px",
                  width: "500px",
                  backgroundImage: `url(${playlist.snippet?.thumbnails?.maxres?.url})`,
                  backgroundSize: "cover",
                }}
                onClick={() =>
                  handlePlaylistClick(
                    playlist.id,
                    playlist.status.privacyStatus,
                  )
                }
              >
                <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-40"></div>
                <div className="absolute inset-0 bg-black/40 blur-md transition-all duration-500 group-hover:blur-none group-hover:bg-black/5"></div>
                <div className="flex flex-row items-center space-x-4 z-10">
                  <Image
                    height="100"
                    width="100"
                    alt="Playlist Thumbnail"
                    src={playlist.snippet?.thumbnails?.medium?.url}
                    className="h-10 w-10 rounded-full border-2 object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="font-normal text-base text-gray-50 relative z-10">
                      {playlist.snippet?.title || "No title available"}
                    </p>
                    <p className="font-bold text-pretty text-gray-400">
                      <span>Video count: </span>
                      {playlist.snippet.videoCount}
                    </p>
                  </div>
                </div>
                <div className="text content">
                  <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                    {playlist.snippet.title}
                    <div>
                      {playlist.status.privacyStatus === "private" && (
                        <p className="border w-min border-red-500 bg-red-100  text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
                          Private
                        </p>
                      )}
                      {playlist.status.privacyStatus === "public" && (
                        <p className="border w-min border-green-500 bg-green-100  text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
                          Public
                        </p>
                      )}
                      {playlist.status.privacyStatus === "unlisted" && (
                        <p className="border w-min border-blue-500 bg-blue-100  text-blue-600 text-xs rounded-full px-2 py-0.5 mt-4">
                          Unlisted
                        </p>
                      )}
                    </div>
                  </h1>
                  <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                    {playlist.snippet.description ||
                      "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Feedback Modal */}
      {feedbackMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-gray-800">{feedbackMessage}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={closeFeedback}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
