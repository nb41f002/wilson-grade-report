/**
 * Report renderer router — dispatches to layout modules by theme:orientation.
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

  renderStudentReport(student, schoolInfo, subjects) {
    const key = this.layoutKey();
    const fn = this.resolveLayoutFn(key);
    return fn(student, schoolInfo, subjects);
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
