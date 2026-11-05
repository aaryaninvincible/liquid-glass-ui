/**
 * BeatWave Liquid Glass UI Studio - Interactive Controller
 * Simulates Android AGSL RuntimeShader, Compose LayerBackdrop, and Optics
 */

// Track Playlist Data
const PLAYLIST = [
  {
    title: 'breakaway',
    artist: 'Kelly Clarkson • 3:57',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    durationSec: 237,
    lyrics: [
      '"I\'ll spread my wings and I\'ll learn how to fly..."',
      '"I\'ll do what it takes til I touch the sky"'
    ]
  },
  {
    title: 'Under Pressure (...',
    artist: 'Queen',
    artwork: 'queen',
    durationSec: 248,
    lyrics: [
      '"Pressure pushing down on me..."',
      '"Pressing down on you, no man ask for"'
    ]
  },
  {
    title: 'Prism Horizon',
    artist: 'Glass Architecture • API 33',
    artwork: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    durationSec: 175,
    lyrics: [
      '"Seven colors dispersed upon the rim..."',
      '"Pure physics distilled into code"'
    ]
  },
  {
    title: 'Neon Resonance',
    artist: 'Compose Runtime • 120 FPS',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    durationSec: 228,
    lyrics: [
      '"Zero allocation in the draw loop..."',
      '"The backdrop shimmers like liquid mercury"'
    ]
  }
];

// Presets Definition
const PRESETS = {
  beatwave: {
    lensHeight: 0.40,
    lensAmount: 0.60,
    blur: 24,
    vibrancy: 1.20,
    opacity: 0.45,
    rimAlpha: 0.55,
    dispersion: true,
    lightDrift: true,
    mode: 'LIQUID'
  },
  apple: {
    lensHeight: 0.15,
    lensAmount: 0.25,
    blur: 38,
    vibrancy: 1.35,
    opacity: 0.65,
    rimAlpha: 0.40,
    dispersion: false,
    lightDrift: false,
    mode: 'BLUR'
  },
  crystal: {
    lensHeight: 0.70,
    lensAmount: 0.90,
    blur: 16,
    vibrancy: 1.50,
    opacity: 0.25,
    rimAlpha: 0.85,
    dispersion: true,
    lightDrift: true,
    mode: 'LIQUID'
  },
  subtle: {
    lensHeight: 0.10,
    lensAmount: 0.15,
    blur: 18,
    vibrancy: 1.05,
    opacity: 0.75,
    rimAlpha: 0.25,
    dispersion: false,
    lightDrift: false,
    mode: 'BLUR'
  }
};

// Application State
const state = {
  currentTrackIndex: 1, // Queen - Under Pressure (matching user's screenshot)
  isPlaying: true,
  currentTimeSec: 102,
  isLiked: true,
  isShuffle: false,
  isRepeat: false,
  activeTab: 1, // Library (matching user's screenshot)
  activeMode: 'LIQUID',
  activeScreenMode: 'queen', // 'queen', 'peach', 'midnight'
  driftAnimationId: null,
  lightAngle: 45,
  isDraggingScrubber: false,
  isDraggingPuck: false
};

// Tab Data for Droplet Puck (Home, Library, Settings)
const TAB_DATA = [
  {
    key: 'home',
    name: 'Home',
    svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
  },
  {
    key: 'library',
    name: 'Library',
    svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><line x1="8" y1="7" x2="16" y2="7"/><path d="M10 16a2 2 0 1 0 2-2V10h3"/></svg>'
  },
  {
    key: 'settings',
    name: 'Settings',
    svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
  }
];

