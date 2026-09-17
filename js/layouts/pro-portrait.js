/**
 * Professional + Portrait — Institutional stacked document sections (Spec §8).
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'pro';
  window.ReportLayouts = window.ReportLayouts || {};

  function institutionalHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const term = schoolInfo.term || 'Midterm';
    const title = p.escapeHtml(p.reportTitleEn(term));
    return `
      <header class="institutional-header">
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon pro-crest">
        <div class="inst-brand">
          <div class="school-name">${p.escapeHtml(school.en)}</div>
          <div class="school-name-zh">${p.escapeHtml(school.zh)}</div>
          <h1 class="inst-title">${title}</h1>
        </div>
        <div class="inst-term">
          <strong>${p.escapeHtml(term)}</strong>
          <span>${year || '—'}</span>
          <span class="mia-page">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</span>
        </div>
      </header>`;
  }

  function metaTable(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const date = p.reportDate(schoolInfo, student);
    return `
      <table class="pro-meta-table">
        <tbody>
          <tr>
            <th>${p.thLabel('metaStudentName', 'metaStudentNameZh')}</th>
            <td>${p.escapeHtml(names.primary)}${names.secondary ? ` / ${p.escapeHtml(names.secondary)}` : ''}</td>
            <th>${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</th>
            <td>${p.escapeHtml(student.classGrade || '—')}</td>
          </tr>
          <tr>
            <th>${p.thLabel('metaStudentId', 'metaStudentIdZh')}</th>
            <td>${p.escapeHtml(student.studentId || '—')}</td>
            <th>${p.thLabel('metaDate', 'metaDateZh')}</th>
            <td>${date || '—'}</td>
          </tr>
        </tbody>
      </table>`;
  }

  function resultsGrid(subjects, student, schoolInfo) {
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
      <section class="pro-results-grid">
        <h2 class="pro-sec-title">${p.thLabel('thAcademic', 'thAcademicZh')}</h2>
        <table class="portrait-table pro-table">
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

  function habitsGrid(subjects, student, schoolInfo) {
    const p = P();
    const rows = subjects.map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const codes = p.CONDUCT_ORDER.map((k) =>
        `<td class="col-habit pro-habit-plain">${p.escapeHtml(p.getConductCode(row.conduct[k]))}</td>`).join('');
      return `<tr class="${i % 2 ? 'row-alt' : ''}">
        <td class="subject">${p.escapeHtml(p.subjectLabel(subj))}</td>${codes}</tr>`;
    }).join('');
    return `
      <section class="pro-habits-grid">
        <h2 class="pro-sec-title">${p.thLabel('thHabits', 'thHabitsZh')}</h2>
        <table class="portrait-table pro-table">
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

  function assessmentLog(subjects, student, schoolInfo) {
    const p = P();
    const rows = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block pro-log-row">
        <div class="pro-log-subj">${p.escapeHtml(p.subjectLabel(subj))}</div>
        <div class="pro-log-text teacher-assessment">${p.escapeHtml(row.comment)}</div>
      </div>`;
    }).filter(Boolean).join('');
    if (!rows) return '';
    return `<section class="pro-assessment-log">
      <h2 class="pro-sec-title">${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
      ${rows}
    </section>`;
  }

  function continued(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    return `
      <header class="pro-continued">
        <span class="school-name school-name-sm">${p.escapeHtml(school.en)}</span>
        <span>REPORT — ${p.escapeHtml(p.t('continued'))}</span>
        ${p.renderStudentMetaLine(student, 'continued-student sheet-meta-line')}
      </header>`;
  }

  window.ReportLayouts['pro:portrait'] = function ProPortrait(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 700 });
    const total = two ? 2 : 1;
    if (!two) {
      return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'pro-portrait')}>
        ${institutionalHeader(schoolInfo, student, 1, 1)}
        ${metaTable(schoolInfo, student)}
        ${resultsGrid(enabled, student, schoolInfo)}
        ${habitsGrid(enabled, student, schoolInfo)}
        ${assessmentLog(enabled, student, schoolInfo)}
        ${p.renderLegend()}
        <div class="pro-signatures">${p.renderFooter(schoolInfo, student)}</div>
        ${p.renderPageFoot({ page: 1, total: 1 })}
      </article>`;
    }
    return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'pro-portrait')}>
      ${institutionalHeader(schoolInfo, student, 1, 2)}
      ${metaTable(schoolInfo, student)}
      ${resultsGrid(enabled, student, schoolInfo)}
      ${habitsGrid(enabled, student, schoolInfo)}
      ${p.renderPageFoot({ page: 1, total: 2, continued: true })}
    </article>
    <article ${p.sheetAttrs(student, 2, liveTheme(), 'portrait', 'pro-portrait')}>
      ${continued(schoolInfo, student, 2, 2)}
      ${assessmentLog(enabled, student, schoolInfo)}
      ${p.renderLegend()}
      <div class="pro-signatures">${p.renderFooter(schoolInfo, student)}</div>
      ${p.renderPageFoot({ page: 2, total: 2 })}
    </article>`;
  };
})();
