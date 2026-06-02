const fs = require('node:fs');
const path = require('node:path');

function extractTemplateContent(text, templateName) {
  const lowerText = text.toLowerCase();
  const searchStr = `\x7b\x7b${templateName.toLowerCase()}|`;
  const startIdx = lowerText.indexOf(searchStr);
  if (startIdx === -1) return null;

  let bracketCount = 2;
  let currentIdx = startIdx + searchStr.length;
  let extracted = '';

  while (currentIdx < text.length && bracketCount > 0) {
    const char = text[currentIdx];
    const nextChar = text[currentIdx + 1];

    if (char === '{' && nextChar === '{') {
      bracketCount += 2;
      extracted += '{{';
      currentIdx += 2;
    } else if (char === '}' && nextChar === '}') {
      bracketCount -= 2;
      if (bracketCount > 0) {
        extracted += '}}';
      }
      currentIdx += 2;
    } else {
      extracted += char;
      currentIdx++;
    }
  }

  return extracted;
}

function parseTemplateParams(content) {
  const params = [];
  let currentParam = '';
  let bracketLevel = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '{' && nextChar === '{') {
      bracketLevel++;
      currentParam += '{{';
      i++;
    } else if (char === '}' && nextChar === '}') {
      bracketLevel--;
      currentParam += '}}';
      i++;
    } else if (char === '|' && bracketLevel === 0) {
      params.push(currentParam.trim());
      currentParam = '';
    } else {
      currentParam += char;
    }
  }
  params.push(currentParam.trim());
  return params;
}

function cleanTemplateTags(str) {
  if (!str) return '';
  let result = str;
  
  const rubyRegex = /\x7b\x7b(?:Template:)?Ruby\s*Text\s*\|\s*([^|]+)\|\s*[^}]+\x7d\x7d/gi;
  result = result.replace(rubyRegex, '$1');
  
  result = result.replace(/\x7b\x7b[^}]+\x7d\x7d/g, '');
  return result.replace(/['[\]]/g, '').trim();
}

const UNIT_MAPPING = {
  'Cerise Bouquet': { ja: 'スリーズブーケ', romaji: 'Cerise Bouquet' },
  'DOLLCHESTRA': { ja: 'DOLLCHESTRA', romaji: 'DOLLCHESTRA' },
  'Mira-Cra Park!': { ja: 'みらくらぱーく！', romaji: 'Mira-Cra Park!' },
  'Edel Note': { ja: 'エーデルノート', romaji: 'EdelNote' },
  "Hasunosora Girls' High School Idol Club": { ja: '蓮ノ空女学院スクールアイドルクラブ', romaji: "Hasunosora Girls' High School Idol Club" },
  "Hasunosora Girls’ High School Idol Club": { ja: '蓮ノ空女学院スクールアイドルクラブ', romaji: "Hasunosora Girls' High School Idol Club" }
};

const UNIT_ENUM = {
  None: 0,
  CeriseBouquet: 1,
  Dollchestra: 2,
  MiraCraPark: 3,
  EdelNote: 4,
  Hasunosora: 5,
  Other: 6
};

const CLASS_ENUM = {
  C103: 0,
  C104: 1,
  C105: 2
};

function getUnitEnum(artistStr) {
  if (!artistStr) return UNIT_ENUM.None;
  const hasCerise = artistStr.includes('Cerise Bouquet');
  const hasDoll = artistStr.includes('DOLLCHESTRA') || artistStr.includes('Dollchestra');
  const hasMira = artistStr.includes('Mira-Cra') || artistStr.includes('MiraCra') || artistStr.includes('みらくら');
  
  if ((hasCerise && hasDoll) || (hasCerise && hasMira) || (hasDoll && hasMira) || artistStr.includes('Hasunosora')) {
    return UNIT_ENUM.Hasunosora;
  }
  
  if (hasCerise) return UNIT_ENUM.CeriseBouquet;
  if (hasDoll) return UNIT_ENUM.Dollchestra;
  if (hasMira) return UNIT_ENUM.MiraCraPark;
  if (artistStr.includes('Edel Note')) return UNIT_ENUM.EdelNote;
  return UNIT_ENUM.Other;
}

function parseReleaseClass(releasedStr, recordedStr, titleRomaji) {
  if (titleRomaji) {
    const lowerTitle = titleRomaji.toLowerCase();
    if (lowerTitle === 'be proud' || 
        lowerTitle === 'shiawase no ribbon' || 
        lowerTitle === 'yappa tenshi!') {
      return CLASS_ENUM.C104;
    }
  }

  let targetStr = releasedStr || recordedStr || '';
  if (!targetStr) return CLASS_ENUM.C103;
  const match = targetStr.match(/\b(202\d)\b/);
  if (!match) return CLASS_ENUM.C103;
  const year = parseInt(match[1], 10);

  let isAprilOrLater = false;
  const monthMatch = targetStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)/i);
  if (monthMatch) {
    const mStr = monthMatch[1].toLowerCase();
    if (!mStr.startsWith('jan') && !mStr.startsWith('feb') && !mStr.startsWith('mar')) {
      isAprilOrLater = true;
    }
  } else {
    isAprilOrLater = true;
  }

  // Standard school year definition: April to March next year
  // 103期: April 2023 - March 2024
  // 104期: April 2024 - March 2025
  // 105期: April 2025 onwards
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

