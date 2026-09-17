/**
 * Fashion + Landscape — Editorial Report: masthead column + ruled content (Spec §5).
 * Do NOT reuse Formal 9-col report-table.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'fashion';
  window.ReportLayouts = window.ReportLayouts || {};

  function masthead(schoolInfo, student, pageNum, totalPages, compact) {
    const p = P();
    const names = p.studentDisplayName(student);
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    if (compact) {
      return `
        <aside class="editorial-masthead editorial-masthead-compact">
          <img src="assets/wilson-crest.svg" alt="" class="crest-icon fashion-crest-sm">
          <div class="ed-report-code">REPORT / 0${pageNum}</div>
          <div class="ed-student-sm">${p.escapeHtml(names.en)}</div>
          <div class="mia-page">Page ${pageNum}</div>
        </aside>`;
    }
    return `
      <aside class="editorial-masthead">
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon fashion-crest">
        <div class="ed-wilson-line">WILSON INTERNATIONAL</div>
        <div class="ed-school-full">${p.escapeHtml(school.en)}</div>
        <div class="ed-school-zh">${p.escapeHtml(school.zh)}</div>
        <div class="ed-title-stack">
          <span class="ed-bracket" aria-hidden="true"></span>
          <div class="ed-title-words">
            <span>MIDTERM</span><span>PROGRESS</span><span>REPORT</span>
          </div>
        </div>
        <div class="ed-outline-num" aria-hidden="true">MID</div>
        <div class="ed-mast-student">
          <strong>${p.escapeHtml(names.primary)}</strong>
          <span>${p.escapeHtml(student.classGrade || '')}</span>
        </div>
        <div class="ed-mast-page">Page ${pageNum} / ${totalPages}</div>
        <div class="ed-term-tiny">${p.escapeHtml(term)}</div>
      </aside>`;
  }

  function academicRuled(subjects, student, schoolInfo) {
    const p = P();
    const mW = schoolInfo?.weights?.midterm ?? 40;
    const dW = schoolInfo?.weights?.daily ?? 60;
    const head = `<div class="ed-ruled-head">
      <span class="ed-col-subj">${p.escapeHtml(p.t('thSubject'))}</span>
      <span class="ed-col-mid">${p.escapeHtml(p.t('thMidtermShort'))} ${mW}%</span>
      <span class="ed-col-daily">${p.escapeHtml(p.t('thDailyShort'))} ${dW}%</span>
      <span class="ed-col-ov">${p.escapeHtml(p.t('thOverall'))}</span>
    </div>`;
    const rows = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      return `<div class="ed-ruled-row">
        <span class="ed-col-subj">${p.escapeHtml(p.subjectLabel(subj))}</span>
        <span class="ed-col-mid">${row.midterm}</span>
        <span class="ed-col-daily">${row.daily}</span>
        <span class="ed-col-ov">${row.overall}</span>
      </div>`;
    }).join('');
    return `<section class="editorial-academic">
      <h2 class="ed-section-title">${p.thLabel('thAcademic', 'thAcademicZh')}<span class="ed-rule-mark" aria-hidden="true"></span></h2>
      ${head}${rows}
    </section>`;
  }

  function habitsMatrix(subjects, student, schoolInfo) {
    const p = P();
    const head = `<div class="ed-habit-head">
      <span class="ed-h-subj">${p.escapeHtml(p.t('thSubject'))}</span>
      <span>P</span><span>T</span><span>A</span><span>B</span>
    </div>`;
    const rows = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const codes = p.CONDUCT_ORDER.map((k) =>
        `<span class="ed-habit-code">${p.escapeHtml(p.getConductCode(row.conduct[k]))}</span>`).join('');
      return `<div class="ed-habit-row">
        <span class="ed-h-subj">${p.escapeHtml(p.subjectLabel(subj))}</span>${codes}
      </div>`;
    }).join('');
    return `<section class="editorial-habits">
      <h2 class="ed-section-title">${p.thLabel('thHabits', 'thHabitsZh')}<span class="ed-rule-mark" aria-hidden="true"></span></h2>
      ${head}${rows}
    </section>`;
  }

  function assessments(subjects, student, schoolInfo) {
    const p = P();
    const blocks = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block ed-assess-block">
        <h3 class="ed-assess-subj">${p.escapeHtml(p.subjectLabel(subj))}</h3>
        <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
      </div>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `<section class="editorial-assessments">
      <h2 class="ed-section-title">${p.thLabel('thAssessment', 'thAssessmentZh')}<span class="ed-rule-mark" aria-hidden="true"></span></h2>
      <div class="ed-assess-cols">${blocks}</div>
    </section>`;
  }

  window.ReportLayouts['fashion:landscape'] = function FashionLandscape(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 650 });
    const total = two ? 2 : 1;
    if (!two) {
      return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'fashion-landscape editorial-grid')}>
        <div class="fashion-grid">
          ${masthead(schoolInfo, student, 1, 1, false)}
          <main class="editorial-content">
            ${academicRuled(enabled, student, schoolInfo)}
            ${habitsMatrix(enabled, student, schoolInfo)}
            ${assessments(enabled, student, schoolInfo)}
            ${p.renderLegend()}
            <div class="editorial-signatures">${p.renderFooter(schoolInfo, student)}</div>
          </main>
        </div>
      </article>`;
    }
    return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'fashion-landscape editorial-grid')}>
      <div class="fashion-grid">
        ${masthead(schoolInfo, student, 1, 2, false)}
        <main class="editorial-content">
          ${academicRuled(enabled, student, schoolInfo)}
          ${habitsMatrix(enabled, student, schoolInfo)}
        </main>
      </div>
    </article>
    <article ${p.sheetAttrs(student, 2, liveTheme(), 'landscape', 'fashion-landscape editorial-grid')}>
      <div class="fashion-grid fashion-grid-p2">
        ${masthead(schoolInfo, student, 2, 2, true)}
        <main class="editorial-content">
          ${assessments(enabled, student, schoolInfo)}
          ${p.renderLegend()}
          <div class="editorial-signatures">${p.renderFooter(schoolInfo, student)}</div>
        </main>
      </div>
    </article>`;
  };
})();
