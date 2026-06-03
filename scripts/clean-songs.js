const fs = require('node:fs');
const path = require('node:path');

const jsonPath = path.join(__dirname, '..', 'src', 'data', 'songs.json');
if (!fs.existsSync(jsonPath)) {
  console.error('songs.json not found! Path checked:', jsonPath);
  process.exit(1);
}

const songs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function cleanText(text) {
  if (!text) return '';
  let t = text.trim();
  // If it has }}, cut off everything after it
  if (t.includes('}}')) {
    t = t.split('}}')[0].trim();
  }
  // If it starts with a template call or braces, clean it
  if (t.startsWith('{{')) {
    t = t.replace(/^\{\{[\w\s:]+/, '').trim();
  }
  // Remove any leading/trailing wikitext fragments
  t = t.replace(/[\'\s\[\]]/g, ' ').trim();
  // Remove double spaces
  t = t.replace(/\s+/g, ' ');
  return t;
}

function cleanCredit(creditObj) {
  if (!creditObj) return { ja: 'Unknown', romaji: 'Unknown' };
  let ja = creditObj.ja || 'Unknown';
  let romaji = creditObj.romaji || 'Unknown';
  
  const clean = (str) => {
    let s = str.trim();
    if (s.includes('}}')) {
      s = s.split('}}')[0].trim();
    }
    s = s.replace(/[\s,]+$/, '').replace(/^[\s,]+/, '').trim();
    s = s.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1');
    s = s.replace(/[,]+/g, ', ');
    s = s.replace(/\s+/g, ' ');
    return s || 'Unknown';
  };

  return {
    ja: clean(ja),
    romaji: clean(romaji)
  };
}

const getUnitFolder = (unit) => {
  switch(unit) {
    case 1: return 'cerisebouquet';
    case 2: return 'dollchestra';
    case 3: return 'miracrapark';
    case 4: return 'edelnote';
    case 5: return 'hasunosora';
    default: return 'other';
  }
};

const getGradeFolder = (classEnum) => {
  switch(classEnum) {
    case 0: return '103';
    case 1: return '104';
    case 2: return '105';
    default: return '103';
  }
};

const getSafeFilename = (titleRomaji, url) => {
  let ext = '.jpg';
  // Extract extension from URL if possible
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.png')) ext = '.png';
  else if (lowerUrl.includes('.gif')) ext = '.gif';
  else if (lowerUrl.includes('.webp')) ext = '.webp';
  else if (lowerUrl.includes('.jpeg')) ext = '.jpeg';
  
  const safe = titleRomaji.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, '_'); // Spaces to underscores
  return `${safe}${ext}`;
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Cleaning and formatting crawled songs...');
  
  const cleanedSongs = songs.map(song => {
    const titleJa = cleanText(song.title.ja);
    const titleRomaji = cleanText(song.title.romaji);
    
    // Fix Japanese title fallback if empty or template text
    const finalJa = (titleJa && !titleJa.includes('Template')) ? titleJa : titleRomaji;
    
    return {
      title: {
        ja: finalJa,
        romaji: titleRomaji
      },
      artist: {
        ja: cleanText(song.artist.ja),
        romaji: cleanText(song.artist.romaji)
      },
      lyricist: cleanCredit(song.lyricist),
      composer: cleanCredit(song.composer),
      arranger: cleanCredit(song.arranger),
      coverUrl: song.coverUrl,
      wikiCoverFile: song.wikiCoverFile || '',
      unit: song.unit,
      class: song.class
    };
  });

  // Remove duplicates based on romaji title & unit
  const uniqueSongsMap = new Map();
  for (const song of cleanedSongs) {
    const key = `${song.title.romaji.toLowerCase()}_${song.unit}`;
    if (!uniqueSongsMap.has(key)) {
      uniqueSongsMap.set(key, song);
    }
  }

  const uniqueSongs = Array.from(uniqueSongsMap.values());
  console.log(`Found ${uniqueSongs.length} unique cleaned songs. Starting cover images download...`);
  
  // Start downloading and saving images
  const publicDir = path.join(__dirname, '..', 'public');
  
  for (let i = 0; i < uniqueSongs.length; i++) {
    const song = uniqueSongs[i];
    const url = song.coverUrl;
    
    // Skip placeholders
    if (!url || url.startsWith('https://via.placeholder.com') || url.includes('placeholder')) {
      console.log(`[${i + 1}/${uniqueSongs.length}] Skipping placeholder image for "${song.title.romaji}"`);
      continue;
    }
    
    const grade = getGradeFolder(song.class);
    const unit = getUnitFolder(song.unit);
    const safeFilename = getSafeFilename(song.title.romaji, url);
    
    const targetDir = path.join(publicDir, grade, unit);
    fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, safeFilename);
    
    // If the coverUrl is already a local path, check if it is at the correct destination
    if (url.startsWith('/')) {
      const expectedUrl = `/${grade}/${unit}/${safeFilename}`;
      if (url === expectedUrl) {
        song.coverUrl = url;
        console.log(`[${i + 1}/${uniqueSongs.length}] Image already exists locally at correct path for "${song.title.romaji}"`);
        continue;
      }
      
      const oldPath = path.join(publicDir, url);
      if (fs.existsSync(oldPath)) {
        console.log(`[${i + 1}/${uniqueSongs.length}] Moving image for "${song.title.romaji}" from ${url} to ${expectedUrl}`);
        fs.renameSync(oldPath, targetPath);
        song.coverUrl = expectedUrl;
        continue;
      }
    }
    
    console.log(`[${i + 1}/${uniqueSongs.length}] Downloading cover for "${song.title.romaji}" -> /${grade}/${unit}/${safeFilename}...`);
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(targetPath, buffer);
      
      // Update local URL path
      song.coverUrl = `/${grade}/${unit}/${safeFilename}`;
      
      // Short delay to avoid hitting rate limits
      await sleep(100);
    } catch (err) {
      console.error(`  Failed to download cover for "${song.title.romaji}":`, err.message);
      // Fallback to placeholder
      song.coverUrl = 'https://via.placeholder.com/300?text=No+Cover';
    }
  }
  
  // Save updated dataset
  fs.writeFileSync(jsonPath, JSON.stringify(uniqueSongs, null, 2), 'utf-8');
  console.log(`Successfully processed and saved songs database to ${jsonPath}!`);
}

run();
