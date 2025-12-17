import VideoCard from "./VideoCard";
import Link from "next/link";

interface Props {
  title: string;
  videos?: any[];
  viewAllLink?: string;
}

const VideoSection = ({ title, videos = [], viewAllLink }: Props) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-950">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <button className="text-blue-600 hover:text-blue-800 font-semibold">
              View All →
            </button>
          </Link>
        )}
      </div>

      {videos.length ? (
        <div className="overflow-x-auto flex space-x-4 py-2">
          {videos.map((video) => (
            <div key={video.id} className="min-w-[300px] flex-shrink-0">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No videos found.</p>
      )}
    </section>
  );
};

export default VideoSection;
