"use client";
import { useState } from "react";

interface VideoProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
  };
}

const VideoCard: React.FC<VideoProps> = ({ video }) => {
  const [play, setPlay] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
      {play ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <button onClick={() => setPlay(true)} className="relative w-full">
          {/* YouTube thumbnails are remote and unoptimised on purpose —
              adding them to next/image would need a remotePatterns entry. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="w-full h-48 object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-5xl">
            ▶
          </span>
        </button>
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{video.title}</h2>
      </div>
    </div>
  );
};

export default VideoCard;
