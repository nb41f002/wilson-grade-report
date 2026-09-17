/**
 * Fashion + Portrait — Asymmetric magazine: vertical band + editorial column (Spec §6).
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'fashion';
  window.ReportLayouts = window.ReportLayouts || {};

  function brandBand() {
    return `
      <aside class="vertical-brand-band" aria-hidden="true">
        <div class="vband-line"></div>
        <div class="vband-text"><span>WILSON</span><span>REPORT</span><span>2026</span></div>
      </aside>`;
  }

  function masthead(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const term = schoolInfo.term || 'Midterm';
    return `
      <header class="fashion-masthead">
        <div class="fm-top">
          <img src="assets/wilson-crest.svg" alt="" class="crest-icon fashion-crest">
          <div class="fm-brand">
            <div class="school-name">${p.escapeHtml(school.en)}</div>
            <div class="school-name-zh">${p.escapeHtml(school.zh)}</div>
          </div>
          <div class="fm-term">
            <strong>${p.escapeHtml(term)}</strong>
            <span>${year || '—'}</span>
            <span class="mia-page">${pageNum}/${totalPages}</span>
          </div>
        </div>
        <h1 class="fm-title"><span>MIDTERM</span><span>PROGRESS REPORT</span></h1>
        <span class="fm-corner-notch" aria-hidden="true"></span>
      </header>`;
  }

  function meta(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const date = p.reportDate(schoolInfo, student);
    return `
      <section class="fashion-meta">
        <div class="fm-meta-cell"><span class="meta-label">${p.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
          <strong>${p.escapeHtml(names.primary)}</strong></div>
        <div class="fm-meta-cell"><span class="meta-label">${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
          <strong>${p.escapeHtml(student.classGrade || '—')}</strong></div>
        <div class="fm-meta-cell"><span class="meta-label">${p.thLabel('metaStudentId', 'metaStudentIdZh')}</span>
          <strong>${p.escapeHtml(student.studentId || '—')}</strong></div>
        <div class="fm-meta-cell"><span class="meta-label">${p.thLabel('metaDate', 'metaDateZh')}</span>
          <strong>${date || '—'}</strong></div>
      </section>`;
  }

  function scoreList(subjects, student, schoolInfo) {
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
    return `<section class="fashion-score-list">
      <h2 class="ed-section-title"><span class="ed-dot" aria-hidden="true"></span>${p.thLabel('thAcademic', 'thAcademicZh')}</h2>
      ${head}${rows}
    </section>`;
  }

  function habitMatrix(subjects, student, schoolInfo) {
    const p = P();
    const head = `<div class="ed-habit-head">
      <span class="ed-h-subj">${p.escapeHtml(p.t('thSubject'))}</span>
      <span>P</span><span>T</span><span>A</span><span>B</span>
    </div>`;
    const rows = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const codes = p.CONDUCT_ORDER.map((k) =>
        `<span class="ed-habit-code">${p.escapeHtml(p.getConductCode(row.conduct[k]))}</span>`).join('');
      return `<div class="ed-habit-row"><span class="ed-h-subj">${p.escapeHtml(p.subjectLabel(subj))}</span>${codes}</div>`;
    }).join('');
    return `<section class="fashion-habit-matrix">
      <h2 class="ed-section-title"><span class="ed-dot" aria-hidden="true"></span>${p.thLabel('thHabits', 'thHabitsZh')}</h2>
      ${head}${rows}
    </section>`;
  }

  function assessmentList(subjects, student, schoolInfo) {
    const p = P();
    const blocks = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block ed-assess-block">
        <h3 class="ed-assess-subj ed-assess-serif">${p.escapeHtml(p.subjectLabel(subj))}</h3>
        <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
      </div>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `<section class="fashion-assessment-list">
      <h2 class="ed-section-title"><span class="ed-dot" aria-hidden="true"></span>${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
      ${blocks}
    </section>`;
  }

  function continued(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const names = p.studentDisplayName(student);
    return `
      <header class="fashion-continued">
        <span>MIDTERM PROGRESS REPORT / ${p.escapeHtml(p.t('continued'))}</span>
        <span>${p.escapeHtml(names.en)} / ${p.escapeHtml(student.classGrade || '')} / ${pageNum} of ${totalPages}</span>
      </header>`;
  }

  window.ReportLayouts['fashion:portrait'] = function FashionPortrait(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 700 });
    const total = two ? 2 : 1;
    if (!two) {
      return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'fashion-portrait')}>
        <div class="fashion-portrait-grid">
          ${brandBand()}
          <main class="fashion-page-main">
            ${masthead(schoolInfo, student, 1, 1)}
            ${meta(schoolInfo, student)}
            ${scoreList(enabled, student, schoolInfo)}
            ${habitMatrix(enabled, student, schoolInfo)}
            ${assessmentList(enabled, student, schoolInfo)}
            ${p.renderLegend()}
            <div class="fashion-footer">${p.renderFooter(schoolInfo, student)}</div>
          </main>
        </div>
      </article>`;
    }
    return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'fashion-portrait')}>
      <div class="fashion-portrait-grid">
        ${brandBand()}
        <main class="fashion-page-main">
          ${masthead(schoolInfo, student, 1, 2)}
          ${meta(schoolInfo, student)}
          ${scoreList(enabled, student, schoolInfo)}
          ${habitMatrix(enabled, student, schoolInfo)}
        </main>
      </div>
    </article>
    <article ${p.sheetAttrs(student, 2, liveTheme(), 'portrait', 'fashion-portrait')}>
      <div class="fashion-portrait-grid">
        ${brandBand()}
        <main class="fashion-page-main">
          ${continued(schoolInfo, student, 2, 2)}
          ${assessmentList(enabled, student, schoolInfo)}
          ${p.renderLegend()}
          <div class="fashion-footer">${p.renderFooter(schoolInfo, student)}</div>
        </main>
      </div>
    </article>`;
  };
})();
