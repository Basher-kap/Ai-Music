// models/songs.ts

export type Song = {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  review: string;
};

export const SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Fireworks', 
    artist: 'Daoko x Kenshi Yonezu', 
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
    `
  },
  { id: '2', title: 'Haru no Hi', artist: 'Aimyon', lyrics: 'Lyrics for Haru no Hi', review: 'Review for Haru no Hi' },
  { id: '3', title: 'Suki Dakara', artist: 'Yuika', lyrics: 'Lyrics for Suki Dakara', review: 'Review for Suki Dakara' },
  { id: '4', title: 'Hikari E', artist: 'miwa', lyrics: 'Lyrics for Hikari E', review: 'Review for Hikari E' },
  { id: '5', title: 'Yume to Hazakura', artist: 'Wotamin', lyrics: 'Lyrics for Yume to Hazakura', review: 'Review for Yume to Hazakura' },
  { id: '6', title: 'Lemon', artist: 'Kenshi Yonezu', lyrics: 'Lyrics for Lemon', review: 'Review for Lemon' },
  { id: '7', title: 'Night Sky Patrol of Tomorrow', artist: 'Orangestar', lyrics: 'Lyrics for Night Sky Patrol of Tomorrow', review: 'Review for Night Sky Patrol of Tomorrow' },
  { id: '8', title: 'The Beginning', artist: 'ONE OK ROCK', lyrics: 'Lyrics for The Beginning', review: 'Review for The Beginning' },
  { id: '9', title: 'Usseewa', artist: 'Ado', lyrics: 'Lyrics for Usseewa', review: 'Review for Usseewa' },
];