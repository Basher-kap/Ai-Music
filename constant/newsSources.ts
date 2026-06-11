// constant/newsSources.ts

export type NewsSource = {
    name: string;
    url: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'JROCK NEWS',
    url: 'https://jrocknews.com/feed',
  },
  {
    name: 'Anime News Network',
    url: 'https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us',
  },
];