// DOM References
const elements = {
  // Tabs & Navigation
  panelTabs: {
    controls: document.getElementById('tabControls'),
    architecture: document.getElementById('tabArchitecture'),
    code: document.getElementById('tabCode')
  },
  panelContents: {
    controls: document.getElementById('contentControls'),
    architecture: document.getElementById('contentArchitecture'),
    code: document.getElementById('contentCode')
  },
  panelTabsContainer: document.getElementById('panelTabsContainer'),
  panelTabPuck: document.getElementById('panelTabPuck'),
  panelTabDroplet: document.getElementById('panelTabDroplet'),
  tierBadge: document.getElementById('tierBadge'),
  
  // Sliders & Controls
  inputLensHeight: document.getElementById('inputLensHeight'),
  valLensHeight: document.getElementById('valLensHeight'),
  inputLensAmount: document.getElementById('inputLensAmount'),
  valLensAmount: document.getElementById('valLensAmount'),
  inputBlur: document.getElementById('inputBlur'),
  valBlur: document.getElementById('valBlur'),
  inputVibrancy: document.getElementById('inputVibrancy'),
  valVibrancy: document.getElementById('valVibrancy'),
  inputOpacity: document.getElementById('inputOpacity'),
  valOpacity: document.getElementById('valOpacity'),
  inputRimAlpha: document.getElementById('inputRimAlpha'),
  valRimAlpha: document.getElementById('valRimAlpha'),
  checkDispersion: document.getElementById('checkDispersion'),
  checkLightDrift: document.getElementById('checkLightDrift'),
  
  // Bottom Bar & Liquid Droplet Lens (The Signature BeatWave Feature)
  floatingNavBar: document.getElementById('floatingNavBar'),
  floatingNavWrapper: document.getElementById('floatingNavWrapper'),
  liquidDropletLens: document.getElementById('liquidDropletLens'),
  dropletGlint: document.getElementById('dropletGlint'),
  dropletOpticsCanvas: document.getElementById('dropletOpticsCanvas'),
  dropletLightWave: document.getElementById('dropletLightWave'),
  caustics: {
    tl: document.getElementById('causticTL'),
    tr: document.getElementById('causticTR'),
    bl: document.getElementById('causticBL'),
    br: document.getElementById('causticBR')
  },
  navbarLiquidBgLight: document.getElementById('navbarLiquidBgLight'),
  dropletRefractedBackdrop: document.getElementById('dropletRefractedBackdrop'),
  puckIconSample: document.getElementById('puckIconSample'),
  navTabs: document.querySelectorAll('.nav-tab'),
  navSearchCircle: document.getElementById('navSearchCircle'),

  // Floating Mini Player (Queen - Under Pressure)
  floatingMiniPlayer: document.getElementById('floatingMiniPlayer'),
  miniPlayBtn: document.getElementById('miniPlayBtn'),
  miniPlayIcon: document.getElementById('miniPlayIcon'),
  miniNextBtn: document.getElementById('miniNextBtn'),
  miniTitle: document.getElementById('miniTitle'),
  miniArtist: document.getElementById('miniArtist'),
  miniPlayerExpandBtn: document.getElementById('miniPlayerExpandBtn'),
  songRows: document.querySelectorAll('.song-row'),
  
  // Full Player Overlay
  fullPlayerOverlay: document.getElementById('fullPlayerOverlay'),
  closeOverlayBtn: document.getElementById('closeOverlayBtn'),
  overlayTrackTitle: document.getElementById('overlayTrackTitle'),
  overlayArtist: document.getElementById('overlayArtist'),

  // Scrubber & Sliders
  scrubberTrack: document.getElementById('scrubberTrack'),
  scrubberFill: document.getElementById('scrubberFill'),
  scrubberThumb: document.getElementById('scrubberThumb'),
  currentTime: document.getElementById('currentTime'),
  duration: document.getElementById('duration'),
  
  phoneFrame: document.getElementById('phoneMockupFrame') || document.querySelector('.phone-frame'),

  // BeatWave APK Screen Views & Navigation
  screenQueen: document.getElementById('screenQueen'),
  screens: [
    document.getElementById('screenHome'),
    document.getElementById('screenLibrary'),
    document.getElementById('screenSettings')
  ],
  homeSettingsShortcut: document.getElementById('homeSettingsShortcut'),
  btnSettingsBack: document.getElementById('btnSettingsBack'),
  settingRowAppearance: document.getElementById('settingRowAppearance'),

  // Theme Toggles
  btnThemeQueen: document.getElementById('btnThemeQueen'),
  btnThemePeach: document.getElementById('btnThemePeach'),
  btnThemeDark: document.getElementById('btnThemeDark'),
  pillSelectPeach: document.getElementById('pillSelectPeach'),
  pillSelectMidnight: document.getElementById('pillSelectMidnight'),

  // Real APK Comparison Modal
  btnOpenCompare: document.getElementById('btnOpenCompare'),
  btnCloseCompareModal: document.getElementById('btnCloseCompareModal'),
  compareModalBackdrop: document.getElementById('compareModalBackdrop'),
  apkCompareModal: document.getElementById('apkCompareModal'),
  compareTabBtns: document.querySelectorAll('.compare-tab-btn'),
  compareSlides: document.querySelectorAll('.compare-view-slide')
};

// Initialize Application
function init() {
  setupTabs();
  setupSliders();
  setupPresets();
  setupModes();
  setupPlayer();
  setupBottomNav();
  setupTiltOptics();
  setupScreensAndThemes();
  setupCompareModal();
  startLightDriftLoop();
  updateTrackUI();
  updateGlassVariables();
}

// Format Seconds to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Setup Panel Tabs (Shader Inspector / Architecture / Compose Code)
function setupTabs() {
  const tabs = [
    { btn: elements.panelTabs.controls, content: elements.panelContents.controls },
    { btn: elements.panelTabs.architecture, content: elements.panelContents.architecture },
    { btn: elements.panelTabs.code, content: elements.panelContents.code }
  ];

  function positionPanelPuck(btn) {
    if (!elements.panelTabPuck || !elements.panelTabsContainer || !btn) return;
    const containerRect = elements.panelTabsContainer.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const left = btnRect.left - containerRect.left;
    elements.panelTabPuck.style.transform = `translateX(${left}px)`;
    elements.panelTabPuck.style.width = `${btnRect.width}px`;
  }

  tabs.forEach(({ btn, content }) => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => {
        t.btn.classList.remove('active');
        t.content.classList.remove('active');
      });
      btn.classList.add('active');
      content.classList.add('active');
      positionPanelPuck(btn);
    });
  });

  // Panel Tabs Hover Droplet
  if (elements.panelTabsContainer && elements.panelTabDroplet) {
    elements.panelTabsContainer.addEventListener('mousemove', (e) => {
      const rect = elements.panelTabsContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      elements.panelTabDroplet.style.left = `${x}px`;
      elements.panelTabDroplet.style.top = `${y}px`;
      elements.panelTabDroplet.classList.add('visible');
    });

    elements.panelTabsContainer.addEventListener('mouseleave', () => {
      elements.panelTabDroplet.classList.remove('visible');
    });
  }

  // Position initial puck
  setTimeout(() => {
    positionPanelPuck(elements.panelTabs.controls);
  }, 100);
}

