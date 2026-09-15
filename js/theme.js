/**
 * Printable report theme switcher — persists wilson_grade_theme_v2
 */
const THEME_KEY = 'wilson_grade_theme_v2';
const THEMES = ['formal', 'playful', 'fashion', 'pro', 'classical'];

window.Theme = {
  theme: 'formal',

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

/* Apply as early as possible once this script runs (before paint of body UI) */
window.Theme.load();
document.documentElement.setAttribute('data-theme', window.Theme.theme);
