export const dynamic = "force-dynamic";

import { getChannelUploadsPlaylistId, getPlaylistVideos } from "../lib/youtube";
import { groupVideosBySection } from "../lib/groupVideos";
import VideoSection from "../../components/VideoSection";

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export default async function HomePage() {
  const uploadsPlaylistId = await getChannelUploadsPlaylistId(CHANNEL_ID);
  const videos = uploadsPlaylistId
    ? await getPlaylistVideos(uploadsPlaylistId)
    : [];

  const sections = groupVideosBySection(videos);

  return (
    <div className="container mx-auto px-4 pt-[14vh]">
      <VideoSection title="Latest Videos" videos={sections.latest} />
      <VideoSection title="Live Streams" videos={sections.live} />
      <VideoSection title="Crusade" videos={sections.crusade} />
      <VideoSection title="Testimonies" videos={sections.testimony} />
      <VideoSection title="Deliverance" videos={sections.deliverance} />
      <VideoSection title="Praise and Worship" videos={sections.worship} />
      <VideoSection title="Celebration" videos={sections.celebration} />
      <VideoSection title="Others" videos={sections.others} />
    </div>
  );
}