// 2. Setup Sliders & Reactive CSS Variables
function setupSliders() {
  elements.inputLensHeight.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.valLensHeight.textContent = val.toFixed(2);
    document.documentElement.style.setProperty('--glass-lens-height', val);
  });

  elements.inputLensAmount.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.valLensAmount.textContent = val.toFixed(2);
    document.documentElement.style.setProperty('--glass-lens-amount', val);
  });

  elements.inputBlur.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    elements.valBlur.textContent = `${val} px`;
    document.documentElement.style.setProperty('--glass-blur', `${val}px`);
  });

  elements.inputVibrancy.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.valVibrancy.textContent = `${val.toFixed(2)}x`;
    document.documentElement.style.setProperty('--glass-vibrancy', val);
  });

  elements.inputOpacity.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.valOpacity.textContent = val.toFixed(2);
    document.documentElement.style.setProperty('--glass-tint-opacity', val);
  });

  elements.inputRimAlpha.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    elements.valRimAlpha.textContent = val.toFixed(2);
    document.documentElement.style.setProperty('--glass-rim-alpha', val);
  });

  elements.checkDispersion.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    document.documentElement.style.setProperty('--glass-dispersion', enabled ? '1' : '0');
    if (elements.playerGlassSurface) {
      if (enabled) {
        elements.playerGlassSurface.classList.add('has-dispersion');
      } else {
        elements.playerGlassSurface.classList.remove('has-dispersion');
      }
    }
  });

  elements.checkLightDrift.addEventListener('change', (e) => {
    if (e.target.checked) {
      startLightDriftLoop();
    } else {
      cancelAnimationFrame(state.driftAnimationId);
    }
  });
}

// 3. Setup Presets
function setupPresets() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const presetKey = chip.getAttribute('data-preset');
      const preset = PRESETS[presetKey];
      if (preset) {
        applyPreset(preset);
      }
    });
  });
}

function applyPreset(preset) {
  elements.inputLensHeight.value = preset.lensHeight;
  elements.valLensHeight.textContent = preset.lensHeight.toFixed(2);

  elements.inputLensAmount.value = preset.lensAmount;
  elements.valLensAmount.textContent = preset.lensAmount.toFixed(2);

  elements.inputBlur.value = preset.blur;
  elements.valBlur.textContent = `${preset.blur} px`;

  elements.inputVibrancy.value = preset.vibrancy;
  elements.valVibrancy.textContent = `${preset.vibrancy.toFixed(2)}x`;

  elements.inputOpacity.value = preset.opacity;
  elements.valOpacity.textContent = preset.opacity.toFixed(2);

  elements.inputRimAlpha.value = preset.rimAlpha;
  elements.valRimAlpha.textContent = preset.rimAlpha.toFixed(2);

  elements.checkDispersion.checked = preset.dispersion;
  elements.checkLightDrift.checked = preset.lightDrift;

  // Apply mode
  setMode(preset.mode);
  updateGlassVariables();
}

// 4. Setup Engine Modes (LIQUID, BLUR, TRANSPARENT)
function setupModes() {
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      setMode(mode);
    });
  });
}

function setMode(mode) {
  state.activeMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });

  const root = document.documentElement;
  if (mode === 'LIQUID') {
    elements.tierBadge.textContent = 'Tier: High (AGSL + Dispersion)';
    elements.tierBadge.style.borderColor = 'rgba(0, 240, 255, 0.4)';
    elements.tierBadge.style.color = 'var(--accent-cyan)';
    root.style.setProperty('--glass-blur', `${elements.inputBlur.value}px`);
    root.style.setProperty('--glass-rim-alpha', elements.inputRimAlpha.value);
    root.style.setProperty('--glass-dispersion', elements.checkDispersion.checked ? '1' : '0');
  } else if (mode === 'BLUR') {
    elements.tierBadge.textContent = 'Tier: Mid (RenderEffect Blur)';
    elements.tierBadge.style.borderColor = 'rgba(157, 78, 221, 0.4)';
    elements.tierBadge.style.color = 'var(--accent-purple)';
    root.style.setProperty('--glass-blur', `${elements.inputBlur.value}px`);
    root.style.setProperty('--glass-rim-alpha', '0.25');
    root.style.setProperty('--glass-dispersion', '0');
  } else if (mode === 'TRANSPARENT') {
    elements.tierBadge.textContent = 'Tier: Low (Alpha Tint Fallback)';
    elements.tierBadge.style.borderColor = 'rgba(148, 163, 184, 0.3)';
    elements.tierBadge.style.color = 'var(--text-muted)';
    root.style.setProperty('--glass-blur', '0px');
    root.style.setProperty('--glass-rim-alpha', '0.1');
    root.style.setProperty('--glass-dispersion', '0');
  }
}

// Update All Glass CSS Variables
function updateGlassVariables() {
  const root = document.documentElement;
  root.style.setProperty('--glass-lens-height', elements.inputLensHeight.value);
  root.style.setProperty('--glass-lens-amount', elements.inputLensAmount.value);
  root.style.setProperty('--glass-blur', `${elements.inputBlur.value}px`);
  root.style.setProperty('--glass-vibrancy', elements.inputVibrancy.value);
  root.style.setProperty('--glass-tint-opacity', elements.inputOpacity.value);
  root.style.setProperty('--glass-rim-alpha', elements.inputRimAlpha.value);
  root.style.setProperty('--glass-dispersion', elements.checkDispersion.checked ? '1' : '0');
}

