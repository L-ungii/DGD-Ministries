export function groupVideosBySection(videos: any[] = []) {
  const latest = videos.slice(0, 6) || [];
  const live =
    videos.filter((v) => v.title?.toLowerCase().includes("live")) || [];

  const crusade =
    videos.filter((v) => v.title?.toLowerCase().includes("crusade")) || [];

  const testimony =
    videos.filter((v) => v.title?.toLowerCase().includes("testimony")) || [];

  const celebration =
    videos.filter((v) => v.title?.toLowerCase().includes("celebration")) || [];

  const deliverance =
    videos.filter((v) => v.title?.toLowerCase().includes("deliverance")) || [];

  const worship =
    videos.filter((v) => v.title?.toLowerCase().includes("worship")) || [];

  const usedIds = new Set([
    ...latest.map((v) => v.id),
    ...live.map((v) => v.id),
    ...crusade.map((v) => v.id),
    ...celebration.map((v) => v.id),
    ...testimony.map((v) => v.id),
    ...deliverance.map((v) => v.id),
    ...worship.map((v) => v.id),
  ]);

  const others = videos.filter((v) => !usedIds.has(v.id)) || [];

  return {
    latest,
    live,
    crusade,
    testimony,
    deliverance,
    celebration,
    worship,
    others,
  };
}
