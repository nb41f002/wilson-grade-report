/**
 * Report renderer router — dispatches to layout modules by theme:orientation.
 * Assembles cover + explanation + body for every student print/preview.
 * All 10 Spec layouts register on window.ReportLayouts.
 */
window.ReportRenderer = {
  getTheme() {
    return (window.Theme && window.Theme.theme) || 'formal';
  },

  getOrientation() {
    return (window.Orientation && window.Orientation.orientation) || 'landscape';
  },

  layoutKey() {
    return `${this.getTheme()}:${this.getOrientation()}`;
  },

  resolveLayoutFn(key) {
    const layouts = window.ReportLayouts || {};
    if (layouts[key]) return layouts[key];
    console.warn('[ReportRenderer] Missing layout:', key);
    return layouts['formal:landscape'] || (() => '<!-- missing layout -->');
  },

  /** Tag body articles so overflow checks ignore cover/explanation. */
  tagBodySheets(html) {
    return String(html || '').replace(/<article\b([^>]*)>/g, (match, attrs) => {
      let next = attrs || '';
      if (!/data-sheet-kind=/.test(next)) next += ' data-sheet-kind="body"';
      if (!/\bbody-sheet\b/.test(next)) {
        if (/\bclass="/.test(next)) next = next.replace(/\bclass="/, 'class="body-sheet ');
        else next += ' class="body-sheet"';
      }
      return `<article${next}>`;
    });
  },

  renderStudentReport(student, schoolInfo, subjects) {
    const key = this.layoutKey();
    const fn = this.resolveLayoutFn(key);
    const body = this.tagBodySheets(fn(student, schoolInfo, subjects));
    const cover = (window.CoverLayout && window.CoverLayout.render)
      ? window.CoverLayout.render(student, schoolInfo)
      : '';
    const explanation = (window.ExplanationLayout && window.ExplanationLayout.render)
      ? window.ExplanationLayout.render(student, schoolInfo)
      : '';
    return cover + explanation + body;
  },

  escapeHtml(str) {
    return window.ReportPrimitives
      ? window.ReportPrimitives.escapeHtml(str)
      : String(str ?? '');
  },

  getConductBadge(level) {
    return window.ReportPrimitives
      ? window.ReportPrimitives.getConductBadge(level)
      : '';
  }
};
