"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { use } from "react";
import { Navbar } from "@/app/components/Navbar";
import { MultiStepLoader } from "@/app/components/ui/multi-step-loader";
import Image from "next/image";
import { cn } from "../../../../lib/utils";
import { AnimatedTestimonialsDemo } from "@/app/components/PlayListDetails";
import { AnimatedTestimonials } from "@/app/components/ui/animated-testimonials";

const PlaylistPage = ({ params }: { params: { playlistId: string } }) => {
  const loadingStates = [
    {
      text: "Gathering YouTube data...",
    },
    {
      text: "Spinning the YouTube wheel...",
    },
    {
      text: "Connecting to your video universe...",
    },
    {
      text: "Loading your playlist adventures...",
    },
    {
      text: "Almost ready... 🎥",
    },
  ];
  const { playlistId } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  interface PlaylistDetails {
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        high: {
          url: string;
        };
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }
  [];
  const [playlistDetails, setPlaylistDetails] = useState<any[]>([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && playlistId) {
      const fetchPlaylistData = async () => {
        try {
          const res = await fetch(`/api/playlists/${playlistId}`, {
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch playlist details");
          }

          const data = await res.json();
          console.log(`\n ~ fetchPlaylistData ~ data :- `, data);

          setPlaylistDetails(data || null);
          setVideos(data.videos || []);
        } catch (err) {
          console.error("Error fetching playlist data:", err);
          setError("Failed to fetch playlist details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchPlaylistData();
    }
  }, [status, playlistId, router]);

  if (loading) {
    return (
      <>
        <MultiStepLoader
          loadingStates={loadingStates}
          duration={500}
          loading={loading}
        />
        <Navbar />
      </>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!playlistDetails) {
    return <p>No playlist details found.</p>;
  }
  console.log(`\n ~ PlaylistPage ~ playlistDetails :- `, playlistDetails);
  const formatDescription = (description: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return description.split("\n").map((line, index) => {
      return (
        <p key={index}>
          {line.split(urlRegex).map((part, idx) => {
            if (urlRegex.test(part)) {
              return (
                <a
                  key={idx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {part}
                </a>
              );
            }
            return part; // Otherwise return text
          })}
        </p>
      );
    });
  };
  const formattedPlaylistDetails =
    playlistDetails.map((video: any) => ({
      quote: video.snippet.description,
      name: video.snippet.title,
      designation: video.snippet.videoOwnerChannelTitle,
      src: video.snippet?.thumbnails?.standard?.url,
      videoId: video?.snippet?.resourceId?.videoId,
    })) || [];
  console.log(
    `\n ~ PlaylistPage ~ formattedPlaylistDetails :- `,
    formattedPlaylistDetails,
  );

  return (
    <>
      <Navbar />
      <div className="mb-6 flex mt-32 flex-wrap gap-8  justify-center">
        <AnimatedTestimonials testimonials={formattedPlaylistDetails} />
      </div>
    </>
  );
};

export default PlaylistPage;
