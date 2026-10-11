import fs from 'node:fs';
import path from 'node:path';

// Carrega o catálogo atualizado de 64 fotos (sem São Paulo)
const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));
const filteredCatalog = catalog.filter(item => item.dest !== 'SPFC' && !item.file.includes('SPFC'));
console.log(`Catálogo carregado com ${filteredCatalog.length} fotos.`);

// Carrega e limpa o SVG do Mapa Múndi
let rawMapSvg = fs.readFileSync('assets/world-map.svg', 'utf8');
let innerSvgMatch = rawMapSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
let cleanedMapPaths = '';
if (innerSvgMatch) {
  cleanedMapPaths = innerSvgMatch[1]
    .replace(/<sodipodi:[^>]*>/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/<defs[\s\S]*?<\/defs>/g, '')
    .trim();
}

console.log(`SVG do Mapa Múndi preparado com ${cleanedMapPaths.length} caracteres.`);

const html = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>GUSTAVO • Diário de Viagens & Memórias Fotográficas</title>
  <meta name="description" content="Diário de viagens e fotografias por Gustavo. Experiência cinematográfica para fotos verticais de celular em máxima qualidade. Londres 2023, Chile 2024, Argentina 2025 e Rio 2026.">

  <!-- Tailwind CSS via allowlisted gstatic dependency -->
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>

  <style>
    @font-face {
      font-family: 'Inter';
      src: local('Inter'), local('Helvetica Neue'), local('Arial'), sans-serif;
      font-weight: 300 900;
      font-display: swap;
    }

    :root {
      --bg-dark: #08090d;
      --bg-surface: #0f1118;
      --bg-card: #131722;
      --accent-warm: #f5f2eb;
      --accent-gold: #eab308;
      --accent-cyan: #38bdf8;
      --text-muted: #94938f;
      --font-main: 'Inter', system-ui, -apple-system, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      background: var(--bg-dark);
      color: var(--accent-warm);
      font-family: var(--font-main);
      overflow-x: hidden;
    }

    body {
      min-height: 100vh;
      position: relative;
    }

    /* Scrollbar personalizada */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #08090d;
    }
    ::-webkit-scrollbar-thumb {
      background: #272f3d;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #3b475d;
    }

    /* ==========================================
       FUNDO MAPA MÚNDI OCEÂNICO AZUL MAIS CLARINHO
       ========================================== */
    .world-map-backdrop {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 40%, #1e3a63 0%, #112644 55%, #0a1628 100%);
    }

    .world-map-svg {
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      object-fit: cover;
      opacity: 0.46;
      transform: scale(1.02);
      will-change: opacity, transform;
    }

    /* Continentes com contorno azul claro / ciano sobre o oceano azul */
    .world-map-svg path {
      fill: rgba(30, 58, 98, 0.5) !important;
      stroke: rgba(125, 211, 252, 0.4) !important;
      stroke-width: 0.85px !important;
      transition: fill 0.3s ease, stroke 0.3s ease;
    }

    /* Linhas de Grade Sutis com tom azul/ciano */
    .map-grid-line {
      stroke: rgba(147, 197, 253, 0.12);
      stroke-dasharray: 4 6;
      stroke-width: 0.7px;
    }

    .map-equator {
      stroke: rgba(234, 179, 8, 0.35);
      stroke-dasharray: 6 6;
      stroke-width: 0.9px;
    }

    /* Vinheta Suave Azulada */
    .world-map-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(17, 38, 68, 0.18) 0%, rgba(10, 22, 40, 0.55) 65%, rgba(8, 17, 30, 0.9) 100%);
      pointer-events: none;
    }

    /* Animação de pulsação suave */
    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.55; transform: scale(0.9); }
    }

    /* Flutuação da foto do Gustavo (Hero / Apresentação) */
    @keyframes floatPortrait {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-16px) rotate(1.2deg);
      }
    }

    .float-card {
      animation: floatPortrait 6s ease-in-out infinite;
      will-change: transform;
    }

    /* Halo luminoso de fundo */
    .ambient-halo-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(130px);
      pointer-events: none;
      z-index: 1;
      opacity: 0.16;
      animation: pulseGlow 8s ease-in-out infinite;
    }

    /* Preloader Animation */
    .preloader {
      position: fixed;
      inset: 0;
      background: #050507;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.7s;
    }

    .preloader.is-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .preloader-title {
      font-size: 1.85rem;
      font-weight: 300;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      overflow: hidden;
      display: inline-flex;
    }

    .preloader-title span {
      transform: translateY(120%);
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
      display: inline-block;
    }

    .preloader-title.is-in span {
      transform: translateY(0);
    }

    .preloader-sub {
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      color: #888;
      margin-top: 12px;
      opacity: 0;
      transition: opacity 0.5s ease 0.2s;
    }

    .preloader-sub.is-in {
      opacity: 1;
    }

    /* Header Fixo Transparente */
    header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 16px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 60;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      background: rgba(8, 9, 13, 0.75);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .brand-mark {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 14px rgba(255, 255, 255, 0.9);
      animation: pulseGlow 2.5s infinite;
    }

    .brand-text {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    /* Pílulas de Navegação com Sliding Dot (OGON style) */
    .lb-group {
      display: inline-flex;
      align-items: center;
      position: relative;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 4px 6px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .lb-dot {
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(var(--dot-x, 0px), -50%);
      pointer-events: none;
      opacity: var(--dot-o, 0);
      transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s;
    }

    .lb-dot--ghost {
      opacity: var(--g-o, 0);
      transform: translate(var(--g-x, 0px), -50%);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s;
      background: rgba(255, 255, 255, 0.6);
    }

    .nav-btn {
      color: var(--accent-warm);
      text-decoration: none;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 14px;
      position: relative;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: opacity 0.2s, color 0.2s;
    }

    .nav-btn:hover {
      color: #fff;
    }

    .nav-btn[aria-current="page"] {
      font-weight: 600;
      color: #fff;
    }

    /* Action pills */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-pill {
      background: rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--accent-warm);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .action-pill:hover {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.35);
      transform: translateY(-1px);
    }

    /* Equalizador de Áudio do YouTube */
    .eq-bars {
      display: inline-flex;
      align-items: flex-end;
      gap: 2.5px;
      height: 12px;
      width: 13px;
    }

    .eq-bars .bar {
      width: 2px;
      background: currentColor;
      border-radius: 1px;
      height: 3px;
      transition: height 0.2s;
    }

    .is-playing .eq-bars .bar:nth-child(1) {
      animation: eq1 0.8s ease-in-out infinite alternate;
    }
    .is-playing .eq-bars .bar:nth-child(2) {
      animation: eq2 1.1s ease-in-out infinite alternate 0.2s;
    }
    .is-playing .eq-bars .bar:nth-child(3) {
      animation: eq3 0.7s ease-in-out infinite alternate 0.4s;
    }

    @keyframes eq1 { 0% { height: 3px; } 100% { height: 11px; } }
    @keyframes eq2 { 0% { height: 2px; } 100% { height: 9px; } }
    @keyframes eq3 { 0% { height: 4px; } 100% { height: 12px; } }

    /* Reveal animations on scroll */
    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Cartão de Álbum */
    .album-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease, box-shadow 0.45s ease;
      cursor: pointer;
    }

    .album-card:hover {
      transform: translateY(-8px) scale(1.015);
      border-color: rgba(255, 255, 255, 0.35);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(234, 179, 8, 0.15);
    }

    .album-card .cover-img {
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease;
    }

    .album-card:hover .cover-img {
      transform: scale(1.06);
    }

    /* CINEMA STAGE VIEWER VIEW */
    .stage-view-container {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: var(--bg-dark);
      z-index: 80;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s;
    }

    .stage-view-container.is-active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    /* Halo Dinâmico no Stage */
    .ambient-halo-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    }

    .ambient-halo-img {
      position: absolute;
      inset: -15%;
      width: 130%;
      height: 130%;
      object-fit: cover;
      filter: blur(80px) saturate(190%) brightness(0.28);
      transform: scale(1.08);
      transition: opacity 0.9s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      will-change: transform, opacity;
    }

    .ambient-halo-img.is-active {
      opacity: 1;
      transform: scale(1);
    }

    .film-grain {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.55;
    }

    /* Stage Central de Foto Vertical */
    .photo-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 85px 24px 105px;
      z-index: 10;
    }

    .photo-card-wrap {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
    }

    .photo-frame {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 25px 65px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.15);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
      cursor: zoom-in;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .photo-img {
      max-height: calc(100vh - 210px);
      max-width: calc(100vw - 48px);
      width: auto;
      height: auto;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: high-quality;
      display: block;
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .photo-badge {
      position: absolute;
      bottom: 14px;
      left: 14px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      pointer-events: none;
    }

    /* Asas de Metadados Editoriais (Desktop) */
    .meta-wing-left, .meta-wing-right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 15;
      display: flex;
      flex-direction: column;
      gap: 24px;
      pointer-events: none;
      width: 240px;
    }

    .meta-wing-left { left: 40px; text-align: left; }
    .meta-wing-right { right: 40px; text-align: right; }

    @media (max-width: 1024px) {
      .meta-wing-left, .meta-wing-right { display: none; }
    }

    .meta-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      margin-bottom: 3px;
    }

    .meta-val {
      font-size: 0.95rem;
      font-weight: 500;
      color: #fff;
    }

    .meta-sub {
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    /* Barra Inferior com Scrubber (Filmstrip) */
    .bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 90px;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 25;
      backdrop-filter: blur(16px);
      background: linear-gradient(to top, rgba(8, 9, 13, 0.94) 0%, rgba(8, 9, 13, 0.5) 70%, transparent 100%);
    }

    .filmstrip-block {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .counter-text {
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      font-family: monospace;
      color: #fff;
      min-width: 60px;
    }

    .filmstrip-zone {
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: 440px;
      overflow-x: auto;
      padding: 8px 4px;
      scrollbar-width: none;
    }
    .filmstrip-zone::-webkit-scrollbar { display: none; }

    .strip-dot {
      width: 20px;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
      opacity: 0.35;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .strip-dot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .strip-dot.is-active {
      opacity: 1;
      width: 32px;
      border-color: #fff;
      transform: scale(1.1);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.8);
    }

    .strip-dot:hover { opacity: 0.85; }

    .nav-arrow-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s;
    }

    .nav-arrow-btn:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: scale(1.08);
    }

    /* MURAL / GRID MODAL */
    .grid-modal {
      position: fixed;
      inset: 0;
      background: rgba(8, 9, 13, 0.97);
      backdrop-filter: blur(28px);
      z-index: 120;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-y: auto;
      padding: 90px 28px 40px;
    }

    .grid-modal.is-open {
      opacity: 1;
      pointer-events: auto;
    }

    .masonry-columns {
      columns: 2 240px;
      column-gap: 20px;
    }

    @media (min-width: 768px) {
      .masonry-columns { columns: 3 280px; }
    }
    @media (min-width: 1100px) {
      .masonry-columns { columns: 4 280px; }
    }

    .masonry-item {
      break-inside: avoid;
      margin-bottom: 20px;
      border-radius: 16px;
      overflow: hidden;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: transform 0.3s, border-color 0.3s;
    }

    .masonry-item:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .masonry-item img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* LIGHTBOX MODAL */
    .lightbox {
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 150;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }

    .lightbox.is-open {
      opacity: 1;
      pointer-events: auto;
    }

    .lightbox-img {
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
      cursor: zoom-out;
    }

    .close-btn {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 160;
      transition: background 0.2s;
    }

    .close-btn:hover { background: rgba(255, 255, 255, 0.25); }
  </style>
