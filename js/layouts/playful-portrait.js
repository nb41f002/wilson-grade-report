/**
 * Playful + Portrait — Primary School Learning Portfolio (Spec §4).
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'playful';
  window.ReportLayouts = window.ReportLayouts || {};

  function hero(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const term = schoolInfo.term || 'Midterm';
    return `
      <header class="playful-hero">
        <div class="playful-hero-top">
          <div class="playful-crest-badge">
            <img src="assets/wilson-crest.svg" alt="" class="crest-icon playful-crest">
          </div>
          <div class="playful-hero-brand">
            <div class="school-name">${p.escapeHtml(school.en)}</div>
            <div class="school-name-zh">${p.escapeHtml(school.zh)}</div>
          </div>
          <div class="playful-hero-term rail-term-card">
            <strong>${p.escapeHtml(term)}</strong>
            <span>${year || '—'}</span>
            <span class="mia-page">Page ${pageNum}/${totalPages}</span>
          </div>
        </div>
        <div class="playful-hero-title">
          <span>MIDTERM</span>
          <span>LEARNING REPORT</span>
        </div>
        <div class="playful-hero-deco" aria-hidden="true"></div>
      </header>`;
  }

  function studentCard(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const date = p.reportDate(schoolInfo, student);
    return `
      <section class="student-card">
        <div class="sc-cell"><span class="meta-label">${p.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
          <strong>${p.escapeHtml(names.primary)}</strong>
          ${names.secondary ? `<span class="meta-secondary">${p.escapeHtml(names.secondary)}</span>` : ''}</div>
        <div class="sc-cell"><span class="meta-label">${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
          <strong>${p.escapeHtml(student.classGrade || '—')}</strong></div>
        <div class="sc-cell"><span class="meta-label">${p.thLabel('metaStudentId', 'metaStudentIdZh')}</span>
          <strong>${p.escapeHtml(student.studentId || '—')}</strong></div>
        <div class="sc-cell"><span class="meta-label">${p.thLabel('metaDate', 'metaDateZh')}</span>
          <strong>${date || '—'}</strong></div>
      </section>`;
  }

  function scoreTable(subjects, student, schoolInfo) {
    const p = P();
    const mW = schoolInfo?.weights?.midterm ?? 40;
    const dW = schoolInfo?.weights?.daily ?? 60;
    const rows = subjects.map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      return `<tr class="${i % 2 ? 'row-alt' : ''}">
        <td class="subject">${p.escapeHtml(p.subjectLabel(subj))}</td>
        <td class="score">${row.midterm}</td><td class="score">${row.daily}</td>
        <td class="score overall col-overall">${row.overall}</td></tr>`;
    }).join('');
    return `
      <section class="score-table">
        <h2 class="panel-title"><span class="panel-title-text">${p.thLabel('thAcademic', 'thAcademicZh')}</span><span class="playful-accent-rule" aria-hidden="true"></span></h2>
        <table class="portrait-table playful-table">
          <colgroup><col style="width:44%"><col style="width:18%"><col style="width:18%"><col style="width:20%"></colgroup>
          <thead><tr class="sub-head">
            <th>${p.thLabel('thSubject', 'thSubjectZh')}</th>
            <th><span class="th-en">${p.escapeHtml(p.t('thMidtermShort'))}</span>
              <span class="th-zh">${p.escapeHtml(p.t('thMidtermPct').replace('{n}', String(mW)))}</span></th>
            <th><span class="th-en">${p.escapeHtml(p.t('thDailyShort'))}</span>
              <span class="th-zh">${p.escapeHtml(p.t('thDailyPct').replace('{n}', String(dW)))}</span></th>
            <th class="col-overall">${p.thLabel('thOverall', 'thOverallZh')}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function habitGrid(subjects, student, schoolInfo) {
    const p = P();
    const rows = subjects.map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const badges = p.CONDUCT_ORDER.map((k) =>
        `<td class="col-habit">${p.getConductBadge(row.conduct[k])}</td>`).join('');
      return `<tr class="${i % 2 ? 'row-alt' : ''}">
        <td class="subject">${p.escapeHtml(p.subjectLabel(subj))}</td>${badges}</tr>`;
    }).join('');
    return `
      <section class="habit-grid">
        <h2 class="panel-title"><span class="panel-title-text">${p.thLabel('thHabits', 'thHabitsZh')}</span><span class="playful-accent-rule" aria-hidden="true"></span></h2>
        <table class="portrait-table playful-table">
          <colgroup><col style="width:44%"><col style="width:14%"><col style="width:14%"><col style="width:14%"><col style="width:14%"></colgroup>
          <thead><tr class="sub-head">
            <th>${p.thLabel('thSubject', 'thSubjectZh')}</th>
            <th>${p.thLabel('thPerf', 'thPerfZh')}</th>
            <th>${p.thLabel('thTeam', 'thTeamZh')}</th>
            <th>${p.thLabel('thAssign', 'thAssignZh')}</th>
            <th>${p.thLabel('thBehav', 'thBehavZh')}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function assessmentStack(subjects, student, schoolInfo) {
    const p = P();
    const blocks = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block assessment-stack-item playful-assess-card">
        <h3 class="assessment-subject"><span class="accent-bar" aria-hidden="true"></span>${p.escapeHtml(p.subjectLabel(subj))}</h3>
        <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
      </div>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `<section class="assessment-stack">
      <h2 class="panel-title"><span class="panel-title-text">${p.thLabel('thAssessment', 'thAssessmentZh')}</span><span class="playful-accent-rule" aria-hidden="true"></span></h2>${blocks}</section>`;
  }

  function continued(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const names = p.studentDisplayName(student);
    const school = p.schoolNames(schoolInfo);
    return `
      <header class="playful-continued">
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon playful-crest-sm">
        <div class="school-name school-name-sm">${p.escapeHtml(school.en)}</div>
        <div class="report-title-continued">LEARNING REPORT — ${p.escapeHtml(p.t('continued'))}</div>
        <span>${p.escapeHtml(names.en)} / Page ${pageNum} of ${totalPages}</span>
      </header>`;
  }

  window.ReportLayouts['playful:portrait'] = function PlayfulPortrait(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 700 });
    const total = two ? 2 : 1;
    if (!two) {
      return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'playful-portrait')}>
        ${hero(schoolInfo, student, 1, 1)}
        ${studentCard(schoolInfo, student)}
        ${scoreTable(enabled, student, schoolInfo)}
        ${habitGrid(enabled, student, schoolInfo)}
        ${assessmentStack(enabled, student, schoolInfo)}
        ${p.renderLegend()}
        ${p.renderFooter(schoolInfo, student)}
      </article>`;
    }
    return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'playful-portrait')}>
      ${hero(schoolInfo, student, 1, 2)}
      ${studentCard(schoolInfo, student)}
      ${scoreTable(enabled, student, schoolInfo)}
      ${habitGrid(enabled, student, schoolInfo)}
    </article>
    <article ${p.sheetAttrs(student, 2, liveTheme(), 'portrait', 'playful-portrait')}>
      ${continued(schoolInfo, student, 2, 2)}
      ${assessmentStack(enabled, student, schoolInfo)}
      ${p.renderLegend()}
      ${p.renderFooter(schoolInfo, student)}
    </article>`;
  };
})();