// 5. Specular Light Vector Drift (Simulates BeatWave AGSL Light Glint Animation)
function startLightDriftLoop() {
  let startTime = performance.now();

  function loop(time) {
    if (!elements.checkLightDrift.checked) return;
    const elapsed = (time - startTime) / 1000;
    // Oscillate between 20deg and 70deg with period of 7 seconds (BeatWave standard)
    const angle = 45 + 25 * Math.sin((elapsed * Math.PI * 2) / 7.0);
    state.lightAngle = angle;
    document.documentElement.style.setProperty('--glass-rim-angle', `${angle.toFixed(1)}deg`);
    state.driftAnimationId = requestAnimationFrame(loop);
  }

  state.driftAnimationId = requestAnimationFrame(loop);
}

// 6. BeatWave Mini Player & Song List Controls
function setupPlayer() {
  if (elements.miniPlayBtn) {
    elements.miniPlayBtn.addEventListener('click', togglePlayPause);
  }

  if (elements.miniNextBtn) {
    elements.miniNextBtn.addEventListener('click', () => {
      state.currentTrackIndex = (state.currentTrackIndex + 1) % PLAYLIST.length;
      state.currentTimeSec = 0;
      updateTrackUI();
    });
  }

  // Open / Close Full Player Overlay
  if (elements.miniPlayerExpandBtn && elements.fullPlayerOverlay) {
    elements.miniPlayerExpandBtn.addEventListener('click', () => {
      elements.fullPlayerOverlay.classList.add('open');
    });
  }

  if (elements.closeOverlayBtn && elements.fullPlayerOverlay) {
    elements.closeOverlayBtn.addEventListener('click', () => {
      elements.fullPlayerOverlay.classList.remove('open');
    });
  }

  // Song List Row Selection
  elements.songRows.forEach((row, idx) => {
    row.addEventListener('click', () => {
      elements.songRows.forEach(r => r.classList.remove('active-row'));
      row.classList.add('active-row');
      
      const songTitle = row.querySelector('h4')?.textContent || 'Under Pressure (...';
      const songArtist = row.querySelector('p')?.textContent.split('•')[0].trim() || 'Queen';
      
      if (elements.miniTitle) elements.miniTitle.textContent = songTitle;
      if (elements.miniArtist) elements.miniArtist.textContent = songArtist;
      if (elements.overlayTrackTitle) elements.overlayTrackTitle.textContent = songTitle;
      if (elements.overlayArtist) elements.overlayArtist.textContent = songArtist;
      
      state.isPlaying = true;
      state.currentTimeSec = 0;
      updatePlayIconUI();
    });
  });

  // Scrubber Drag & Click
  if (elements.scrubberTrack) {
    elements.scrubberTrack.addEventListener('mousedown', onScrubberStart);
    window.addEventListener('mousemove', onScrubberMove);
    window.addEventListener('mouseup', onScrubberEnd);
  }

  // Playback Progress Timer
  setInterval(() => {
    if (state.isPlaying && !state.isDraggingScrubber) {
      const track = PLAYLIST[state.currentTrackIndex] || { durationSec: 248 };
      state.currentTimeSec++;
      if (state.currentTimeSec >= track.durationSec) {
        state.currentTimeSec = 0;
      }
      updateScrubberUI();
    }
  }, 1000);
}

function togglePlayPause() {
  state.isPlaying = !state.isPlaying;
  updatePlayIconUI();
}

function updatePlayIconUI() {
  const waveDots = document.querySelectorAll('.wave-dot');
  if (state.isPlaying) {
    if (elements.miniPlayIcon) {
      elements.miniPlayIcon.innerHTML = `
        <rect x="5" y="4" width="4" height="16" fill="currentColor" rx="1"/>
        <rect x="15" y="4" width="4" height="16" fill="currentColor" rx="1"/>
      `;
    }
    waveDots.forEach(d => d.style.animationPlayState = 'running');
  } else {
    if (elements.miniPlayIcon) {
      elements.miniPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    }
    waveDots.forEach(d => d.style.animationPlayState = 'paused');
  }
}

function updateTrackUI() {
  const track = PLAYLIST[state.currentTrackIndex];
  if (!track) return;
  if (elements.miniTitle) elements.miniTitle.textContent = track.title;
  if (elements.miniArtist) elements.miniArtist.textContent = track.artist;
  if (elements.overlayTrackTitle) elements.overlayTrackTitle.textContent = track.title;
  if (elements.overlayArtist) elements.overlayArtist.textContent = track.artist;
  if (elements.duration) elements.duration.textContent = formatTime(track.durationSec);
  updateScrubberUI();
}

function updateScrubberUI() {
  const track = PLAYLIST[state.currentTrackIndex] || { durationSec: 248 };
  const percent = Math.min(100, Math.max(0, (state.currentTimeSec / track.durationSec) * 100));
  if (elements.currentTime) elements.currentTime.textContent = formatTime(state.currentTimeSec);
  if (elements.scrubberFill) elements.scrubberFill.style.width = `${percent}%`;
  if (elements.scrubberThumb) elements.scrubberThumb.style.left = `${percent}%`;
}

function onScrubberStart(e) {
  state.isDraggingScrubber = true;
  updateScrubberFromEvent(e);
}

function onScrubberMove(e) {
  if (!state.isDraggingScrubber) return;
  updateScrubberFromEvent(e);
}

function onScrubberEnd() {
  state.isDraggingScrubber = false;
}

function updateScrubberFromEvent(e) {
  if (!elements.scrubberTrack) return;
  const rect = elements.scrubberTrack.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.min(1, Math.max(0, clickX / rect.width));
  const track = PLAYLIST[state.currentTrackIndex] || { durationSec: 248 };
  state.currentTimeSec = Math.floor(ratio * track.durationSec);
  updateScrubberUI();
}

