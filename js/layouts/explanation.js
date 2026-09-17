/**
 * Grade explanation / 成績說明 — standardized bilingual legend page.
 * Shared content; theme chrome via data-theme CSS.
 */
(function () {
  const P = () => window.ReportPrimitives;

  function liveTheme() {
    return (window.Theme && window.Theme.theme) || 'formal';
  }

  function liveOrientation() {
    return (window.Orientation && window.Orientation.orientation) || 'landscape';
  }

  function renderExplanation(student, schoolInfo, packet = {}) {
    const p = P();
    const theme = liveTheme();
    const orientation = liveOrientation();
    const packetPage = packet.page || 2;
    const packetTotal = packet.total || 2;
    const school = p.schoolNames(schoolInfo);
    const mW = schoolInfo?.weights?.midterm ?? 40;
    const dW = schoolInfo?.weights?.daily ?? 60;
    const classical = theme === 'classical';
    const extra = classical
      ? `explanation-sheet explanation-${theme} ornate-frame`
      : `explanation-sheet explanation-${theme}`;
    const corners = classical ? p.classicalCorners() : '';

    const scale = [
      ['EE', 'ee', 'legendEEEn', 'legendEEZh'],
      ['ME', 'me', 'legendMEEn', 'legendMEZh'],
      ['AE', 'ae', 'legendAEEn', 'legendAEZh'],
      ['BE', 'be', 'legendBEEn', 'legendBEZh']
    ].map(([code, cls, enK, zhK]) => `
      <div class="explanation-scale-item">
        <span class="code ${cls}">${code}</span>
        <span>
          <strong>${p.escapeHtml(p.t(enK))}</strong>
          <br><span lang="zh-Hant">${p.escapeHtml(p.t(zhK))}</span>
        </span>
      </div>`).join('');

    const inner = `
      <div class="explanation-inner">
        <header class="explanation-header">
          <div class="cover-school-en" style="font-size:11pt">${p.escapeHtml(school.en)}</div>
          <div class="cover-school-zh" style="font-size:8.5pt">${p.escapeHtml(school.zh)}</div>
          <h1 class="explanation-title-en">${p.escapeHtml(p.t('explanationTitleEn'))}</h1>
          <div class="explanation-title-zh">${p.escapeHtml(p.t('explanationTitleZh'))}</div>
        </header>

        <section class="explanation-section">
          <h3>${p.escapeHtml(p.t('explanationScaleEn'))}
            <small>${p.escapeHtml(p.t('explanationScaleZh'))}</small>
          </h3>
          <div class="explanation-scale-grid">${scale}</div>
        </section>

        <section class="explanation-section">
          <h3>${p.escapeHtml(p.t('explanationWeightsEn'))}
            <small>${p.escapeHtml(p.t('explanationWeightsZh'))}</small>
          </h3>
          <div class="explanation-weights">
            <div><strong>${mW}%</strong> · ${p.escapeHtml(p.t('weightMid'))} / Midterm</div>
            <div><strong>${dW}%</strong> · ${p.escapeHtml(p.t('weightDaily'))} / Daily</div>
          </div>
          <p style="margin:2mm 0 0;font-size:8.5pt;line-height:1.4">${p.escapeHtml(p.t('explanationOverallNote'))}</p>
        </section>

        <section class="explanation-section">
          <h3>${p.escapeHtml(p.t('explanationHowEn'))}
            <small>${p.escapeHtml(p.t('explanationHowZh'))}</small>
          </h3>
          <ul class="explanation-list">
            <li>${p.escapeHtml(p.t('explanationHow1'))}</li>
            <li>${p.escapeHtml(p.t('explanationHow2'))}</li>
            <li>${p.escapeHtml(p.t('explanationHow3'))}</li>
            <li>${p.escapeHtml(p.t('explanationHow4'))}</li>
          </ul>
        </section>

        <div class="explanation-student-chip sheet-meta-line">${p.escapeHtml(p.formatStudentMetaLine(student))}</div>
        ${p.renderPageFoot({ page: packetPage, total: packetTotal, kind: 'guide' })}
      </div>`;

    return `
      <article ${p.sheetAttrs(student, 'explanation', theme, orientation, extra)} data-sheet-kind="explanation">
        ${corners}
        ${classical ? `<div class="classical-safe">${inner}</div>` : inner}
      </article>`;
  }

  window.ExplanationLayout = { render: renderExplanation };
})();
