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

  /** Tag top-level report sheets only (ignore nested assessment <article>s). */
  tagBodySheets(html) {
    return String(html || '').replace(/<article\b([^>]*)>/g, (match, attrs) => {
      const next = attrs || '';
      // Only mark real report sheets (have report-sheet class from sheetAttrs)
      if (!/\breport-sheet\b/.test(next)) return match;
      let out = next;
      if (!/data-sheet-kind=/.test(out)) out += ' data-sheet-kind="body"';
      if (!/\bbody-sheet\b/.test(out)) {
        if (/\bclass="/.test(out)) out = out.replace(/\bclass="/, 'class="body-sheet ');
        else out += ' class="body-sheet"';
      }
      return `<article${out}>`;
    });
  },

  /** Count top-level report-sheet articles only (not nested assessment blocks). */
  countBodySheets(html) {
    const matches = String(html || '').match(/<article\b[^>]*\breport-sheet\b[^>]*>/gi);
    return matches ? matches.length : 0;
  },

  /**
   * Remap body .sheet-page-foot markers into packet page numbers.
   * Cover is unnumbered; explanation = 1; body starts at 2 (offset = 1).
   */
  remapBodyPacketFeet(html, offset, packetTotal) {
    const p = window.ReportPrimitives;
    if (!p) return html;
    return String(html || '').replace(
      /<div class="sheet-page-foot"([^>]*)>[^<]*<\/div>/g,
      (match, attrs) => {
        const pageM = /data-foot-page="(\d+)"/.exec(attrs || '');
        if (!pageM) return match;
        const local = Number(pageM[1]);
        const continued = /data-foot-continued="true"/.test(attrs || '');
        const kindM = /data-foot-kind="([^"]*)"/.exec(attrs || '');
        const kind = kindM ? kindM[1] : '';
        const packetPage = local + offset;
        const text = p.formatPageFoot({
          page: packetPage,
          total: packetTotal,
          continued,
          kind: kind || undefined
        });
        return `<div class="sheet-page-foot" data-foot-page="${packetPage}" data-foot-total="${packetTotal}" data-foot-continued="${continued ? 'true' : 'false'}" data-foot-kind="${p.escapeHtml(kind)}">${p.escapeHtml(text)}</div>`;
      }
    );
  },

  renderStudentReport(student, schoolInfo, subjects) {
    const key = this.layoutKey();
    const fn = this.resolveLayoutFn(key);
    let body = this.tagBodySheets(fn(student, schoolInfo, subjects));
    const bodyCount = Math.max(1, this.countBodySheets(body));
    // Cover unnumbered; content pages = explanation + body
    const packetTotal = 1 + bodyCount;
    const cover = (window.CoverLayout && window.CoverLayout.render)
      ? window.CoverLayout.render(student, schoolInfo, {})
      : '';
    const explanation = (window.ExplanationLayout && window.ExplanationLayout.render)
      ? window.ExplanationLayout.render(student, schoolInfo, { page: 1, total: packetTotal })
      : '';
    body = this.remapBodyPacketFeet(body, 1, packetTotal);
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
