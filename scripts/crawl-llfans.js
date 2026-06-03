const fs = require('node:fs');
const path = require('node:path');

const CLASS_ENUM = {
  C103: 0,
  C104: 1,
  C105: 2
};

function parseReleaseClass(releasedOnStr) {
  if (!releasedOnStr) return null;
  
  // Format: YYYY-MM-DD
  const parts = releasedOnStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  
  const isAprilOrLater = month >= 4;
  
  if (year < 2023) return CLASS_ENUM.C103;
  if (year === 2023) {
    return CLASS_ENUM.C103;
  }
  if (year === 2024) {
    return isAprilOrLater ? CLASS_ENUM.C104 : CLASS_ENUM.C103;
  }
  if (year === 2025) {
    return isAprilOrLater ? CLASS_ENUM.C105 : CLASS_ENUM.C104;
  }
  return CLASS_ENUM.C105;
}

function cleanName(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[\s・！!？?&＋+＆]/g, '');
}

async function run() {
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'songs.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('songs.json not found!');
    process.exit(1);
  }
  
  const songs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${songs.length} songs from songs.json.`);

  const query = `
    query {
      songs(first: 1000) {
        data {
          id
          name
          phoneticName
          releasedOn
          seriesIds
          songCredits {
            staffTypeId
            staffName {
              name
            }
          }
        }
      }
    }
  `;

  console.log('Fetching songs from LL-Fans GraphQL API...');
  const res = await fetch('https://api.ll-fans.jp/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  const json = await res.json();
  const wikiSongs = json.data.songs.data.filter(s => s.seriesIds && s.seriesIds.includes(6));
  console.log(`Fetched ${wikiSongs.length} Hasunosora songs from LL-Fans API.`);

  let updatedCount = 0;
  let unmatchedCount = 0;

  for (const song of songs) {
    const cleanTitle = (title) => {
      if (!title) return '';
      return cleanName(
        title
          .replace(/\(104th Class NEW Ver\.\)/gi, '')
          .replace(/（104期NEW Ver\.）/gi, '')
          .replace(/\(105th Class NEW Ver\.\)/gi, '')
          .replace(/（105期NEW Ver\.）/gi, '')
      );
    };

    const jaClean = cleanTitle(song.title.ja);
    const romajiClean = cleanTitle(song.title.romaji);
    
    // Find matching wiki song checking both ja and romaji titles
    const wikiSong = wikiSongs.find(w => {
      const wClean = cleanName(w.name);
      return wClean === jaClean || wClean === romajiClean;
    });
    
    if (wikiSong) {
      const is104Ver = song.title.romaji.includes('104th Class NEW Ver.');
      const is105Ver = song.title.romaji.includes('105th Class NEW Ver.');

      // 1. Update Title ja
      if (wikiSong.name) {
        if (is104Ver) {
          song.title.ja = `${wikiSong.name.trim()}（104期NEW Ver.）`;
        } else if (is105Ver) {
          song.title.ja = `${wikiSong.name.trim()}（105期NEW Ver.）`;
        } else {
          song.title.ja = wikiSong.name.trim();
        }
      }

      // 2. Extract credits
      const lyricists = wikiSong.songCredits
        .filter(c => c.staffTypeId === '1')
        .map(c => c.staffName.name.trim())
        .join(', ');
      
      const composers = wikiSong.songCredits
        .filter(c => c.staffTypeId === '2')
        .map(c => c.staffName.name.trim())
        .join(', ');
      
      const arrangers = wikiSong.songCredits
        .filter(c => c.staffTypeId === '3')
        .map(c => c.staffName.name.trim())
        .join(', ');

      // Update ja field for lyricist, composer if found, fallback to romaji
      song.lyricist.ja = lyricists || song.lyricist.romaji;
      song.composer.ja = composers || song.composer.romaji;

      // Only update arranger for base versions to preserve the custom arranger for special versions
      if (!is104Ver && !is105Ver) {
        song.arranger.ja = arrangers || song.arranger.romaji;
      }
      
      updatedCount++;
    } else {
      console.warn(`Could not find match for: ${song.title.ja} (${song.title.romaji})`);
      unmatchedCount++;
    }
  }

  console.log(`Updated ${updatedCount} songs. Unmatched: ${unmatchedCount}.`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(songs, null, 2), 'utf-8');
  console.log('Successfully wrote updated songs to songs.json.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
