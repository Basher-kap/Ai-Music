// models/songs.ts

export type Song = {
  id: string;
  title: string;
  artist: string;
  mp4song?: string;
  lyrics?: string;
  review?: string;
  song_theme: string[];
};

export const SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Fireworks', 
    artist: 'Daoko x Kenshi Yonezu', 
    mp4song: ' ',
    lyrics: `Ano hi miwatashita nagisa wo
            Ima mo omoidasun da
            Suna no ue ni kizanda kotoba
            Kimi no ushiro sugata

            Yorikaesu nami ga
            Ashimoto wo yogiri nanika wo sarau
            Yuunagi no naka
            Higure dake ga toorisugite yuku

            Patto hikatte saita hanabi o miteita
            Kitto mada owaranai natsu ga
            Aimai na kokoro wo tokashite tsunaida
            Kono yoru ga tsudzuite hoshikatta

            "Ato nando kimi to onaji hanabi wo mirareru ka na" tte
            Warau kao ni nani ga dekiru darou ka
            Kizutsuku koto yorokobu koto kurikaesu nami to joudou
            Shousou saishuu ressha no oto
            Nando demo kotoba ni shite kimi wo yobu yo
            Namima wo erabi, mou ichido
            Mou nido to kanashimazu ni sumu you ni

            Hatto iki wo nomeba kiechaisou na hikari ga
            Kitto mada mune ni sundeita
            Te wo nobaseba fureta attakai mirai wa
            Hisoka ni futari wo miteita

            Patto hanabi ga (Patto hanabi ga)
            Yoru ni saita (Yoru ni saita)
            Yoru ni saite (Yoru ni saite)
            Shizuka ni kieta (Shizuka ni kieta)
            Hanasanaide (Hanarenaide)
            Mou sukoshi dake (Mou sukoshi dake)
            Mou sukoshi dake kono mama de

            Ano hi miwatashita nagisa wo
            Ima mo omoidasun da
            Suna no ue ni kizanda kotoba
            Kimi no ushiro sugata

            Patto hikatte saita hanabi wo miteita
            Kitto mada owaranai natsu ga
            Aimai na kokoro wo tokashite tsunaida
            Kono yoru ga tsudzuite hoshikatta`, 

    review: `The song's lyrics and atmosphere often evoke a sense of summer, nostalgia, and a bittersweet longing. 
    The visual spectacle of fireworks serves as a powerful symbol for moments of intense beauty that are, by their nature, transient. 
    This transience mirrors the delicate and often unfulfilled emotional connections explored in the narrative.
    `,
    song_theme: ['nostalgia' , 'love']
  },
  { id: '2', title: 'Haru no Hi', artist: 'Aimyon', mp4song: '', lyrics: '', review: 'Review for Haru no Hi', song_theme: ['refreshing'] },
  { id: '3', title: 'Suki Dakara', artist: 'Yuika', mp4song: '',lyrics: 'Lyrics for Suki Dakara', review: '', song_theme: ['love' , 'refreshing'] },
  { id: '4', title: 'Hikari E', artist: 'miwa', mp4song: '',lyrics: '', review: 'Review for Hikari E' , song_theme: ['cheerful'] },
  { id: '5', title: 'Yume to Hazakura', artist: 'Wotamin',mp4song: '', lyrics: '', review: 'Review for Yume to Hazakura', song_theme:['love' , 'refreshing'] },
  { id: '6', title: 'Lemon', artist: 'Kenshi Yonezu', mp4song: '',lyrics: 'Lyrics for Lemon', review: '' , song_theme: ['emo']},
  { id: '7', title: 'Night Sky Patrol of Tomorrow', artist: 'Orangestar', mp4song: '',lyrics: '', review: 'Review for Night Sky Patrol of Tomorrow' , song_theme: ['aspire']},
  { id: '8', title: 'The Beginning', artist: 'ONE OK ROCK', mp4song: '',lyrics: '', review: '', song_theme: ['determination'] },
  { id: '9', title: 'Usseewa', artist: 'Ado', mp4song: '',lyrics: 'Lyrics for Usseewa', review: '' , song_theme: ['wrath']},
];