// 7. Signature BeatWave Jelly Droplet Optics & Multi-Axis Fluid Physics
function setupBottomNav() {
  if (!elements.floatingNavBar || !elements.liquidDropletLens) return;

  // Real Multi-Axis Jelly Physics State
  const jelly = {
    x: 0,
    targetX: 0,
    vx: 0,
    scaleX: 1,
    scaleY: 1,
    wobblePhase: 0,
    wobbleAmp: 0,
    isHovered: false,
    dragStartX: 0,
    initialPuckLeft: 0,
    lastMoveTime: performance.now(),
    lastMoveX: 0,
    currentVelocityX: 0
  };

  // Cursor Light Vector for Realtime Chromatic Aberration & Corner Caustics
  const opticsState = {
    cursorX: window.innerWidth * 0.5,
    cursorY: window.innerHeight * 0.5,
    lightAngleDeg: 45
  };

  // Global mouse tracking for dynamic light reflections
  window.addEventListener('mousemove', (e) => {
    opticsState.cursorX = e.clientX;
    opticsState.cursorY = e.clientY;
  }, { passive: true });

  // Setup Optics Canvas (2x Retina 228x172)
  setupDropletOpticsCanvas();

  function setupDropletOpticsCanvas() {
    const canvas = elements.dropletOpticsCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animTime = 0;

    function renderOpticsFrame() {
      animTime += 0.028;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Relative light vector from mouse to lens center
      const lensRect = elements.liquidDropletLens.getBoundingClientRect();
      const lensCenterX = lensRect.left + lensRect.width / 2;
      const lensCenterY = lensRect.top + lensRect.height / 2;
      const relX = Math.max(-1.5, Math.min(1.5, (opticsState.cursorX - lensCenterX) / (window.innerWidth * 0.35)));
      const relY = Math.max(-1.5, Math.min(1.5, (opticsState.cursorY - lensCenterY) / (window.innerHeight * 0.35)));
      const lightAngle = Math.atan2(relY, relX);

      // 1. Moving Liquid Light Caustics inside background of glass ("light moving in bg like jelly")
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const waveCenterX = (w / 2) + Math.sin(animTime * 1.5) * 36 + relX * 28;
      const waveCenterY = (h / 2) + Math.cos(animTime * 1.7) * 20 + relY * 20;
      
      const causticRad = ctx.createRadialGradient(
        waveCenterX, waveCenterY, 6,
        w / 2, h / 2, w * 0.52
      );
      causticRad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      causticRad.addColorStop(0.35, 'rgba(180, 0, 255, 0.28)');
      causticRad.addColorStop(0.70, 'rgba(255, 230, 0, 0.18)');
      causticRad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = causticRad;
      ctx.fillRect(0, 0, w, h);

      // Organic fluid caustic ribbon drifting inside jelly
      ctx.beginPath();
      ctx.moveTo(16, h * 0.32 + Math.sin(animTime * 1.3) * 12);
      ctx.bezierCurveTo(
        w * 0.32, h * 0.15 + Math.cos(animTime * 1.6) * 16,
        w * 0.68, h * 0.78 + Math.sin(animTime * 1.4) * 14,
        w - 16, h * 0.42 + Math.cos(animTime * 1.2) * 12
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 14;
      ctx.filter = 'blur(6px)';
      ctx.stroke();
      ctx.filter = 'none';
      ctx.restore();

      // 2. Continuous Realtime Spectral Chromatic Aberration Arcs (Physical Dispersion)
      // Spectral bands: Red, Orange, Yellow, Green, Cyan, Blue, Violet
      const spectralColors = [
        'rgba(255, 10, 80, 0.88)',
        'rgba(255, 130, 0, 0.88)',
        'rgba(255, 235, 0, 0.92)',
        'rgba(0, 255, 130, 0.92)',
        'rgba(0, 225, 255, 0.95)',
        'rgba(0, 120, 255, 0.88)',
        'rgba(180, 10, 255, 0.88)'
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(1.2px)';

      // Top Curved Rim Spectral Arcs (Incident Refraction)
      const topSpread = 1.9 + Math.abs(relX) * 0.9;
      const topShift = Math.sin(lightAngle) * 5.5;
      spectralColors.forEach((col, idx) => {
        const offset = (idx - 3) * topSpread + topShift;
        ctx.beginPath();
        ctx.ellipse(w / 2, 21 + offset, (w / 2) - 22, 14, 0, Math.PI * 0.95, Math.PI * 0.05, true);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      });

      // Bottom Curved Rim Spectral Arcs (Exit Refraction)
      const bottomSpread = 1.9 + Math.abs(relX) * 0.9;
      const bottomShift = -Math.sin(lightAngle) * 5.5;
      spectralColors.slice().reverse().forEach((col, idx) => {
        const offset = (idx - 3) * bottomSpread + bottomShift;
        ctx.beginPath();
        ctx.ellipse(w / 2, h - 21 + offset, (w / 2) - 22, 14, 0, Math.PI * 0.05, Math.PI * 0.95, false);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      });

      ctx.filter = 'none';
      ctx.restore();

      // 3. Update Corner Specular Caustic Glints based on Light Angle
      updateCornerCaustics(relX, relY, lightAngle);

      // Loop frame
      requestAnimationFrame(renderOpticsFrame);
    }

    requestAnimationFrame(renderOpticsFrame);
  }

  function updateCornerCaustics(relX, relY, lightAngle) {
    if (!elements.caustics) return;
    
    // Exact light incidence on 4 squircle corners
    // TL: ~225 deg (-135), TR: ~315 deg (-45), BR: ~45 deg, BL: ~135 deg
    const cosA = Math.cos(lightAngle);
    const sinA = Math.sin(lightAngle);

    // Intensity proportional to light alignment
    const tlVal = Math.max(0.1, -cosA * 0.7 - sinA * 0.7);
    const trVal = Math.max(0.1,  cosA * 0.7 - sinA * 0.7);
    const blVal = Math.max(0.1, -cosA * 0.7 + sinA * 0.7);
    const brVal = Math.max(0.1,  cosA * 0.7 + sinA * 0.7);

    if (elements.caustics.tl) {
      elements.caustics.tl.style.opacity = tlVal.toFixed(2);
      elements.caustics.tl.style.transform = `scale(${(0.6 + tlVal * 0.75).toFixed(2)})`;
    }
    if (elements.caustics.tr) {
      elements.caustics.tr.style.opacity = trVal.toFixed(2);
      elements.caustics.tr.style.transform = `scale(${(0.6 + trVal * 0.75).toFixed(2)})`;
    }
    if (elements.caustics.bl) {
      elements.caustics.bl.style.opacity = blVal.toFixed(2);
      elements.caustics.bl.style.transform = `scale(${(0.6 + blVal * 0.75).toFixed(2)})`;
    }
    if (elements.caustics.br) {
      elements.caustics.br.style.opacity = brVal.toFixed(2);
      elements.caustics.br.style.transform = `scale(${(0.6 + brVal * 0.75).toFixed(2)})`;
    }

    // Dynamic CSS variables for light caustics
    const shiftX = (relX * 12).toFixed(1);
    document.documentElement.style.setProperty('--light-x', `${(50 + relX * 26).toFixed(1)}%`);
    document.documentElement.style.setProperty('--light-y', `${(40 + relY * 26).toFixed(1)}%`);
  }

  // 60FPS Multi-Axis Jelly Physics Spring Loop
  function startJellyPhysicsLoop() {
    function tick() {
      if (!state.isDraggingPuck) {
        // Spring acceleration towards target position
        const fx = (jelly.targetX - jelly.x) * 0.18;
        jelly.vx = (jelly.vx + fx) * 0.76; // Viscous fluid drag
        jelly.x += jelly.vx;

        const speed = Math.abs(jelly.vx);

        // Fluid Viscous Velocity Stretch (elongates horizontally along motion)
        const travelStretchX = Math.min(0.32, speed * 0.046);
        const travelSquishY = travelStretchX * 0.75; // Volume conservation squish

        // Trigger jelly wobble when decelerating
        if (speed < 0.9 && jelly.wobbleAmp > 0.01) {
          jelly.wobblePhase += 0.35;
          jelly.wobbleAmp *= 0.87; // Damped harmonic decay
        } else if (speed > 2.2) {
          jelly.wobbleAmp = Math.min(0.42, speed * 0.055);
          jelly.wobblePhase = 0;
        }

        // 3D jelly volume-conserving oscillation (X and Y oscillate out of phase)
        const wobbleX = Math.sin(jelly.wobblePhase) * jelly.wobbleAmp;
        const wobbleY = -Math.cos(jelly.wobblePhase) * jelly.wobbleAmp * 0.88;

        // "this bubble comes on hover" — scale pop and bloom on hover
        const hoverScale = jelly.isHovered ? 1.08 : 0.98;
        const finalScaleX = (1 + travelStretchX + wobbleX) * hoverScale;
        const finalScaleY = (1 / (1 + travelSquishY) + wobbleY) * hoverScale;
        const tilt = Math.max(-14, Math.min(14, jelly.vx * 0.58));

        if (elements.liquidDropletLens) {
          elements.liquidDropletLens.style.left = `${jelly.x.toFixed(2)}px`;
          elements.liquidDropletLens.style.transform = `scale(${finalScaleX.toFixed(3)}, ${finalScaleY.toFixed(3)}) rotate(${tilt.toFixed(1)}deg)`;
        }
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  startJellyPhysicsLoop();

  // Move Droplet Puck to Tab Position with Jelly Springs
  function moveDropletLensToTab(index, animate = true) {
    const tabs = elements.navTabs;
    const targetTab = tabs[index];
    if (!targetTab) return;

    // Update active class
    tabs.forEach(t => t.classList.remove('active'));
    targetTab.classList.add('active');
    state.activeTab = index;

    // Switch screen content (Home, Library, Settings)
    switchAppScreen(index);

    // Update magnified sampled icon and label
    const tabData = TAB_DATA[index];
    if (tabData && elements.puckIconSample) {
      elements.puckIconSample.innerHTML = `
        ${tabData.svg}
        <span>${tabData.name}</span>
      `;
    }

    // Calculate center coordinates
    const tabLeft = targetTab.offsetLeft;
    const tabWidth = targetTab.offsetWidth;
    const puckWidth = elements.liquidDropletLens.offsetWidth || 114;
    const targetLeft = tabLeft + (tabWidth / 2) - (puckWidth / 2);

    jelly.targetX = targetLeft;

    if (!animate) {
      jelly.x = targetLeft;
      jelly.vx = 0;
      jelly.wobbleAmp = 0;
    } else {
      // Elastic navbar shell nudge (BeatWave panelOffset)
      const travelDir = Math.sign(targetLeft - jelly.x) || 1;
      elements.floatingNavBar.style.transform = `translateX(${travelDir * 2.5}px)`;
      setTimeout(() => {
        elements.floatingNavBar.style.transform = 'translateX(0px)';
      }, 260);
    }
  }

  // "this bubble comes on hover" — Organic Liquid Bloom on MouseEnter
  elements.floatingNavBar.addEventListener('mouseenter', () => {
    jelly.isHovered = true;
    jelly.wobbleAmp = 0.45; // Organic liquid pop impulse!
    jelly.wobblePhase = 0;
  });

  elements.floatingNavBar.addEventListener('mouseleave', () => {
    if (state.isDraggingPuck) return;
    jelly.isHovered = false;
    if (elements.dropletGlint) {
      elements.dropletGlint.style.transform = 'translateX(0px)';
    }
  });

  // Dynamic light tracking & liquid surface tension on hover
  elements.floatingNavBar.addEventListener('mousemove', (e) => {
    if (state.isDraggingPuck) return;
    const barRect = elements.floatingNavBar.getBoundingClientRect();
    const mouseX = e.clientX - barRect.left;
    const puckWidth = elements.liquidDropletLens.offsetWidth || 114;
    const puckCenter = jelly.x + puckWidth / 2;
    const offsetFromCenter = mouseX - puckCenter;

    // Moving light in background of the bar tracks mouse
    const pct = Math.max(10, Math.min(90, (mouseX / barRect.width) * 100)).toFixed(1);
    document.documentElement.style.setProperty('--bar-light-x', `${pct}%`);

    // Specular glint shift based on mouse angle
    if (elements.dropletGlint) {
      const glintShift = Math.max(-18, Math.min(18, offsetFromCenter * 0.25));
      elements.dropletGlint.style.transform = `translateX(${glintShift}px)`;
    }

    // Magnetic liquid surface tension pull towards cursor
    if (Math.abs(offsetFromCenter) < puckWidth * 0.8) {
      jelly.targetX += offsetFromCenter * 0.085;
    }
  });

  // Tab Click & Hover Events
  elements.navTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      moveDropletLensToTab(index, true);
    });

    tab.addEventListener('mouseenter', () => {
      // Gentle liquid magnetic pull when hovering
      if (!state.isDraggingPuck && state.activeTab !== index) {
        moveDropletLensToTab(index, true);
      }
    });
  });

  // Draggable Liquid Droplet Lens (Direct Touch & Drag Physics)
  elements.liquidDropletLens.addEventListener('mousedown', onPuckDragStart);
  window.addEventListener('mousemove', onPuckDragMove);
  window.addEventListener('mouseup', onPuckDragEnd);

  // Touch Support for Mobile simulation
  elements.liquidDropletLens.addEventListener('touchstart', (e) => {
    onPuckDragStart(e.touches[0]);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (state.isDraggingPuck) onPuckDragMove(e.touches[0]);
  }, { passive: true });
  window.addEventListener('touchend', onPuckDragEnd);

  function onPuckDragStart(e) {
    state.isDraggingPuck = true;
    dragStartX = e.clientX;
    initialPuckLeft = jelly.x;
    lastMoveX = e.clientX;
    lastMoveTime = performance.now();
    elements.liquidDropletLens.style.cursor = 'grabbing';
  }

  function onPuckDragMove(e) {
    if (!state.isDraggingPuck) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime);
    const dx = e.clientX - lastMoveX;
    currentVelocityX = dx / dt;
    lastMoveX = e.clientX;
    lastMoveTime = now;

    const deltaX = e.clientX - dragStartX;
    const barWidth = elements.floatingNavBar.offsetWidth;
    const puckWidth = elements.liquidDropletLens.offsetWidth || 114;
    const minLeft = 4;
    const maxLeft = barWidth - puckWidth - 4;
    const newLeft = Math.max(minLeft, Math.min(maxLeft, initialPuckLeft + deltaX));

    jelly.x = newLeft;
    jelly.targetX = newLeft;

    // Calculate fluid stretch from drag velocity
    const stretch = Math.min(0.45, Math.abs(currentVelocityX) * 0.4);
    const scaleX = 1 + stretch;
    const scaleY = 1 / (1 + stretch * 0.6);
    const tilt = Math.max(-14, Math.min(14, currentVelocityX * 3.5));

    elements.liquidDropletLens.style.left = `${newLeft}px`;
    elements.liquidDropletLens.style.transform = `scale(${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}) rotate(${tilt.toFixed(1)}deg)`;

    // Live sample tab under current position
    const puckCenter = newLeft + puckWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    elements.navTabs.forEach((tab, idx) => {
      const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
      const dist = Math.abs(puckCenter - tabCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== state.activeTab) {
      elements.navTabs.forEach(t => t.classList.remove('active'));
      elements.navTabs[closestIndex].classList.add('active');
      state.activeTab = closestIndex;
      const tabData = TAB_DATA[closestIndex];
      if (tabData && elements.puckIconSample) {
        elements.puckIconSample.innerHTML = `
          ${tabData.svg}
          <span>${tabData.name}</span>
        `;
      }
    }
  }

  function onPuckDragEnd() {
    if (!state.isDraggingPuck) return;
    state.isDraggingPuck = false;
    elements.liquidDropletLens.style.cursor = 'grab';
    // Snap cleanly onto the nearest tab with spring settling
    moveDropletLensToTab(state.activeTab, true);
  }

  // Initialize Library tab (index 1) on load as seen in user's screenshot!
  setTimeout(() => {
    moveDropletLensToTab(1, false);
    updatePlayIconUI();
  }, 120);
}

// 8. 3D Gyro / Cursor Parallax & Liquid Specular Glint
function setupTiltOptics() {
  if (!elements.phoneFrame) return;

  elements.phoneFrame.addEventListener('mousemove', (e) => {
    const rect = elements.phoneFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    elements.phoneFrame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    // Update specular highlight shift on player card
    if (elements.playerGlassSurface) {
      const glintX = (x / rect.width) * 100;
      const glintY = (y / rect.height) * 100;
      elements.playerGlassSurface.style.background = `
        radial-gradient(circle at ${glintX}% ${glintY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
        rgba(22, 25, 34, var(--glass-tint-opacity))
      `;
    }
  });

  elements.phoneFrame.addEventListener('mouseleave', () => {
    elements.phoneFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    if (elements.playerGlassSurface) {
      elements.playerGlassSurface.style.background = '';
    }
  });
}

// 9. Screen Switching & Theme Management
function switchAppScreen(index) {
  if (state.activeScreenMode === 'queen') {
    // In user match mode, keep the Queen song list visible behind the navbar as in the screenshot!
    document.querySelectorAll('.app-screen-view').forEach(s => s.classList.remove('active-screen'));
    if (elements.screenQueen) elements.screenQueen.classList.add('active-screen');
    return;
  }
  if (!elements.screens || !elements.screens.length) return;
  elements.screens.forEach((screen, i) => {
    if (screen) {
      screen.classList.toggle('active-screen', i === index);
    }
  });
}

function setupScreensAndThemes() {
  function applyTheme(theme) {
    if (!elements.phoneFrame) return;
    state.activeScreenMode = theme;

    // Toggle active state on header buttons
    if (elements.btnThemeQueen) elements.btnThemeQueen.classList.toggle('active', theme === 'queen');
    if (elements.btnThemePeach) elements.btnThemePeach.classList.toggle('active', theme === 'peach');
    if (elements.btnThemeDark) elements.btnThemeDark.classList.toggle('active', theme === 'midnight');

    if (theme === 'queen') {
      elements.phoneFrame.classList.remove('theme-peach');
      elements.phoneFrame.classList.add('theme-midnight');
      // Show screenQueen
      document.querySelectorAll('.app-screen-view').forEach(s => s.classList.remove('active-screen'));
      if (elements.screenQueen) elements.screenQueen.classList.add('active-screen');
      // Set track to Queen Under Pressure
      state.currentTrackIndex = 1;
      updateTrackUI();
      // Ensure droplet sits over Library (index 1)
      moveDropletLensToTab(1, false);
    } else if (theme === 'peach') {
      elements.phoneFrame.classList.remove('theme-midnight');
      elements.phoneFrame.classList.add('theme-peach');
      if (elements.pillSelectPeach) elements.pillSelectPeach.classList.add('active');
      if (elements.pillSelectMidnight) elements.pillSelectMidnight.classList.remove('active');
      switchAppScreen(state.activeTab);
    } else {
      elements.phoneFrame.classList.remove('theme-peach');
      elements.phoneFrame.classList.add('theme-midnight');
      if (elements.pillSelectMidnight) elements.pillSelectMidnight.classList.add('active');
      if (elements.pillSelectPeach) elements.pillSelectPeach.classList.remove('active');
      switchAppScreen(state.activeTab);
    }
  }

  if (elements.btnThemeQueen) elements.btnThemeQueen.addEventListener('click', () => applyTheme('queen'));
  if (elements.btnThemePeach) elements.btnThemePeach.addEventListener('click', () => applyTheme('peach'));
  if (elements.btnThemeDark) elements.btnThemeDark.addEventListener('click', () => applyTheme('midnight'));
  if (elements.pillSelectPeach) elements.pillSelectPeach.addEventListener('click', () => applyTheme('peach'));
  if (elements.pillSelectMidnight) elements.pillSelectMidnight.addEventListener('click', () => applyTheme('midnight'));

  // Screen shortcuts
  if (elements.homeSettingsShortcut) {
    elements.homeSettingsShortcut.addEventListener('click', () => {
      const settingsTab = document.getElementById('tabSettings');
      if (settingsTab) settingsTab.click();
    });
  }
  if (elements.btnSettingsBack) {
    elements.btnSettingsBack.addEventListener('click', () => {
      const homeTab = document.getElementById('tabHome');
      if (homeTab) homeTab.click();
    });
  }
  if (elements.settingRowAppearance) {
    elements.settingRowAppearance.addEventListener('click', () => {
      const isPeach = elements.phoneFrame.classList.contains('theme-peach');
      applyTheme(isPeach ? 'midnight' : 'peach');
    });
  }
}

// 10. Real APK Side-by-Side Comparison Modal
function setupCompareModal() {
  if (elements.btnOpenCompare && elements.apkCompareModal) {
    elements.btnOpenCompare.addEventListener('click', () => {
      elements.apkCompareModal.classList.add('open');
    });
  }
  if (elements.btnCloseCompareModal && elements.apkCompareModal) {
    elements.btnCloseCompareModal.addEventListener('click', () => {
      elements.apkCompareModal.classList.remove('open');
    });
  }
  if (elements.compareModalBackdrop && elements.apkCompareModal) {
    elements.compareModalBackdrop.addEventListener('click', () => {
      elements.apkCompareModal.classList.remove('open');
    });
  }

  // Slide navigation
  if (elements.compareTabBtns) {
    elements.compareTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-compare');
        elements.compareTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const slideMap = {
          puck: 'slideComparePuck',
          home: 'slideCompareHome',
          library: 'slideCompareLibrary',
          settings: 'slideCompareSettings'
        };
        const activeSlideId = slideMap[target] || 'slideComparePuck';
        if (elements.compareSlides) {
          elements.compareSlides.forEach(slide => {
            slide.classList.toggle('active', slide.id === activeSlideId);
          });
        }
      });
    });
  }
}

// Execute upon DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

