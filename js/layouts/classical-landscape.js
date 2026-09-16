/**
 * Classical + Landscape — European Private Academy / Certificate Ledger (Spec §9).
 * Double frame, centered crest, ledger student block, classical 9-col table.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'classical';
  window.ReportLayouts = window.ReportLayouts || {};

  const MAX_SUBJECTS_PAGE1 = 8;

  function splitSubjects(subjects) {
    const list = subjects || [];
    if (list.length <= MAX_SUBJECTS_PAGE1) return { pages: [list] };
    return {
      pages: [list.slice(0, MAX_SUBJECTS_PAGE1), list.slice(MAX_SUBJECTS_PAGE1, MAX_SUBJECTS_PAGE1 * 2)]
    };
  }

  function crestHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    const roman = totalPages === 1 ? 'I' : (pageNum === 1 ? 'I' : 'II');
    return `
      <header class="classical-crest-header">
        <div class="classical-crest-center">
          <div class="classical-crest-wrap">
            <img src="assets/wilson-crest.svg" alt="" class="crest-icon classical-crest">
          </div>
          <div class="school-name classical-school">${p.escapeHtml(school.en)}</div>
          <div class="school-name-zh classical-school-zh">${p.escapeHtml(school.zh)}</div>
          ${p.classicalDivider()}
          <h1 class="report-title-en classical-title">${titleEn}</h1>
        </div>
        <div class="classical-meta-strip" role="group" aria-label="Report meta">
          <div class="classical-meta-cell">
            <span class="term-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
            <strong>${year || '—'}</strong>
          </div>
          <div class="classical-meta-sep" aria-hidden="true">◆</div>
          <div class="classical-meta-cell">
            <span class="term-label">${p.escapeHtml(p.t('metaTerm'))}</span>
            <strong>${p.escapeHtml(term)}</strong>
          </div>
          <div class="classical-meta-sep" aria-hidden="true">◆</div>
          <div class="classical-meta-cell classical-meta-page">
            <span class="term-label">Page</span>
            <strong class="classical-page-roman">${roman}</strong>
          </div>
        </div>
      </header>`;
  }

  function studentLedger(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const reportDate = p.escapeHtml(schoolInfo.reportDate || student.reportDate || '');
    const flags = p.mergeFlags(schoolInfo, student);
    const chips = [];
    if (flags.internationalStudent) chips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipIntl'))}</span>`);
    if (flags.independentConduct) chips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipConduct'))}</span>`);
    return `
      <section class="classical-student-ledger">
        <div class="ledger-cell">
          <span class="meta-label">${p.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
          <strong class="meta-value">${p.escapeHtml(names.primary)}
            ${names.secondary ? `<span class="meta-secondary">${p.escapeHtml(names.secondary)}</span>` : ''}
            ${chips.length ? `<span class="flag-chips">${chips.join('')}</span>` : ''}
          </strong>
        </div>
        <div class="ledger-cell">
          <span class="meta-label">${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
          <strong class="meta-value">${p.escapeHtml(student.classGrade || '—')}</strong>
        </div>
        <div class="ledger-cell">
          <span class="meta-label">${p.thLabel('metaStudentId', 'metaStudentIdZh')}</span>
          <strong class="meta-value">${p.escapeHtml(student.studentId || '—')}</strong>
        </div>
        <div class="ledger-cell">
          <span class="meta-label">${p.thLabel('metaDate', 'metaDateZh')}</span>
          <strong class="meta-value">${reportDate || '—'}</strong>
        </div>
      </section>`;
  }

  function resultsLedger(subjects, student, schoolInfo) {
    const p = P();
    const mWeight = schoolInfo?.weights?.midterm ?? 40;
    const dWeight = schoolInfo?.weights?.daily ?? 60;
    const rows = (subjects || []).map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const badges = p.CONDUCT_ORDER.map((key) =>
        `<td class="col-habit">${p.getConductBadge(row.conduct[key])}</td>`
      ).join('');
      const alt = i % 2 === 1 ? ' row-alt' : '';
      return `
        <tr class="subject-row${alt}">
          <td class="col-subject subject">${p.escapeHtml(p.subjectLabel(subj))}</td>
          <td class="col-score score">${row.midterm}</td>
          <td class="col-score score">${row.daily}</td>
          <td class="col-score score overall col-overall">${row.overall}</td>
          ${badges}
          <td class="col-assessment assessment"><div class="assessment-content teacher-assessment">${p.escapeHtml(row.comment)}</div></td>
        </tr>`;
    }).join('');
    return `
      <section class="classical-results-ledger">
        <table class="report-table classical-table">
          <colgroup>
            <col class="colw-subject"><col class="colw-score"><col class="colw-score"><col class="colw-overall">
            <col class="colw-habit"><col class="colw-habit"><col class="colw-habit"><col class="colw-habit">
            <col class="colw-assessment">
          </colgroup>
          <thead>
            <tr class="group-head classical-group-head">
              <th rowspan="2" class="th-subject">${p.thLabel('thSubject', 'thSubjectZh')}</th>
              <th colspan="3" class="th-group">${p.thLabel('thAcademic', 'thAcademicZh')}</th>
              <th colspan="4" class="th-group">${p.thLabel('thHabits', 'thHabitsZh')}</th>
              <th rowspan="2" class="th-assessment">${p.thLabel('thAssessment', 'thAssessmentZh')}</th>
            </tr>
            <tr class="sub-head classical-sub-head">
              <th class="th-score"><span class="th-en">${p.escapeHtml(p.t('thMidtermShort'))}</span>
                <span class="th-zh">${p.escapeHtml(p.t('thMidtermPct').replace('{n}', String(mWeight)))}</span></th>
              <th class="th-score"><span class="th-en">${p.escapeHtml(p.t('thDailyShort'))}</span>
                <span class="th-zh">${p.escapeHtml(p.t('thDailyPct').replace('{n}', String(dWeight)))}</span></th>
              <th class="th-score th-overall col-overall">${p.thLabel('thOverall', 'thOverallZh')}</th>
              <th class="th-habit">${p.thLabel('thPerf', 'thPerfZh')}</th>
              <th class="th-habit">${p.thLabel('thTeam', 'thTeamZh')}</th>
              <th class="th-habit">${p.thLabel('thAssign', 'thAssignZh')}</th>
              <th class="th-habit">${p.thLabel('thBehav', 'thBehavZh')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function continuedHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const names = p.studentDisplayName(student);
    const school = p.schoolNames(schoolInfo);
    const grade = p.escapeHtml(student.classGrade || '');
    const roman = pageNum === 1 ? 'I' : 'II';
    return `
      <header class="classical-continued-header">
        <span class="school-name school-name-sm">${p.escapeHtml(school.en)}</span>
        <span class="report-title-continued">${p.escapeHtml(p.reportTitleEn(schoolInfo.term || 'Midterm'))} — ${p.escapeHtml(p.t('continued'))}</span>
        <span class="continued-student">${p.escapeHtml(names.en)}${grade ? ` · ${grade}` : ''} · ${roman}</span>
      </header>`;
  }

  window.ReportLayouts['classical:landscape'] = function ClassicalLandscape(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const { pages } = splitSubjects(enabled);
    const totalPages = pages.length;
    let html = '';
    pages.forEach((pageSubjects, idx) => {
      const pageNum = idx + 1;
      const isLast = pageNum === totalPages;
      html += `
        <article ${p.sheetAttrs(student, pageNum, liveTheme(), 'landscape', 'classical-landscape ornate-frame')}>
          ${p.classicalCorners()}
          <div class="classical-safe">
            ${pageNum === 1
              ? crestHeader(schoolInfo, student, pageNum, totalPages) + studentLedger(schoolInfo, student)
              : continuedHeader(schoolInfo, student, pageNum, totalPages)}
            <div class="report-body">
              ${resultsLedger(pageSubjects, student, schoolInfo)}
              ${isLast ? `<section class="classical-legend">${p.renderLegend()}</section>` : ''}
            </div>
            ${isLast
              ? p.renderFooter(schoolInfo, student, { classical: true })
              : `<div class="page-continue">${p.t('pageContinue')} ${pageNum} ${p.t('of')} ${totalPages}</div>`}
          </div>
        </article>`;
    });
    return html;
  };
})();
