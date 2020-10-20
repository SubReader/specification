const fs = require("fs");

const DB = {
  users: [
    {
      id: "1",
      email: "anders@subreader.dk",
      password: "test123", // Always hash your passwords!
      entitlements: ["free"],
    },
    {
      id: "2",
      email: "mar@waoo.dk",
      password: "test123", // Always hash your passwords!
      entitlements: ["free", "paid"],
    },
  ],
  titles: [
    {
      id: "1",
      type: "movie",
      imdb_id: "tt1502397",
      title: "Bad Boys for Life",
      poster:
        "https://image.tmdb.org/t/p/w220_and_h330_face/ax2ljGsuC7HdYyeoJg59l0bx8ea.jpg",
    },
    {
      id: "2",
      type: "movie",
      imdb_id: "tt2584384",
      title: "JoJo Rabbit",
      poster:
        "https://image.tmdb.org/t/p/w220_and_h330_face/7GsM4mtM0worCtIVeiQt28HieeN.jpg",
    },
    {
      id: "3",
      type: "movie",
      imdb_id: "tt4463894",
      title: "Shaft",
      poster:
        "https://image.tmdb.org/t/p/w220_and_h330_face/kfZqwGuvEBAysAbCsa0QLKoSYR.jpg",
    },
  ],
  fingerprints: [
    {
      id: "1",
      fingerprint: fs.readFileSync(
        "./fingerprints/Bad_Boys_for_Life.txt",
        "utf-8"
      ),
      samplerate: 48000,
    },
    {
      id: "2",
      fingerprint: fs.readFileSync("./fingerprints/JoJo_Rabbit.txt", "utf-8"),
      samplerate: 48000,
    },
    {
      id: "3",
      fingerprint: fs.readFileSync("./fingerprints/Shaft.txt", "utf-8"),
      samplerate: 48000,
    },
  ],
  subtitles: [
    {
      id: "1",
      subtitles: [
        {
          language: "da",
          url: "/static/Bad_Boys_for_Life.vtt",
        },
      ],
    },
    {
      id: "2",
      subtitles: [
        {
          language: "da",
          url: "/static/JoJo_Rabit.vtt",
        },
      ],
    },
    {
      id: "3",
      subtitles: [
        {
          language: "da",
          url: "/static/Shaft.vtt",
        },
      ],
    },
  ],
};

module.exports = { DB };
