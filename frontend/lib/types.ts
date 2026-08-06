export type ChurchEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  media_id: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export type GalleryPhoto = {
  id: string;
  image_url: string;
  media_id: string;
  caption: string | null;
  album: string;
  sort_order: number;
  created_at: string;
};

export type Announcement = {
  id: string;
  message: string;
  link_url: string | null;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

export type Poster = {
  id: string;
  media_id: string;
  image_url: string;
  title: string | null;
  created_at: string;
};

export type PrayerRequest = {
  id: string;
  name: string | null;
  email: string | null;
  request: string;
  is_private: boolean;
  answered: boolean;
  created_at: string;
};

export type QuizScore = {
  id: string;
  name: string;
  score: number;
  max_score: number;
  created_at: string;
};

/** Shape the homepage calendar renders, whatever the source. */
export type CalendarEvent = {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  source: "google" | "admin";
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};
