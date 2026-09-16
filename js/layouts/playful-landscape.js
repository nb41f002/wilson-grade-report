/**
 * Playful + Landscape — Learning Journey: identity rail + modular panels (Spec §3).
 * NOT a 9-column table.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'playful';
  window.ReportLayouts = window.ReportLayouts || {};

  function identityRail(schoolInfo, student, pageNum, totalPages, compact) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const names = p.studentDisplayName(student);
    const term = schoolInfo.term || 'Midterm';
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    if (compact) {
      return `
        <aside class="identity-rail identity-rail-compact">
          <img src="assets/wilson-crest.svg" alt="" class="crest-icon playful-crest-sm">
          <div class="rail-continued">${p.escapeHtml(p.t('continued'))}</div>
          <div class="rail-student-sm">${p.escapeHtml(names.en)}</div>
          <div class="rail-grade-sm">${p.escapeHtml(student.classGrade || '')}</div>
          <div class="mia-page">Page ${pageNum}/${totalPages}</div>
        </aside>`;
    }
    return `
      <aside class="identity-rail">
        <div class="rail-deco-tl" aria-hidden="true"></div>
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon playful-crest">
        <div class="rail-school">${p.escapeHtml(school.en)}</div>
        <div class="rail-school-zh">${p.escapeHtml(school.zh)}</div>
        <div class="rail-title-stack">
          <span>MIDTERM</span>
          <span>LEARNING</span>
          <span>REPORT</span>
        </div>
        <div class="rail-student-block">
          <strong>${p.escapeHtml(names.primary)}</strong>
          <span>${p.escapeHtml(student.classGrade || '—')}</span>
          <span>${p.escapeHtml(student.studentId || '—')}</span>
        </div>
        <div class="rail-term-block">
          <span class="term-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
          <strong>${year || '—'}</strong>
          <span class="term-label">${p.escapeHtml(p.t('metaTerm'))}</span>
          <strong>${p.escapeHtml(term)}</strong>
        </div>
        <div class="rail-deco-bl" aria-hidden="true"></div>
        <div class="mia-page rail-page">Page ${pageNum} / ${totalPages}</div>
      </aside>`;
  }

  function studentStrip(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const date = p.reportDate(schoolInfo, student);
    return `
      <section class="student-strip">
        <div><span class="meta-label">${p.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
          <strong>${p.escapeHtml(names.primary)}</strong></div>
        <div><span class="meta-label">${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
          <strong>${p.escapeHtml(student.classGrade || '—')}</strong></div>
        <div><span class="meta-label">${p.escapeHtml(p.t('metaTerm'))}</span>
          <strong>${p.escapeHtml(schoolInfo.term || 'Midterm')}</strong></div>
        <div><span class="meta-label">${p.thLabel('metaDate', 'metaDateZh')}</span>
          <strong>${date || '—'}</strong></div>
      </section>`;
  }

  function academicPanel(subjects, student, schoolInfo) {
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
      <section class="academic-panel">
        <h2 class="panel-title">${p.thLabel('thAcademic', 'thAcademicZh')}
          <span class="playful-wave" aria-hidden="true"></span></h2>
        <table class="portrait-table playful-table">
          <colgroup><col style="width:46%"><col style="width:17%"><col style="width:17%"><col style="width:20%"></colgroup>
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

  function habitsPanel(subjects, student, schoolInfo) {
    const p = P();
    const rows = subjects.map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const badges = p.CONDUCT_ORDER.map((k) =>
        `<td class="col-habit">${p.getConductBadge(row.conduct[k])}</td>`).join('');
      return `<tr class="${i % 2 ? 'row-alt' : ''}">
        <td class="subject">${p.escapeHtml(p.subjectLabel(subj))}</td>${badges}</tr>`;
    }).join('');
    return `
      <section class="habits-panel">
        <h2 class="panel-title">${p.thLabel('thHabits', 'thHabitsZh')}
          <span class="playful-wave" aria-hidden="true"></span></h2>
        <table class="portrait-table playful-table">
          <colgroup><col style="width:46%"><col style="width:13.5%"><col style="width:13.5%"><col style="width:13.5%"><col style="width:13.5%"></colgroup>
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

  function assessmentGrid(subjects, student, schoolInfo) {
    const p = P();
    const blocks = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block playful-assess-card">
        <h3 class="assessment-subject"><span class="accent-bar" aria-hidden="true"></span>${p.escapeHtml(p.subjectLabel(subj))}</h3>
        <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
      </div>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `
      <section class="assessment-grid">
        <h2 class="panel-title">${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
        <div class="assessment-grid-cols">${blocks}</div>
      </section>`;
  }

  window.ReportLayouts['playful:landscape'] = function PlayfulLandscape(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 700 });
    const total = two ? 2 : 1;
    let html = '';
    if (!two) {
      html += `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'playful-landscape')}>
        <div class="playful-grid">
          ${identityRail(schoolInfo, student, 1, 1, false)}
          <main class="learning-main">
            ${studentStrip(schoolInfo, student)}
            ${academicPanel(enabled, student, schoolInfo)}
            ${habitsPanel(enabled, student, schoolInfo)}
            ${assessmentGrid(enabled, student, schoolInfo)}
            ${p.renderLegend()}
            ${p.renderFooter(schoolInfo, student)}
          </main>
        </div>
      </article>`;
    } else {
      html += `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'playful-landscape')}>
        <div class="playful-grid">
          ${identityRail(schoolInfo, student, 1, 2, false)}
          <main class="learning-main">
            ${studentStrip(schoolInfo, student)}
            ${academicPanel(enabled, student, schoolInfo)}
            ${habitsPanel(enabled, student, schoolInfo)}
          </main>
        </div>
      </article>
      <article ${p.sheetAttrs(student, 2, liveTheme(), 'landscape', 'playful-landscape')}>
        <div class="playful-grid playful-grid-p2">
          ${identityRail(schoolInfo, student, 2, 2, true)}
          <main class="learning-main">
            ${assessmentGrid(enabled, student, schoolInfo)}
            ${p.renderLegend()}
            ${p.renderFooter(schoolInfo, student)}
          </main>
        </div>
      </article>`;
    }
    return html;
  };
})();
