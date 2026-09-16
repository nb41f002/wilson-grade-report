/**
 * Printable report theme + orientation — persists
 * wilson_grade_theme_v2 / wilson_grade_orientation_v2
 */
const THEME_KEY = 'wilson_grade_theme_v2';
const ORIENTATION_KEY = 'wilson_grade_orientation_v2';
const THEMES = ['formal', 'playful', 'fashion', 'pro', 'classical'];
const ORIENTATIONS = ['landscape', 'portrait'];

window.Theme = {
  theme: 'formal',
  onChange: null,

  isValid(id) {
    return THEMES.includes(id);
  },

  load() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (this.isValid(saved)) this.theme = saved;
    } catch (e) { /* ignore */ }
    return this.theme;
  },

  save() {
    try { localStorage.setItem(THEME_KEY, this.theme); } catch (e) { /* ignore */ }
  },

  apply(theme) {
    const id = this.isValid(theme) ? theme : 'formal';
    this.theme = id;
    document.documentElement.setAttribute('data-theme', id);
    this.syncUI();
  },

  setTheme(theme) {
    if (!this.isValid(theme)) return;
    this.theme = theme;
    this.save();
    this.apply(theme);
    if (typeof this.onChange === 'function') this.onChange(this.theme);
  },

  syncUI() {
    const sel = document.getElementById('theme-select');
    if (sel && sel.value !== this.theme) sel.value = this.theme;
    document.querySelectorAll('.theme-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === this.theme);
    });
  },

  init() {
    this.load();
    this.apply(this.theme);
    const sel = document.getElementById('theme-select');
    if (sel) {
      sel.addEventListener('change', () => this.setTheme(sel.value));
    }
    document.querySelectorAll('.theme-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
    });
  }
};

window.Orientation = {
  orientation: 'landscape',
  onChange: null,

  isValid(id) {
    return ORIENTATIONS.includes(id);
  },

  load() {
    try {
      const saved = localStorage.getItem(ORIENTATION_KEY);
      if (this.isValid(saved)) this.orientation = saved;
    } catch (e) { /* ignore */ }
    return this.orientation;
  },

  save() {
    try { localStorage.setItem(ORIENTATION_KEY, this.orientation); } catch (e) { /* ignore */ }
  },

  apply(orientation) {
    const id = this.isValid(orientation) ? orientation : 'landscape';
    this.orientation = id;
    document.documentElement.setAttribute('data-orientation', id);
    /* Swap A4 CSS vars for preview sizing */
    if (id === 'portrait') {
      document.documentElement.style.setProperty('--a4-w', '210mm');
      document.documentElement.style.setProperty('--a4-h', '297mm');
    } else {
      document.documentElement.style.setProperty('--a4-w', '297mm');
      document.documentElement.style.setProperty('--a4-h', '210mm');
    }
    this.syncUI();
  },

  setOrientation(orientation) {
    if (!this.isValid(orientation)) return;
    this.orientation = orientation;
    this.save();
    this.apply(orientation);
    if (typeof this.onChange === 'function') this.onChange(this.orientation);
  },

  syncUI() {
    document.querySelectorAll('.orient-btn').forEach((btn) => {
      const on = btn.dataset.orientation === this.orientation;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const preview = document.querySelector('.preview-stage, .report-viewport, .preview-scroll');
    document.querySelectorAll('[data-preview-orient]').forEach((el) => {
      el.setAttribute('data-orientation', this.orientation);
    });
    if (preview) {
      /* no-op: html[data-orientation] drives CSS */
    }
  },

  init() {
    this.load();
    this.apply(this.orientation);
    document.querySelectorAll('.orient-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setOrientation(btn.dataset.orientation));
    });
  }
};

/* Apply as early as possible once this script runs */
window.Theme.load();
document.documentElement.setAttribute('data-theme', window.Theme.theme);
window.Orientation.load();
document.documentElement.setAttribute('data-orientation', window.Orientation.orientation);
if (window.Orientation.orientation === 'portrait') {
  document.documentElement.style.setProperty('--a4-w', '210mm');
  document.documentElement.style.setProperty('--a4-h', '297mm');
}
