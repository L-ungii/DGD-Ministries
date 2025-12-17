const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const getChannelUploadsPlaylistId = async (channelId) => {
  const res = await fetch(
    `${BASE_URL}/channels?id=${channelId}&part=contentDetails&key=${API_KEY}`
  );
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].contentDetails.relatedPlaylists.uploads;
  }
  return null;
};

export const getPlaylistVideos = async (playlistId) => {
  let allVideos = [];
  let nextPageToken = undefined;

  // The API returns a max of 50 videos per request, so pagination is needed
  do {
    const res = await fetch(
      `${BASE_URL}/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50&key=${API_KEY}&pageToken=${
        nextPageToken || ""
      }`
    );
    const data = await res.json();
    allVideos = allVideos.concat(data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allVideos.map((item) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt,
  }));
};
