// models/songs.ts

export type Song = {
  id: string;
  title: string;
  artist: string;
};

export const SONGS: Song[] = [
  { id: '1', title: 'Fireworks',                    artist: 'Daoko x Kenshi Yonezu' },
  { id: '2', title: 'Haru no Hi',                   artist: 'Aimyon' },
  { id: '3', title: 'Suki Dakara',                  artist: 'Yuika' },
  { id: '4', title: 'Hikari E',                     artist: 'miwa' },
  { id: '5', title: 'Yume to Hazakura',             artist: 'Wotamin' },
  { id: '6', title: 'Lemon',                        artist: 'Kenshi Yonezu' },
  { id: '7', title: 'Night Sky Patrol of Tomorrow', artist: 'Orangestar' },
  { id: '8', title: 'The Beginning',                artist: 'ONE OK ROCK' },
  { id: '9', title: 'Usseewa',                      artist: 'Ado' },
];