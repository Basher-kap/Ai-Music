// types/news.ts
export type NewsSource = {
  name: string;
  url: string;
};

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  author: string;
};