</head>
<body class="antialiased selection:bg-amber-400 selection:text-black">

  <!-- ========================================== -->
  <!-- FUNDO DO SITE: MAPA MÚNDI ESCURO VETORIAL -->
  <!-- ========================================== -->
  <div class="world-map-backdrop" aria-hidden="true">
    <svg class="world-map-svg" viewBox="0 0 950 620" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <!-- Linhas de Grade de Coordenadas (Paralelos e Meridianos) -->
      <line x1="0" y1="310" x2="950" y2="310" class="map-equator" />
      <line x1="475" y1="0" x2="475" y2="620" class="map-grid-line" />
      <line x1="0" y1="229" x2="950" y2="229" class="map-grid-line" />
      <line x1="0" y1="391" x2="950" y2="391" class="map-grid-line" />
      <line x1="237" y1="0" x2="237" y2="620" class="map-grid-line" />
      <line x1="712" y1="0" x2="712" y2="620" class="map-grid-line" />

      <!-- Caminhos dos Continentes do Mundo -->
      <g id="continentsLayer">
        ${cleanedMapPaths}
      </g>
    </svg>

    <!-- Vinheta Suave que permite ver o mapa perfeitamente com transparência elegante -->
    <div class="world-map-vignette"></div>
  </div>

  <!-- PRELOADER -->
  <div class="preloader" id="preloader">
    <div class="preloader-title" id="preloaderTitle">
      <span>GUSTAVO • DIÁRIO DE VIAGENS</span>
    </div>
    <div class="preloader-sub" id="preloaderSub">
      🇬🇧 LONDRES • 🇨🇱 CHILE • 🇦🇷 ARGENTINA • 🇧🇷 RIO DE JANEIRO
    </div>
  </div>

  <!-- HEADER FIXO -->
  <header>
    <a href="#" class="brand" onclick="goToHome(event)">
      <span class="brand-mark"></span>
      <span class="brand-text">GUSTAVO • MEMORIES</span>
    </a>

    <!-- Menu Central (Alterna entre navegação do site e controle de álbuns) -->
    <nav class="hidden md:flex items-center">
      <!-- Navegação Principal da Home -->
      <div class="lb-group" id="homeNavGroup">
        <a href="#hero" class="nav-btn">Início</a>
        <a href="#sobre" class="nav-btn">Apresentação</a>
        <a href="#albuns" class="nav-btn">Álbuns</a>
      </div>

      <!-- Navegação no Modo Stage (Filtro de Destinos) -->
      <div class="lb-group hidden" id="stageNavGroup">
        <span class="lb-dot lb-dot--ghost" id="ghostDot"></span>
        <span class="lb-dot" id="activeDot"></span>
        <button class="nav-btn" data-dest="London" aria-current="page">🇬🇧 Londres (37)</button>
        <button class="nav-btn" data-dest="Chile">🇨🇱 Chile (16)</button>
        <button class="nav-btn" data-dest="Argentina">🇦🇷 Argentina (1)</button>
        <button class="nav-btn" data-dest="Rio">🇧🇷 Rio (10)</button>
      </div>
    </nav>

    <!-- Header Actions -->
    <div class="header-actions">
      <!-- Botão Voltar (aparece apenas quando o Cinema Stage estiver aberto) -->
      <button class="action-pill hidden" id="backToAlbumsBtn" onclick="closeCinemaStage()">
        <span>←</span>
        <span>Voltar aos Álbuns</span>
      </button>

      <!-- Som Ambiente YouTube (yOGxu13GLvI a 15%) -->
      <button class="action-pill" id="soundBtn" title="Clique para iniciar ou pausar a trilha sonora ambiente">
        <span class="eq-bars">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </span>
        <span id="soundText">Trilha Sonora</span>
      </button>

      <!-- Mural Grid Modal -->
      <button class="action-pill" id="openGridBtn">
        <span>⊞</span>
        <span>Mural</span>
      </button>
    </div>
  </header>

  <!-- Container do Player YouTube com dimensões válidas para o navegador permitir reprodução -->
  <div id="ytAmbientPlayerWrap" style="position:fixed;bottom:10px;right:10px;width:240px;height:140px;opacity:0.001;pointer-events:none;z-index:-10;overflow:hidden;border-radius:8px;">
    <div id="ytAmbientPlayer"></div>
  </div>

  <!-- ========================================== -->
  <!-- VISTA 1: HOME PAGE (DIÁRIO, APRESENTAÇÃO & ÁLBUNS) -->
  <!-- ========================================== -->
  <div id="homeView" class="relative z-10 w-full">

    <!-- Orbes de luz atmosféricos sutis -->
    <div class="ambient-halo-orb w-[650px] h-[650px] bg-amber-500/12 top-20 -left-48"></div>
    <div class="ambient-halo-orb w-[700px] h-[700px] bg-sky-500/10 top-[600px] -right-52"></div>
    <div class="ambient-halo-orb w-[800px] h-[800px] bg-emerald-500/08 top-[1400px] left-1/3"></div>

    <!-- 1. HERO SECTION -->
    <section id="hero" class="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-16 max-w-5xl mx-auto">
      <div class="reveal-on-scroll is-visible space-y-6">
        
        <!-- Badge Superior -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs tracking-widest uppercase text-amber-300">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Diário Fotográfico • 2023 — 2026
        </div>

        <!-- Título Principal Requisitado -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.15] text-stone-100 max-w-4xl mx-auto">
          "Bem vindo ao meu diário de viagens, aqui compartilho meus melhores momentos"
        </h1>

        <!-- Citação / Subtítulo Requisitado -->
        <p class="text-base sm:text-xl text-stone-400 font-light max-w-3xl mx-auto leading-relaxed italic border-l-2 border-amber-400/50 pl-6 text-left sm:text-center sm:border-none sm:pl-0">
          "As melhores viagens que fiz não foram os lugares que visitei mas os amigos que pude fazer, um agradecimento especial a todos que pude compartilhar essa jornada"
        </p>

        <!-- Ações do Hero -->
        <div class="pt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#albuns" class="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm tracking-wider uppercase hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-amber-400/20 hover:scale-105">
            Explorar Álbuns ↓
          </a>
          <a href="#sobre" class="px-7 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-stone-200 text-sm tracking-wider uppercase transition-all duration-300">
            Conhecer o Autor
          </a>
          <button onclick="openCinemaStage('ALL')" class="px-7 py-3.5 rounded-full border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-sm tracking-wider uppercase transition-all duration-300">
            Ver Todas (64 Fotos) 🎞️
          </button>
        </div>
      </div>

      <!-- Indicador animado de scroll -->
      <a href="#sobre" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors">
        <span class="text-[11px] tracking-widest uppercase">Role para conhecer</span>
        <div class="w-5 h-9 rounded-full border border-stone-600 flex justify-center p-1">
          <div class="w-1.5 h-2.5 rounded-full bg-stone-400 animate-bounce"></div>
        </div>
      </a>
    </section>

    <!-- 2. SEÇÃO DE APRESENTAÇÃO DO GUSTAVO COM FOTO FLUTUANTE -->
    <section id="sobre" class="py-28 px-6 max-w-6xl mx-auto border-t border-white/5">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Coluna da Esquerda: Texto de Apresentação -->
        <div class="lg:col-span-7 space-y-6 reveal-on-scroll">
          <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Apresentação do Autor
          </div>

          <h2 class="text-3xl sm:text-4xl font-light text-stone-100 leading-snug">
            Eternizando instantes antes que virem apenas memórias
          </h2>

          <!-- Texto de apresentação literal do usuário -->
          <div class="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            <p class="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              "Olá me chamo Gustavo ou gugu para os mais proximos estou na jornada de conehcer o maior numero de lugares que eu puder nessa vida, sou apaixonado por fotografia e natureza tentando sempre conciliar os dois e se teve algo que aprendi nesses 26 anos de jornada que tenho é que os momentos mais inesqueciveis são fotografias que viram memorias felizes na nossa cabeça, e tento eternizar isso com as minhas lentes"
            </p>
          </div>

          <!-- Pílulas de Destaque -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div class="text-xl sm:text-2xl font-bold text-amber-400">26</div>
              <div class="text-[11px] text-stone-400 tracking-wider uppercase mt-1">Anos de Jornada</div>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div class="text-xl sm:text-2xl font-bold text-sky-400">4</div>
              <div class="text-[11px] text-stone-400 tracking-wider uppercase mt-1">Expedições</div>
            </div>
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div class="text-xl sm:text-2xl font-bold text-emerald-400">64</div>
              <div class="text-[11px] text-stone-400 tracking-wider uppercase mt-1">Fotos Oficiais</div>
            </div>
            
            <!-- Atualizado: ∞ Aventuras Vividas conforme solicitado -->
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center group hover:border-purple-400/30 transition-all">
              <div class="text-xl sm:text-3xl font-bold text-purple-400 leading-tight">∞</div>
              <div class="text-[11px] text-stone-300 tracking-wider uppercase mt-1">Aventuras Vividas</div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Foto Flutuante do Gustavo com Efeito 3D e Halo -->
        <div class="lg:col-span-5 flex justify-center items-center reveal-on-scroll">
          <div class="relative w-full max-w-[340px] sm:max-w-[380px]">
            
            <!-- Halo de Luz Dourado/Âmbar Atrás da Foto -->
            <div class="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-purple-500/25 rounded-3xl blur-3xl transform scale-110 -z-10 animate-pulse"></div>

            <!-- Card com Animação Flutuante -->
            <div class="float-card relative rounded-3xl p-3 bg-white/[0.05] border border-white/20 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-amber-400/40">
              
              <!-- Moldura Vertical Mobile Nativa -->
              <div class="relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-white/10 group">
                <img 
                  src="profile.jpg" 
                  alt="Gustavo (Gugu)" 
                  class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                <!-- Gradiente de sombra na base -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                <!-- Selo de Status no Topo -->
                <div class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-emerald-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Pelo Mundo
                </div>

                <!-- Legenda do Autor na Base -->
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="text-lg font-medium text-white flex items-center justify-between">
                    <span>Gustavo (Gugu)</span>
                    <span class="text-xs text-amber-300 font-normal">26 Anos</span>
                  </div>
                  <div class="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                    <span>Fotografia & Natureza</span>
                    <span>•</span>
                    <span class="text-purple-300 font-medium">∞ Aventuras</span>
                  </div>
                </div>
              </div>

              <!-- Pílula decorativa flutuante embaixo -->
              <div class="mt-3 px-4 py-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-stone-400">
                <span>📍 Na estrada</span>
                <span class="text-amber-400 font-mono text-[11px]">2023 ➔ 2026</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 3. SEÇÃO DOS ÁLBUNS POR ANO & PAÍS (ROLAGEM FLUIDA) -->
    <section id="albuns" class="py-28 px-6 max-w-6xl mx-auto border-t border-white/5">
      
      <!-- Cabeçalho da Seção de Álbuns -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4 reveal-on-scroll">
        <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400">
          <span>📁</span>
          Pastas de Viagem & Cronologia
        </div>
        <h2 class="text-3xl sm:text-5xl font-light text-stone-100 tracking-tight">
          Álbuns & Expedições
        </h2>
        <p class="text-stone-400 text-sm sm:text-base font-light">
          Clique no álbum para abrir a galeria cinematográfica com as fotos verticais em altíssima resolução.
        </p>
      </div>

      <!-- Grade dos 4 Álbuns Solicitados com Bandeiras, Anos e Países -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        
        <!-- ÁLBUM 1: 2023 - LONDRES (REINO UNIDO) -->
        <div class="album-card group reveal-on-scroll" onclick="openCinemaStage('London')">
          <div class="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-950">
            <img 
              src="photos/London1.jpg" 
              alt="2023 - Londres (Reino Unido)" 
              class="cover-img w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"></div>
            
            <!-- Badge Superior -->
            <div class="absolute top-5 left-5 right-5 flex justify-between items-center">
              <span class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
                <span class="text-base">🇬🇧</span> 2023 • Londres
              </span>
              <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                37 Fotos
              </span>
            </div>

            <!-- Informações Inferiores -->
            <div class="absolute bottom-6 left-6 right-6 space-y-2">
              <div class="text-xs uppercase tracking-widest text-amber-300">Reino Unido</div>
              <h3 class="text-2xl sm:text-3xl font-medium text-white group-hover:text-amber-200 transition-colors">
                2023 — Londres
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 font-light line-clamp-2">
                A névoa britânica, o Big Ben, o Tâmisa e o pulsar cosmopolita de uma metrópole eterna.
              </p>
              
              <div class="pt-2 flex items-center justify-between text-xs text-stone-400">
                <span>Westminster • London Eye • Tower Bridge</span>
                <span class="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                  Abrir Álbum →
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ÁLBUM 2: 2024 - CHILE -->
        <div class="album-card group reveal-on-scroll" onclick="openCinemaStage('Chile')">
          <div class="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-950">
            <img 
              src="photos/Chile01.jpg" 
              alt="2024 - Chile" 
              class="cover-img w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"></div>
            
            <!-- Badge Superior -->
            <div class="absolute top-5 left-5 right-5 flex justify-between items-center">
              <span class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
                <span class="text-base">🇨🇱</span> 2024 • Chile
              </span>
              <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                16 Fotos
              </span>
            </div>

            <!-- Informações Inferiores -->
            <div class="absolute bottom-6 left-6 right-6 space-y-2">
              <div class="text-xs uppercase tracking-widest text-amber-300">América do Sul • Andes</div>
              <h3 class="text-2xl sm:text-3xl font-medium text-white group-hover:text-amber-200 transition-colors">
                2024 — Chile
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 font-light line-clamp-2">
                O silêncio do Deserto do Atacama e os picos majestosos da Cordilheira dos Andes.
              </p>
              
              <div class="pt-2 flex items-center justify-between text-xs text-stone-400">
                <span>Valle de la Luna • Salares • Cordilheira</span>
                <span class="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                  Abrir Álbum →
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ÁLBUM 3: 2025 - ARGENTINA -->
        <div class="album-card group reveal-on-scroll" onclick="openCinemaStage('Argentina')">
          <div class="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-950">
            <img 
              src="photos/Argentina1.jpg" 
              alt="2025 - Argentina" 
              class="cover-img w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"></div>
            
            <!-- Badge Superior -->
            <div class="absolute top-5 left-5 right-5 flex justify-between items-center">
              <span class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
                <span class="text-base">🇦🇷</span> 2025 • Argentina
              </span>
              <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                1 Foto
              </span>
            </div>

            <!-- Informações Inferiores -->
            <div class="absolute bottom-6 left-6 right-6 space-y-2">
              <div class="text-xs uppercase tracking-widest text-amber-300">Buenos Aires • Argentina</div>
              <h3 class="text-2xl sm:text-3xl font-medium text-white group-hover:text-amber-200 transition-colors">
                2025 — Argentina
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 font-light line-clamp-2">
                A elegância clássica da arquitetura portenha e as charmosas esquinas de Buenos Aires.
              </p>
              
              <div class="pt-2 flex items-center justify-between text-xs text-stone-400">
                <span>Buenos Aires • Avenidas Históricas</span>
                <span class="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                  Abrir Álbum →
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ÁLBUM 4: 2026 - RIO DE JANEIRO -->
        <div class="album-card group reveal-on-scroll" onclick="openCinemaStage('Rio')">
          <div class="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-950">
            <img 
              src="photos/rj1.jpg" 
              alt="2026 - Rio de Janeiro" 
              class="cover-img w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"></div>
            
            <!-- Badge Superior -->
            <div class="absolute top-5 left-5 right-5 flex justify-between items-center">
              <span class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2">
                <span class="text-base">🇧🇷</span> 2026 • Rio de Janeiro
              </span>
              <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                10 Fotos
              </span>
            </div>

            <!-- Informações Inferiores -->
            <div class="absolute bottom-6 left-6 right-6 space-y-2">
              <div class="text-xs uppercase tracking-widest text-amber-300">Brasil • Cidade Maravilhosa</div>
              <h3 class="text-2xl sm:text-3xl font-medium text-white group-hover:text-amber-200 transition-colors">
                2026 — Rio de Janeiro
              </h3>
              <p class="text-xs sm:text-sm text-stone-300 font-light line-clamp-2">
                O encontro do mar cristalino com as montanhas verdes e o espírito vibrante carioca.
              </p>
              
              <div class="pt-2 flex items-center justify-between text-xs text-stone-400">
                <span>Copacabana • Arpoador • Morros</span>
                <span class="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                  Abrir Álbum →
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>

    <!-- FOOTER DA HOME -->
    <footer class="py-16 px-6 max-w-6xl mx-auto border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
      <div>
        <p class="text-stone-300 font-medium">Gustavo • Diário de Viagens</p>
        <p class="mt-1">"Momentos inesquecíveis que viram fotografias eternas."</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="#hero" class="hover:text-stone-300 transition-colors">Voltar ao Topo ↑</a>
        <a href="#albuns" class="hover:text-stone-300 transition-colors">Álbuns</a>
        <button onclick="openCinemaStage('ALL')" class="hover:text-amber-300 text-stone-400">Abrir Galeria</button>
      </div>
    </footer>

  </div>

  <!-- ========================================== -->
  <!-- VISTA 2: CINEMA STAGE VIEWER (FOTOS VERTICAIS) -->
  <!-- ========================================== -->
  <main class="stage-view-container" id="stageView">
    
    <!-- Halo de Desfoque Cromático Dinâmico -->
    <div class="ambient-halo-container" id="haloContainer"></div>
    <div class="film-grain"></div>

    <!-- Metadados da Esquerda (Localização) -->
    <aside class="meta-wing-left">
      <div>
        <div class="meta-label">Destino & Expedição</div>
        <div class="meta-val" id="leftDest">Chile</div>
        <div class="meta-sub" id="leftCountry">América do Sul</div>
      </div>
      <div>
        <div class="meta-label">Localização & Ponto</div>
        <div class="meta-val" id="leftSpot">Valle de la Luna</div>
      </div>
      <div>
        <div class="meta-label">Coordenadas GPS</div>
        <div class="meta-val font-mono text-xs text-stone-400" id="leftCoords">23° 51' S, 68° 14' W</div>
      </div>
    </aside>

    <!-- Palco Central com Foto Vertical de Celular -->
    <div class="photo-stage">
      <div class="photo-card-wrap" id="photoCardWrap">
        <div class="photo-frame" id="photoFrame" title="Clique para expandir em tela cheia">
          <img class="photo-img" id="currentPhotoImg" src="" alt="Travel photo" />
          <div class="photo-badge" id="photoBadge">ORIGINAL • PORTRAIT MOBILE</div>
        </div>
      </div>
    </div>

    <!-- Metadados da Direita (Câmera & Arquivo) -->
    <aside class="meta-wing-right">
      <div>
        <div class="meta-label">Dispositivo & Lente</div>
        <div class="meta-val" id="rightCam">Mobile • 24mm</div>
        <div class="meta-sub" id="rightExp">f/1.78 • ISO 50 • HDR</div>
      </div>
      <div>
        <div class="meta-label">Arquivo de Origem</div>
        <div class="meta-val font-mono text-xs text-stone-400" id="rightFile">Foto.jpg</div>
      </div>
      <div>
        <div class="meta-label">Status da Jornada</div>
        <div class="meta-val text-xs text-purple-300">● ∞ Aventuras Vividas</div>
      </div>
    </aside>

    <!-- Barra Inferior com Scrubber e Setas -->
    <footer class="bottom-bar">
      <!-- Info para Mobile -->
      <div class="block lg:hidden max-w-[200px]">
        <div class="text-sm font-medium text-white truncate" id="bottomTitle">Destino</div>
        <div class="text-xs text-stone-400 truncate" id="bottomDesc">Detalhes</div>
      </div>

      <!-- Scrubber de Miniaturas Filmstrip -->
      <div class="filmstrip-block">
        <div class="counter-text">
          <span id="currentNum">01</span>
          <span class="text-stone-500">/</span>
          <span class="text-stone-500" id="totalNum">64</span>
        </div>

        <div class="filmstrip-zone" id="filmstripZone">
          <!-- Miniaturas injetadas dinamicamente -->
        </div>
      </div>

      <!-- Setas de Navegação -->
      <div class="flex items-center gap-2">
        <button class="nav-arrow-btn" id="prevBtn" aria-label="Foto anterior">←</button>
        <button class="nav-arrow-btn" id="nextBtn" aria-label="Próxima foto">→</button>
      </div>
    </footer>
  </main>

  <!-- ========================================== -->
  <!-- MODAL: MURAL / MASONRY CONTACT SHEET -->
  <!-- ========================================== -->
  <div class="grid-modal" id="gridModal">
    <button class="close-btn" id="closeGridBtn" aria-label="Fechar Mural">✕</button>
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="space-y-3">
        <div class="text-xs uppercase tracking-widest text-amber-400">Mural Fotográfico</div>
        <h2 class="text-3xl font-light text-white">Todas as Memórias</h2>
        <p class="text-xs text-stone-400">Clique em qualquer foto para visualizá-la no palco cinematográfico.</p>
      </div>

      <!-- Filtros no Mural -->
      <div class="flex flex-wrap gap-2" id="gridFilterChips">
        <button class="filter-chip is-active" data-dest="ALL">Todas (64)</button>
        <button class="filter-chip" data-dest="London">🇬🇧 Londres (37)</button>
        <button class="filter-chip" data-dest="Chile">🇨🇱 Chile (16)</button>
        <button class="filter-chip" data-dest="Argentina">🇦🇷 Argentina (1)</button>
        <button class="filter-chip" data-dest="Rio">🇧🇷 Rio (10)</button>
      </div>

      <div class="masonry-columns" id="masonryContainer"></div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: LIGHTBOX EM TELA CHEIA -->
  <!-- ========================================== -->
  <div class="lightbox" id="lightbox">
    <button class="close-btn" id="closeLightboxBtn" aria-label="Fechar Lightbox">✕</button>
    <img class="lightbox-img" id="lightboxImg" src="" alt="Full resolution view" />
  </div>

  <!-- SCRIPT PRINCIPAL -->
  <script>
    // Catálogo completo com as 64 fotos organizadas por destino
    const PHOTOS = ${JSON.stringify(filteredCatalog, null, 2)};

    let currentFilter = 'ALL';
    let activeList = [...PHOTOS];
    let currentIndex = 0;
    let isCinemaStageActive = false;

    function getPhotoUrl(filename) {
      return 'photos/' + encodeURIComponent(filename);
    }

    // 1. Alternância entre Home e Cinema Stage
    function openCinemaStage(dest = 'London') {
      isCinemaStageActive = true;
      document.getElementById('stageView').classList.add('is-active');
      document.getElementById('homeNavGroup').classList.add('hidden');
      document.getElementById('stageNavGroup').classList.remove('hidden');
      document.getElementById('backToAlbumsBtn').classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      const targetDest = dest === 'ALL' ? 'London' : dest;
      setFilter(targetDest);

      // Garante que a música continua tocando em qualquer área
      ensureMusicPlaying();
    }

    function closeCinemaStage() {
      isCinemaStageActive = false;
      document.getElementById('stageView').classList.remove('is-active');
      document.getElementById('stageNavGroup').classList.add('hidden');
      document.getElementById('homeNavGroup').classList.remove('hidden');
      document.getElementById('backToAlbumsBtn').classList.add('hidden');
      document.body.style.overflow = '';
      
      const albunsSec = document.getElementById('albuns');
      if (albunsSec) {
        albunsSec.scrollIntoView({ behavior: 'smooth' });
      }

      // Garante que a música continua tocando
      ensureMusicPlaying();
    }

    function goToHome(e) {
      if (e) e.preventDefault();
      if (isCinemaStageActive) {
        closeCinemaStage();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Filtro de Destinos
    function setFilter(dest) {
      currentFilter = dest;
      if (dest === 'ALL') {
        activeList = [...PHOTOS];
      } else {
        activeList = PHOTOS.filter(p => p.dest === dest);
      }
      currentIndex = 0;
      updateStagePhoto();
      renderFilmstrip();
      updateStageNavSelection(dest);
    }

    function updateStageNavSelection(dest) {
      const navGroup = document.getElementById('stageNavGroup');
      const btns = navGroup.querySelectorAll('.nav-btn');
      btns.forEach(b => {
        if (b.getAttribute('data-dest') === dest) {
          b.setAttribute('aria-current', 'page');
          placeActive(b);
        } else {
          b.removeAttribute('aria-current');
        }
      });
    }

    // 3. Atualização do Stage Cinematográfico
    function updateStagePhoto() {
      if (!activeList.length) return;
      const photo = activeList[currentIndex];

      const imgEl = document.getElementById('currentPhotoImg');
      imgEl.style.opacity = '0';
      imgEl.style.transform = 'scale(0.96)';

      setTimeout(() => {
        imgEl.src = getPhotoUrl(photo.file);
        imgEl.onload = () => {
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        };
      }, 150);

      // Atualiza Metadados
      document.getElementById('leftDest').textContent = photo.dest === 'London' ? 'Londres' : photo.dest;
      document.getElementById('leftCountry').textContent = photo.country;
      document.getElementById('leftSpot').textContent = photo.spot;
      document.getElementById('leftCoords').textContent = photo.coords;

      document.getElementById('rightCam').textContent = photo.cam;
      document.getElementById('rightExp').textContent = photo.exp;
      document.getElementById('rightFile').textContent = photo.file;

      document.getElementById('bottomTitle').textContent = photo.spot;
      document.getElementById('bottomDesc').textContent = photo.country;

      // Contador
      document.getElementById('currentNum').textContent = String(currentIndex + 1).padStart(2, '0');
      document.getElementById('totalNum').textContent = String(activeList.length).padStart(2, '0');

      // Atualiza Halo Cromático Atmosférico
      updateAmbientHalo(getPhotoUrl(photo.file));

      // Atualiza destaque na fita de miniaturas
      highlightActiveFilmstripDot();
    }

    function updateAmbientHalo(imgUrl) {
      const container = document.getElementById('haloContainer');
      const oldHalo = container.querySelector('.ambient-halo-img.is-active');

      const newHalo = document.createElement('img');
      newHalo.className = 'ambient-halo-img';
      newHalo.src = imgUrl;

      container.appendChild(newHalo);

      setTimeout(() => {
        newHalo.classList.add('is-active');
        if (oldHalo) {
          oldHalo.classList.remove('is-active');
          setTimeout(() => oldHalo.remove(), 900);
        }
      }, 50);
    }

    function renderFilmstrip() {
      const zone = document.getElementById('filmstripZone');
      zone.innerHTML = '';

      activeList.forEach((photo, idx) => {
        const dot = document.createElement('div');
        dot.className = 'strip-dot' + (idx === currentIndex ? ' is-active' : '');
        dot.title = photo.spot + ' • ' + photo.country;

        const img = document.createElement('img');
        img.src = getPhotoUrl(photo.file);
        img.alt = photo.spot;
        img.loading = 'lazy';

        dot.appendChild(img);
        dot.addEventListener('click', () => {
          currentIndex = idx;
          updateStagePhoto();
        });

        zone.appendChild(dot);
      });
    }

    function highlightActiveFilmstripDot() {
      const dots = document.querySelectorAll('.strip-dot');
      dots.forEach((d, idx) => {
        if (idx === currentIndex) {
          d.classList.add('is-active');
          d.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          d.classList.remove('is-active');
        }
      });
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = activeList.length - 1;
      }
      updateStagePhoto();
    }

    function nextSlide() {
      if (currentIndex < activeList.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateStagePhoto();
    }

    // 4. Navegação por Pontinho Deslizante (OGON Style)
    const navGroup = document.getElementById('stageNavGroup');
    const activeDot = document.getElementById('activeDot');
    const ghostDot = document.getElementById('ghostDot');

    function placeActive(el) {
      if (!el || !navGroup) return;
      const gRect = navGroup.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const x = eRect.left - gRect.left + 8;
      activeDot.style.setProperty('--dot-x', \`\${x}px\`);
      activeDot.style.setProperty('--dot-o', '1');
    }

    function placeGhost(el, show = true) {
      if (!show || !el || !navGroup) {
        ghostDot.style.setProperty('--g-o', '0');
        return;
      }
      const gRect = navGroup.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const x = eRect.left - gRect.left + 8;
      ghostDot.style.setProperty('--g-x', \`\${x}px\`);
      ghostDot.style.setProperty('--g-o', '0.65');
    }

    navGroup.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('pointerenter', () => placeGhost(btn, true));
      btn.addEventListener('click', () => {
        const dest = btn.getAttribute('data-dest');
        setFilter(dest);
      });
    });

    navGroup.addEventListener('pointerleave', () => {
      const cur = navGroup.querySelector('.nav-btn[aria-current="page"]');
      placeGhost(cur, false);
    });

    // ==========================================
    // 5. TRILHA SONORA DO YOUTUBE (ININTERRUPTA & INFALÍVEL)
    // ==========================================
    let ytPlayer = null;
    let isSoundOn = false;
    let isYtReady = false;
    let userExplicitlyPaused = false;
    let isStartingPlayback = false;
    let lastPlaybackTime = 0;
    let lastPlaybackProgressAt = 0;
    const YOUTUBE_VIDEO_ID = 'yOGxu13GLvI';
    const AMBIENT_VOLUME = 15;
    const WATCHDOG_INTERVAL_MS = 1200;
    const STALL_TIMEOUT_MS = 9000;

    function markPlaybackProgress(currentTime) {
      if (typeof currentTime !== 'number' || Number.isNaN(currentTime)) return;
      if (currentTime > lastPlaybackTime + 0.08 || currentTime < lastPlaybackTime - 0.3) {
        lastPlaybackProgressAt = Date.now();
      }
      lastPlaybackTime = currentTime;
    }

    function forceResumePlayback(reason = 'watchdog') {
      if (userExplicitlyPaused) return;
      if (!isYtReady || !ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

      try {
        ytPlayer.unMute();
        ytPlayer.setVolume(AMBIENT_VOLUME);
      } catch (e) {}

      try {
        const state = typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
        if (state === YT.PlayerState.ENDED && typeof ytPlayer.seekTo === 'function') {
          ytPlayer.seekTo(0, true);
        }
        ytPlayer.playVideo();
        console.log('Recuperando trilha sonora (' + reason + ')');
      } catch (e) {}
    }

    function updateSoundButton(playing) {
      const soundBtn = document.getElementById('soundBtn');
      const soundText = document.getElementById('soundText');
      if (!soundBtn || !soundText) return;

      if (playing) {
        soundBtn.classList.add('is-playing');
        soundBtn.style.borderColor = 'rgba(234, 179, 8, 0.8)';
        soundBtn.style.boxShadow = '0 0 16px rgba(234, 179, 8, 0.3)';
        soundText.textContent = "Tocando 15%";
        soundText.style.color = "#eab308";
      } else {
        soundBtn.classList.remove('is-playing');
        soundBtn.style.borderColor = '';
        soundBtn.style.boxShadow = '';
        soundText.textContent = "Trilha Sonora";
        soundText.style.color = '';
      }
    }

    // Inicializa o Player do YouTube
    window.onYouTubeIframeAPIReady = function() {
      console.log('YouTube IFrame API carregada com sucesso.');
      try {
        ytPlayer = new YT.Player('ytAmbientPlayer', {
          height: '140',
          width: '240',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              console.log('Player YouTube pronto para reprodução ininterrupta.');
              isYtReady = true;
              event.target.setVolume(AMBIENT_VOLUME);
              event.target.unMute();
              lastPlaybackProgressAt = Date.now();

              // Tenta iniciar imediatamente
              if (!userExplicitlyPaused) {
                try {
                  event.target.playVideo();
                } catch (e) {}
              }
            },
            onStateChange: (event) => {
              // 1 = PLAYING
              if (event.data === YT.PlayerState.PLAYING) {
                isSoundOn = true;
                isStartingPlayback = false;
                lastPlaybackProgressAt = Date.now();
                updateSoundButton(true);
              } 
              // 0 = ENDED -> Loop imediato sem pausas!
              else if (event.data === YT.PlayerState.ENDED) {
                console.log('Fim da música: reiniciando loop instantâneo...');
                forceResumePlayback('ended');
              } 
              // 2 = PAUSED -> Se o usuário NÃO pausou explicitamente, retoma automaticamente!
              else if (event.data === YT.PlayerState.PAUSED) {
                if (!userExplicitlyPaused) {
                  setTimeout(() => {
                    if (!userExplicitlyPaused && ytPlayer && typeof ytPlayer.playVideo === 'function') {
                      forceResumePlayback('unexpected-pause');
                    }
                  }, 400);
                }
              }
              // -1 = UNSTARTED / 5 = CUED -> tenta retomar para evitar estado inativo
              else if (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.CUED) {
                if (!userExplicitlyPaused) {
                  setTimeout(() => forceResumePlayback('unstarted-or-cued'), 250);
                }
              }
            },
            onError: (err) => {
              console.warn('YouTube Player Erro:', err);
            }
          }
        });
      } catch (err) {
        console.error('Falha ao inicializar o YT.Player:', err);
      }
    };

    // Injeta dinamicamente o script da API do YouTube
    (function loadYouTubeScript() {
      if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      } else {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    })();

    // Função central que garante que a música está tocando sem disparos duplicados
    function ensureMusicPlaying() {
      if (userExplicitlyPaused) return;

      if (isYtReady && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        const state = typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
        // Se já está tocando, não interrompe nem sobrecarrega a API
        if (state === YT.PlayerState.PLAYING) {
          isSoundOn = true;
          updateSoundButton(true);
          return;
        }

        if (!isStartingPlayback) {
          isStartingPlayback = true;
          try {
            ytPlayer.unMute();
            ytPlayer.setVolume(AMBIENT_VOLUME);
            ytPlayer.playVideo();
            lastPlaybackProgressAt = Date.now();
            isSoundOn = true;
            updateSoundButton(true);
          } catch (e) {}
          setTimeout(() => { isStartingPlayback = false; }, 800);
        }
      }
    }

    function toggleSound() {
      if (!isSoundOn) {
        userExplicitlyPaused = false;
        ensureMusicPlaying();
      } else {
        userExplicitlyPaused = true;
        isSoundOn = false;
        if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
          try {
            ytPlayer.pauseVideo();
          } catch (e) {}
        }
        updateSoundButton(false);
      }
    }

    document.getElementById('soundBtn').addEventListener('click', toggleSound);

    // Watchdog ativo: garante retomada automática e loop contínuo sem travamentos.
    setInterval(() => {
      if (!userExplicitlyPaused && isYtReady && ytPlayer) {
        try {
          const state = typeof ytPlayer.getPlayerState === 'function' ? ytPlayer.getPlayerState() : -1;
          const now = Date.now();
          let cur = -1;
          let dur = -1;

          if (typeof ytPlayer.getCurrentTime === 'function') {
            cur = ytPlayer.getCurrentTime();
            markPlaybackProgress(cur);
          }
          if (typeof ytPlayer.getDuration === 'function') {
            dur = ytPlayer.getDuration();
          }
          
          // Se chegou ao fim ou pausou inesperadamente, retoma imediatamente
          if (
            state === YT.PlayerState.ENDED ||
            state === YT.PlayerState.PAUSED ||
            state === YT.PlayerState.UNSTARTED ||
            state === YT.PlayerState.CUED
          ) {
            forceResumePlayback('state-' + String(state));
          }

          // Se estiver próximo do final, garante reinício sem silêncio.
          if (dur > 0 && cur >= dur - 0.4) {
            forceResumePlayback('near-end');
          }

          // Se travar sem avançar por vários segundos, força recuperação.
          if (state === YT.PlayerState.PLAYING && lastPlaybackProgressAt > 0) {
            const stalledFor = now - lastPlaybackProgressAt;
            if (stalledFor >= STALL_TIMEOUT_MS) {
              forceResumePlayback('stalled-' + stalledFor + 'ms');
            }
          }
        } catch (e) {}
      }
    }, WATCHDOG_INTERVAL_MS);

    // Inicia na primeira interação do usuário (apenas uma vez para não sobrecarregar)
    const startGestures = ['click', 'touchstart', 'scroll', 'wheel', 'pointerdown', 'keydown'];
    function handleInitialGesture() {
      if (!userExplicitlyPaused) {
        ensureMusicPlaying();
      }
      startGestures.forEach(evt => window.removeEventListener(evt, handleInitialGesture));
    }
    startGestures.forEach(evt => window.addEventListener(evt, handleInitialGesture, { passive: true }));

    // Retoma automaticamente quando o usuário voltar para a aba
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !userExplicitlyPaused) {
        ensureMusicPlaying();
      }
    });

    // 6. Lightbox
    function openLightbox(url) {
      const lightbox = document.getElementById('lightbox');
      const img = document.getElementById('lightboxImg');
      img.src = url || getPhotoUrl(activeList[currentIndex].file);
      lightbox.classList.add('is-open');
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('is-open');
    }

    document.getElementById('photoFrame').addEventListener('click', () => openLightbox());
    document.getElementById('closeLightboxBtn').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target !== document.getElementById('lightboxImg')) closeLightbox();
    });

    // 7. Mural Grid Modal
    const gridModal = document.getElementById('gridModal');
    function renderMasonry(dest = 'ALL') {
      const container = document.getElementById('masonryContainer');
      container.innerHTML = '';
      const list = dest === 'ALL' ? PHOTOS : PHOTOS.filter(p => p.dest === dest);

      list.forEach((photo) => {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.innerHTML = \`
          <img src="\${getPhotoUrl(photo.file)}" alt="\${photo.spot}" loading="lazy" />
          <div class="p-3 bg-neutral-900 flex justify-between items-center text-xs">
            <span class="font-medium text-white truncate max-w-[140px]">\${photo.spot}</span>
            <span class="text-stone-400 font-mono text-[11px]">\${photo.dest}</span>
          </div>
        \`;
        item.addEventListener('click', () => {
          gridModal.classList.remove('is-open');
          openCinemaStage(photo.dest);
          const idx = activeList.findIndex(p => p.file === photo.file);
          if (idx !== -1) {
            currentIndex = idx;
            updateStagePhoto();
          }
        });
        container.appendChild(item);
      });
    }

    document.getElementById('openGridBtn').addEventListener('click', () => {
      renderMasonry(currentFilter);
      gridModal.classList.add('is-open');
    });

    document.getElementById('closeGridBtn').addEventListener('click', () => {
      gridModal.classList.remove('is-open');
    });

    document.querySelectorAll('#gridFilterChips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#gridFilterChips .filter-chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        renderMasonry(chip.getAttribute('data-dest'));
      });
    });

    // 8. Revelação no Scroll (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // 9. Teclado
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('lightbox').classList.contains('is-open')) {
        if (e.key === 'Escape') closeLightbox();
        return;
      }
      if (gridModal.classList.contains('is-open')) {
        if (e.key === 'Escape') gridModal.classList.remove('is-open');
        return;
      }
      if (isCinemaStageActive) {
        if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
        else if (e.key === 'Escape') closeCinemaStage();
      }
    });

    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);

    // 10. Desativação do Preloader
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('preloaderTitle').classList.add('is-in');
        document.getElementById('preloaderSub').classList.add('is-in');
      }, 200);

      setTimeout(() => {
        document.getElementById('preloader').classList.add('is-hidden');
      }, 1000);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html gerado com sucesso com Mapa Múndi nítido e Áudio YouTube resiliente!');
