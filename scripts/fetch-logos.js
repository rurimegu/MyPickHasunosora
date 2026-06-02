const fs = require('node:fs');
const path = require('node:path');

const LOGO_CANDIDATES = {
  cerisebouquet: [
    'Cerise Bouquet Logo.png',
    'Cerise Bouquet Symbol.png',
    'Cerise Bouquet Emblem.png',
    'Cerise Bouquet logo.png',
    'Cerise Bouquet symbol.png',
    'Cerise_Bouquet_Logo.png'
  ],
  dollchestra: [
    'DOLLCHESTRA Logo.png',
    'DOLLCHESTRA Symbol.png',
    'DOLLCHESTRA Emblem.png',
    'DOLLCHESTRA logo.png',
    'DOLLCHESTRA symbol.png',
    'DOLLCHESTRA_Logo.png'
  ],
  miracrapark: [
    'Mira-Cra Park! Logo.png',
    'Mira-Cra Park! Symbol.png',
    'Mira-Cra Park! Emblem.png',
    'Mira-Cra Park! logo.png',
    'Mira-Cra Park! symbol.png',
    'Mira-Cra_Park!_Logo.png',
    'Mira-Cra_Park!_logo.png'
  ],
  edelnote: [
    'Edel Note Logo.png',
    'Edel Note Symbol.png',
    'Edel Note Emblem.png',
    'Edel Note logo.png',
    'Edel Note symbol.png',
    'Edel_Note_Logo.png'
  ],
  hasunosora: [
    'Hasunosora Emblem.png',
    'Hasunosora Logo.png',
    'Hasunosora Girls\' High School School Idol Club Emblem.png',
    'Hasunosora Girls\' High School School Idol Club Logo.png',
    'Hasunosora Girls\' High School Idol Club Emblem.png',
    'Hasunosora Girls\' High School Idol Club Logo.png',
    'Hasunosora symbol.png',
    'Hasunosora emblem.png'
  ]
};

async function run() {
  const publicLogosDir = path.join(__dirname, '..', 'public', 'logos');
  fs.mkdirSync(publicLogosDir, { recursive: true });

  for (const [unit, candidates] of Object.entries(LOGO_CANDIDATES)) {
    console.log(`Searching logo for unit: ${unit}...`);
    let found = false;
    
    for (const filename of candidates) {
      const queryUrl = `https://love-live.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:${encodeURIComponent(filename)}&format=json`;
      try {
        const res = await fetch(queryUrl);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
          const url = pages[pageId].imageinfo[0].url;
          console.log(`  Found logo file: "${filename}" -> Downloading...`);
          
          const imgRes = await fetch(url);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            const ext = filename.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
            const targetPath = path.join(publicLogosDir, `${unit}${ext}`);
            fs.writeFileSync(targetPath, buffer);
            console.log(`  Saved logo to: ${targetPath}`);
            found = true;
            break; // Stop searching for this unit
          }
        }
      } catch (err) {
        console.error(`  Error checking "${filename}":`, err.message);
      }
    }
    
    if (!found) {
      console.warn(`  Warning: Could not find any matching logo for unit: ${unit}`);
      // Create an elegant placeholder SVG for this unit
      const targetPath = path.join(publicLogosDir, `${unit}.svg`);
      const color = unit === 'cerisebouquet' ? '#ff80ab' : unit === 'dollchestra' ? '#00bcd4' : unit === 'miracrapark' ? '#ffeb3b' : unit === 'edelnote' ? '#9e9e9e' : '#ffab40';
      const initials = unit === 'cerisebouquet' ? 'CB' : unit === 'dollchestra' ? 'DO' : unit === 'miracrapark' ? 'MC' : unit === 'edelnote' ? 'EN' : 'HS';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="${color}" stroke-width="3" />
        <circle cx="50" cy="50" r="40" fill="${color}" fill-opacity="0.1" />
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="${color}" font-family="'Cinzel', 'Outfit', sans-serif" font-weight="bold" font-size="24">${initials}</text>
      </svg>`;
      fs.writeFileSync(targetPath, svg);
      console.log(`  Created beautiful SVG placeholder for: ${unit}`);
    }
  }
  
  console.log('Finished unit logos query!');
}

run();
