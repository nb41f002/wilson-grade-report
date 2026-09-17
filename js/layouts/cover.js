/**
 * Theme-styled cover page — one sheet per student before explanation + body.
 * Shared structure; header/chrome differs by data-theme CSS.
 */
(function () {
  const P = () => window.ReportPrimitives;

  function liveTheme() {
    return (window.Theme && window.Theme.theme) || 'formal';
  }

  function liveOrientation() {
    return (window.Orientation && window.Orientation.orientation) || 'landscape';
  }

  function renderCover(student, schoolInfo) {
    const p = P();
    const theme = liveTheme();
    const orientation = liveOrientation();
    const school = p.schoolNames(schoolInfo);
    const names = p.studentDisplayName(student);
    const term = schoolInfo.term || 'Midterm';
    const year = schoolInfo.academicYear || '';
    const classical = theme === 'classical';
    const extra = classical
      ? `cover-sheet cover-${theme} ornate-frame`
      : `cover-sheet cover-${theme}`;
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    const titleZh = p.escapeHtml(p.t('coverTitleZh'));
    const corners = classical ? p.classicalCorners() : '';
    const headerBar = theme === 'formal'
      ? '<div class="cover-header-bar" aria-hidden="true"></div>'
      : '';

    const meta = `
      <div class="cover-meta-grid">
        <div>
          <span class="meta-label">${p.escapeHtml(p.t('metaGradeClass'))}</span>
          <span class="meta-value">${p.escapeHtml(student.classGrade || '—')}</span>
        </div>
        <div>
          <span class="meta-label">${p.escapeHtml(p.t('metaStudentId'))}</span>
          <span class="meta-value">${p.escapeHtml(student.studentId || '—')}</span>
        </div>
        <div>
          <span class="meta-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
          <span class="meta-value">${p.escapeHtml(year || '—')}</span>
        </div>
        <div>
          <span class="meta-label">${p.escapeHtml(p.t('metaTerm'))}</span>
          <span class="meta-value">${p.escapeHtml(term)}</span>
        </div>
      </div>`;

    const inner = `
      <div class="cover-inner">
        ${headerBar}
        <div class="cover-brand">
          <img src="assets/wilson-crest.svg" alt="" class="cover-crest">
          <div class="cover-school-en">${p.escapeHtml(school.en)}</div>
          <div class="cover-school-zh">${p.escapeHtml(school.zh)}</div>
        </div>
        <div class="cover-rule" aria-hidden="true"></div>
        <div>
          <h1 class="cover-doc-title-en">${titleEn}</h1>
          <div class="cover-doc-title-zh">${titleZh}</div>
        </div>
        <div class="cover-student-block">
          <div class="cover-student-name-en">${p.escapeHtml(names.primary)}</div>
          ${names.secondary ? `<div class="cover-student-name-zh">${p.escapeHtml(names.secondary)}</div>` : ''}
          ${meta}
        </div>
        <p class="cover-footer-note">${p.escapeHtml(p.t('coverFooterNote'))}</p>
      </div>`;

    return `
      <article ${p.sheetAttrs(student, 'cover', theme, orientation, extra)} data-sheet-kind="cover">
        ${corners}
        ${classical ? `<div class="classical-safe">${inner}</div>` : inner}
      </article>`;
  }

  window.CoverLayout = { render: renderCover };
})();