// Clean link brackets like [[Composers and Arrangers|Kelly]] -> Kelly
function cleanWikiLinks(text) {
  if (!text) return '';
  return text.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1').trim();
}

function cleanName(name) {
  if (!name) return '';
  let str = name.replace(/[\u00a0\u200b\u200c\u200d\u200e\u200f\ufeff]/g, ' ').trim().replace(/\s+/g, ' ');
  while (true) {
    const prev = str;
    str = str
      .replace(/^\s*(?:and|is|arranged|composed|written|by|,|\.)+\s+/i, '')
      .replace(/\s+(?:and|is|arranged|composed|written|by|,|\.)+\s*$/i, '')
      .replace(/^[,.\s]+/, '')
      .replace(/[,.\s]+$/, '')
      .trim();
    if (str === prev) break;
  }
  return str;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Loading existing songs database...');
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'songs.json');
  let existingSongs = [];
  if (fs.existsSync(jsonPath)) {
    try {
      existingSongs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      console.log(`  Loaded ${existingSongs.length} existing songs.`);
    } catch (e) {
      console.error("Failed to load existing songs.json", e);
    }
  }

  console.log('Building dynamic Japanese credit mapping from wiki...');
  const JP_CREDIT_MAP = {
    'Kelly': 'Kelly',
    'TATSUNE': 'TATSUNE',
    'UiNA': 'UiNA',
    'aim': 'aim',
    'ha-j': 'ha-j',
    'zopp': 'zopp',
    'Unknown': 'Unknown'
  };
  try {
    const compPageUrl = 'https://love-live.fandom.com/api.php?action=query&prop=revisions&rvprop=content&titles=Composers%20and%20Arrangers&format=json';
    const compRes = await fetch(compPageUrl);
    const compData = await compRes.json();
    const cPages = compData.query.pages;
    const cPageId = Object.keys(cPages)[0];
    if (cPageId !== '-1') {
      const compContent = cPages[cPageId].revisions[0]['*'];
      
      const nihongoRegex = /\{\{Nihongo\|([^|]+)\|([^|}]+)/gi;
      let match;
      while ((match = nihongoRegex.exec(compContent)) !== null) {
        const eng = match[1].replace(/['*[\]]/g, '').trim();
        const jp = match[2].replace(/['*[\]]/g, '').trim();
        if (eng && jp && eng !== jp && !jp.startsWith('{{')) {
          JP_CREDIT_MAP[eng] = jp;
        }
      }

      const parenRegex = /([A-Za-z0-9\s'’\-]+)\s*\(([\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s]+)\)/g;
      while ((match = parenRegex.exec(compContent)) !== null) {
        const eng = match[1].trim();
        const jp = match[2].trim();
        if (eng && jp && eng !== jp) {
          JP_CREDIT_MAP[eng] = jp;
        }
      }
      console.log(`  Dynamically mapped ${Object.keys(JP_CREDIT_MAP).length} creators to Japanese names.`);
    }
  } catch (err) {
    console.error('  Failed to fetch dynamic credit mappings from wiki:', err);
  }

  const getJpCredit = (romajiName) => {
    if (!romajiName) return 'Unknown';
    const key = romajiName.trim();
    if (JP_CREDIT_MAP[key]) {
      return JP_CREDIT_MAP[key];
    }
    return key;
  };
  console.log('Fetching category members...');
  const categoryUrl = 'https://love-live.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Discography:Hasunosora&cmlimit=500&format=json';

  const res = await fetch(categoryUrl);
  const data = await res.json();

  // Filter to namespace 0 (articles only) and ignore certain obvious album/event titles
  const members = data.query.categorymembers.filter(m => m.ns === 0);

  const blacklist = [
    'Discography:Hasunosora',
    'Love Live! Series Presents Unit Koushien 2024',
    'Love Live! Series Asia Tour 2024 ~Minna de Kanaeru Monogatari~',
    'LoveLive! Series 15th Anniversary Love Live! Fest',
    'U-NEXT MUSIC FES - Love Live! Series EXPO 2025 STAGE ~Right now!~',
    'Category:Discography:Hasunosora',
    'Hasunosora Girls\' High School Idol Club 1st Live Tour ~RUN! CAN! FUN!~',
    'Hasunosora Girls\' High School Idol Club 2nd Live Tour ~Blooming with ○○○~',
    'Hasunosora Girls\' High School Idol Club 3rd Live Tour TRY TRI UNITY!!!',
    'Hasunosora Girls\' High School Idol Club 5th Live Tour ~4Pair Power Spread!!!!~',
    'Hasunosora Girls\' High School Idol Club 6th Live Dream ~Bloom Garden Party~'
  ];

  const songCandidates = members.filter(m => !blacklist.includes(m.title));

  console.log(`Found ${songCandidates.length} candidates. Crawling details...`);

  const songs = [];

  for (let i = 0; i < songCandidates.length; i++) {
    const m = songCandidates[i];
    console.log(`[${i + 1}/${songCandidates.length}] Fetching "${m.title}"...`);

    const songUrl = `https://love-live.fandom.com/api.php?action=query&prop=revisions&rvprop=content&titles=${encodeURIComponent(m.title)}&format=json`;
    try {
      const sRes = await fetch(songUrl);
      const sData = await sRes.json();
      const pages = sData.query.pages;
      const pageId = Object.keys(pages)[0];

      if (pageId === '-1') {
        console.log(`  Skipping: Page not found`);
        continue;
      }

      const content = pages[pageId].revisions[0]['*'];

      // Filter out pages that do not have lyrics (i.e. not songs)
      if (!content.includes('[[Category:Lyrics]]')) {
        console.log(`  Skipping: No lyrics category found (likely album or live concert page)`);
        continue;
      }

      // Match the correct infobox block specifically (bypassing DISPLAYTITLE or other templates)
      const infoboxRegex = /\{\{(?:CD|Singles|Album|Song|Solo|Group|Unit)\s+Infobox[\s\S]*?\}\}/i;
      const infoboxMatch = content.match(infoboxRegex);
      const infobox = infoboxMatch ? infoboxMatch[0] : (content.match(/\{\{[\s\S]*?\}\}/)?.[0] || '');

      // Robust infobox line-by-line parser
      const parseInfobox = (infoboxContent) => {
        const params = {};
        if (!infoboxContent) return params;
        const lines = infoboxContent.split('\n');
        let currentParam = null;
        let currentValue = [];
        for (let line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('|') && !trimmed.startsWith('|-')) {
            if (currentParam) {
              params[currentParam] = currentValue.join('\n').trim();
            }
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx !== -1) {
              currentParam = trimmed.substring(1, eqIdx).trim().toLowerCase();
              let val = trimmed.substring(eqIdx + 1).trim();
              if (val.endsWith('}}')) {
                val = val.slice(0, -2).trim();
                params[currentParam] = val;
                currentParam = null;
                break;
              }
              currentValue = [val];
            } else {
              currentParam = trimmed.substring(1).trim().toLowerCase();
              currentValue = [];
            }
          } else if (trimmed === '}}' || trimmed.endsWith('}}')) {
            let lastLine = trimmed;
            if (lastLine.endsWith('}}')) {
              lastLine = lastLine.slice(0, -2).trim();
            }
            if (lastLine && currentParam) {
              currentValue.push(lastLine);
            }
            break;
          } else {
            if (currentParam) {
              currentValue.push(line);
            }
          }
        }
        if (currentParam) {
          params[currentParam] = currentValue.join('\n').trim();
        }
        return params;
      };

      const params = parseInfobox(infobox);
      const artistRaw = params['artist'] || 'Hasunosora Girls\' High School Idol Club';
      const releasedRaw = params['released'] || '';
      const recordedRaw = params['recorded'] || '';
      const imageField = params['image'] || '';

      // Parse Cover Image Name robustly
      const extractFilename = (field) => {
        if (!field) return '';
        const trimmed = field.trim();
        if (trimmed.toLowerCase().includes('<gallery') || trimmed.toLowerCase().includes('<tabber')) {
          const files = [];
          const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
          for (const line of lines) {
            if (line.startsWith('<gallery') || line.startsWith('</gallery') || line.startsWith('<tabber') || line.startsWith('</tabber')) {
              continue;
            }
            
            let fileMatch = line.match(/(?:File|Image):\s*([^|\]]+)/i);
            let filename = '';
            if (fileMatch) {
              filename = fileMatch[1].trim();
            } else {
              const parts = line.split('|');
              const candidate = parts[0].trim();
              if (/\.(jpe?g|png|gif|webp)$/i.test(candidate)) {
                filename = candidate;
              }
            }

            if (filename) {
              const isGameJacket = line.toLowerCase().includes('game');
              files.push({ filename, isGameJacket });
            }
          }
          if (files.length > 0) {
            const gameJacket = files.find(f => f.isGameJacket);
            if (gameJacket) return gameJacket.filename;
            return files[0].filename;
          }
        }
        const fileMatch = trimmed.match(/\[\[\s*(?:File|Image):([^|\]]+)/i);
        if (fileMatch) {
          return fileMatch[1].trim();
        }
        const plainFileMatch = trimmed.match(/(?:File|Image):\s*([^|\]\n]+)/i);
        if (plainFileMatch) {
          return plainFileMatch[1].trim();
        }
        return trimmed;
      };

      let coverImageFile = extractFilename(imageField);

      // Fallback for missing cover image files: query the page's linked images list
      if (!coverImageFile) {
        const pageImagesUrl = `https://love-live.fandom.com/api.php?action=query&prop=images&titles=${encodeURIComponent(m.title)}&format=json`;
        try {
          const imgListRes = await fetch(pageImagesUrl);
          const imgListData = await imgListRes.json();
          const pages = imgListData.query.pages;
          const pid = Object.keys(pages)[0];
          if (pid !== '-1' && pages[pid].images && pages[pid].images.length > 0) {
            const matchedImg = pages[pid].images.find(img =>
              img.title.toLowerCase().includes('jacket') ||
              img.title.toLowerCase().includes('cover') ||
              img.title.toLowerCase().includes('video') ||
              img.title.toLowerCase().includes('lyric')
            );
            if (matchedImg) {
              coverImageFile = matchedImg.title.replace(/^File:/i, '').trim();
            } else {
              coverImageFile = pages[pid].images[0].title.replace(/^File:/i, '').trim();
            }
          }
        } catch (err) {
          console.error(`    Error fetching page images fallback list for ${m.title}:`, err);
        }
      }

      // Check for DISPLAYTITLE in the content
      const displayTitleMatch = content.match(/\{\{DISPLAYTITLE:\s*([^}]+)\}\}/i);
      let pageTitle = m.title;
      if (displayTitleMatch) {
        pageTitle = displayTitleMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim(); // Clean any HTML tags
      }

      let titleJa = pageTitle;
      let titleRomaji = pageTitle;

      const introText = content.split('==')[0];
      const nihongoContent = extractTemplateContent(introText, 'Nihongo');
      if (nihongoContent) {
        const parts = parseTemplateParams(nihongoContent);
        if (parts.length >= 2) {
          const param1 = parts[0];
          const param2 = parts[1];

          const cleanParam1 = cleanTemplateTags(param1);
          const isSongTitle = 
            cleanParam1.toLowerCase() === pageTitle.toLowerCase() ||
            pageTitle.toLowerCase().includes(cleanParam1.toLowerCase()) ||
            cleanParam1.toLowerCase().includes(pageTitle.toLowerCase());

          if (isSongTitle) {
            titleRomaji = cleanParam1;
            titleJa = cleanTemplateTags(param2);
          } else {
            const nameParam = params['name'] || '';
            if (nameParam) {
              titleJa = cleanTemplateTags(nameParam);
              titleRomaji = cleanTemplateTags(nameParam);
            }
          }
        }
      } else {
        // Fallback: Try to parse Japanese title from wikitext parentheses (e.g., '''Genyou Yakou''' (眩耀夜行 ...))
        const boldTitleEscaped = pageTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const parenRegex = new RegExp(`'''${boldTitleEscaped}'''\\s*\\(([\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\\s]+)`, 'i');
        const parenMatch = introText.match(parenRegex);
        if (parenMatch) {
          titleJa = parenMatch[1].trim();
        } else {
          const nameParam = params['name'] || '';
          if (nameParam) {
            titleJa = cleanTemplateTags(nameParam);
            titleRomaji = cleanTemplateTags(nameParam);
          }
        }
      }

      // Parse credits from wikitext body using a sequential index parser
      let lyricist = '';
      let composer = '';
      let arranger = '';

      const creditsSentenceMatch = content.match(/(?:^|[\n.])\s*The song is\s+([^\n]+)/i);
      if (creditsSentenceMatch) {
        let sentence = creditsSentenceMatch[1].trim();
        // Split at periods that are followed by space and capital letter or end of line to isolate primary sentence
        sentence = sentence.split(/\.(?=\s+[A-Z]|\s*$)/)[0].trim();

        // 1. Extract written, composed and arranged by (if present)
        const writCompArrIdx = sentence.toLowerCase().indexOf('written, composed and arranged by');
        if (writCompArrIdx !== -1) {
          lyricist = cleanWikiLinks(sentence.substring(writCompArrIdx + 'written, composed and arranged by'.length));
          composer = lyricist;
          arranger = lyricist;
          sentence = sentence.substring(0, writCompArrIdx).trim();
        }

        // 2. Extract composed and arranged by (if present)
        const compArrIdx = sentence.toLowerCase().indexOf('composed and arranged by');
        if (compArrIdx !== -1) {
          composer = cleanWikiLinks(sentence.substring(compArrIdx + 'composed and arranged by'.length));
          arranger = composer;
          sentence = sentence.substring(0, compArrIdx).trim();
        }

        // 3. Extract standard arranged by (or fallback arranged)
        if (!arranger) {
          let arrIdx = sentence.toLowerCase().indexOf('arranged by');
          let kw = 'arranged by';
          if (arrIdx === -1) {
            arrIdx = sentence.toLowerCase().indexOf('arranged');
            kw = 'arranged';
          }
          if (arrIdx !== -1) {
            arranger = cleanWikiLinks(sentence.substring(arrIdx + kw.length));
            sentence = sentence.substring(0, arrIdx).trim();
          }
        }

        // 4. Extract written and composed by
        const writCompIdx = sentence.toLowerCase().indexOf('written and composed by');
        if (writCompIdx !== -1) {
          lyricist = cleanWikiLinks(sentence.substring(writCompIdx + 'written and composed by'.length));
          composer = lyricist;
          sentence = sentence.substring(0, writCompIdx).trim();
        }

        // 5. Extract standard composed by (or fallback composed)
        if (!composer) {
          let compIdx = sentence.toLowerCase().indexOf('composed by');
          let kw = 'composed by';
          if (compIdx === -1) {
            compIdx = sentence.toLowerCase().indexOf('composed');
            kw = 'composed';
          }
          if (compIdx !== -1) {
            composer = cleanWikiLinks(sentence.substring(compIdx + kw.length));
            sentence = sentence.substring(0, compIdx).trim();
          }
        }

        // 6. Extract standard written by (or fallback written)
        if (!lyricist) {
          let writIdx = sentence.toLowerCase().indexOf('written by');
          let kw = 'written by';
          if (writIdx === -1) {
            writIdx = sentence.toLowerCase().indexOf('written');
            kw = 'written';
          }
          if (writIdx !== -1) {
            lyricist = cleanWikiLinks(sentence.substring(writIdx + kw.length));
          }
        }
      }

      // Clean commas and spaces in credits list
      const processCredit = (text) => {
        if (!text) return { ja: 'Unknown', romaji: 'Unknown' };
        const clean = cleanName(text);
        const parts = clean.split(',').map(p => p.trim()).filter(Boolean);
        const mappedParts = parts.map(p => getJpCredit(p));
        return {
          ja: mappedParts.join(', '),
          romaji: clean
        };
      };

      const unitEnum = getUnitEnum(artistRaw);
      const classEnum = parseReleaseClass(releasedRaw, recordedRaw, titleRomaji);

      // Get image URL from file name
      let coverUrl = '';
      let localExists = false;
      const existingSong = existingSongs.find(s => s.title.romaji.toLowerCase() === titleRomaji.toLowerCase() && s.unit === unitEnum);
      if (existingSong && existingSong.coverUrl && existingSong.coverUrl.startsWith('/')) {
        const localPath = path.join(__dirname, '..', 'public', existingSong.coverUrl);
        if (fs.existsSync(localPath)) {
          if (!coverImageFile || existingSong.wikiCoverFile === coverImageFile) {
            localExists = true;
            coverUrl = existingSong.coverUrl;
            console.log(`  Preserved existing local cover URL for "${titleRomaji}": ${coverUrl}`);
          } else {
            console.log(`  Obsolete local cover detected for "${titleRomaji}": ${existingSong.wikiCoverFile} -> ${coverImageFile}. Will re-craw/re-download.`);
          }
        }
      }

      if (!localExists && coverImageFile) {
        const imgQueryUrl = `https://love-live.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:${encodeURIComponent(coverImageFile)}&format=json`;
        try {
          const imgRes = await fetch(imgQueryUrl);
          const imgData = await imgRes.json();
          const imgPages = imgData.query.pages;
          const imgPageId = Object.keys(imgPages)[0];
          if (imgPageId !== '-1' && imgPages[imgPageId].imageinfo && imgPages[imgPageId].imageinfo.length > 0) {
            coverUrl = imgPages[imgPageId].imageinfo[0].url;
          }
        } catch (imgErr) {
          console.error(`    Error fetching image URL for ${coverImageFile}:`, imgErr);
        }
      }

      // If no cover URL fetched, use placeholder
      if (!coverUrl) {
        coverUrl = 'https://via.placeholder.com/300?text=No+Cover';
      }

      // Format artist MString
      let artistJa = artistRaw;
      let artistRomaji = artistRaw;
      if (unitEnum === UNIT_ENUM.Hasunosora) {
        artistJa = "蓮ノ空女学院スクールアイドルクラブ";
        artistRomaji = "Hasunosora Girls' High School Idol Club";
      } else {
        for (const [k, v] of Object.entries(UNIT_MAPPING)) {
          if (artistRaw.includes(k)) {
            artistJa = v.ja;
            artistRomaji = v.romaji;
            break;
          }
        }
      }

      songs.push({
        title: { ja: titleJa, romaji: titleRomaji },
        artist: { ja: artistJa, romaji: artistRomaji },
        lyricist: processCredit(lyricist),
        composer: processCredit(composer),
        arranger: processCredit(arranger),
        coverUrl,
        wikiCoverFile: coverImageFile || (existingSong ? (existingSong.wikiCoverFile || '') : ''),
        unit: unitEnum,
        class: classEnum
      });

      console.log(`  Parsed: "${titleRomaji}" [${artistRomaji}] | Unit: ${unitEnum} | Class: ${classEnum}`);

      // Sleep a bit to avoid hitting API limits
      await sleep(100);
    } catch (err) {
      console.error(`  Error parsing "${m.title}":`, err);
    }
  }

  console.log(`Successfully parsed ${songs.length} songs!`);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'songs.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(songs, null, 2), 'utf-8');
  console.log(`Saved songs database to ${outputPath}`);
}

run();
