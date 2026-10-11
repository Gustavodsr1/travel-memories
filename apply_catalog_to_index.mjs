import fs from 'node:fs';
import path from 'node:path';

const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf-8'));
let indexHtml = fs.readFileSync('index.html', 'utf-8');

// 1. Atualizar nav-group no header
const newNavButtons = `        <button class="nav-btn" data-dest="ALL" aria-current="page">Todas (${catalog.length})</button>
        <button class="nav-btn" data-dest="London">Londres (37)</button>
        <button class="nav-btn" data-dest="Chile">Chile (16)</button>
        <button class="nav-btn" data-dest="Rio">Rio de Janeiro (10)</button>
        <button class="nav-btn" data-dest="Argentina">Argentina (1)</button>
        <button class="nav-btn" data-dest="SPFC">São Paulo (1)</button>`;

indexHtml = indexHtml.replace(
  /<div class="lb-group" id="navGroup">[\s\S]*?<\/div>/,
  `<div class="lb-group" id="navGroup">\n        <span class="lb-dot lb-dot--ghost" id="ghostDot"></span>\n        <span class="lb-dot" id="activeDot"></span>\n${newNavButtons}\n      </div>`
);

// 2. Atualizar filter-chips no modal
const newFilterChips = `          <button class="filter-chip is-active" data-filter="ALL">Todas (${catalog.length})</button>
          <button class="filter-chip" data-filter="London">Londres (37)</button>
          <button class="filter-chip" data-filter="Chile">Chile (16)</button>
          <button class="filter-chip" data-filter="Rio">Rio de Janeiro (10)</button>
          <button class="filter-chip" data-filter="Argentina">Argentina (1)</button>
          <button class="filter-chip" data-filter="SPFC">São Paulo (1)</button>`;

indexHtml = indexHtml.replace(
  /<div class="filter-chips" id="gridFilterChips">[\s\S]*?<\/div>/,
  `<div class="filter-chips" id="gridFilterChips">\n${newFilterChips}\n        </div>`
);

// 3. Atualizar preloader e totalNum
indexHtml = indexHtml.replace(
  /<div class="preloader-sub" id="preloaderSub">[\s\S]*?<\/div>/,
  `<div class="preloader-sub" id="preloaderSub">\n      LONDRES • CHILE • RIO • ARGENTINA • SÃO PAULO\n    </div>`
);
indexHtml = indexHtml.replace(
  /<span class="text-neutral-500" id="totalNum">\d+<\/span>/,
  `<span class="text-neutral-500" id="totalNum">${catalog.length}</span>`
);

// 4. Substituir const photoCatalog = [ ... ];
const catalogString = `const photoCatalog = ${JSON.stringify(catalog, null, 2)};`;
indexHtml = indexHtml.replace(/const photoCatalog = \[[\s\S]*?\];/, catalogString);

fs.writeFileSync('index.html', indexHtml, 'utf-8');
console.log('index.html atualizado com sucesso com as 65 fotos!');
