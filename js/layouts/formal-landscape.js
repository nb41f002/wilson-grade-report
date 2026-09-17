/**
 * Formal + Landscape — Modern International Academy (MIA).
 * Spec §1: keep current composition unchanged.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'formal';
  const liveOrient = () => (window.Orientation && window.Orientation.orientation) || 'landscape';
  window.ReportLayouts = window.ReportLayouts || {};

  const MAX_SUBJECTS_PAGE1 = 8;

  function splitSubjects(subjects) {
    const list = subjects || [];
    if (list.length <= MAX_SUBJECTS_PAGE1) {
      return { pages: [list], twoPages: false };
    }
    return {
      pages: [list.slice(0, MAX_SUBJECTS_PAGE1), list.slice(MAX_SUBJECTS_PAGE1, MAX_SUBJECTS_PAGE1 * 2)],
      twoPages: true
    };
  }

  function renderHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const names = p.studentDisplayName(student);
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    const titleZh = p.escapeHtml(p.t('reportTitleZh'));
    const flags = p.mergeFlags(schoolInfo, student);
    const reportDate = p.escapeHtml(schoolInfo.reportDate || student.reportDate || '');

    const flagChips = [];
    if (flags.internationalStudent) flagChips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipIntl'))}</span>`);
    if (flags.independentConduct) flagChips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipConduct'))}</span>`);

    return `
      <header class="report-header formal-header">
        <div class="mia-top">
          <div class="mia-brand">
            <div class="header-crest-wrap">
              <img src="assets/wilson-crest.svg" alt="Wilson Crest" class="crest-icon">
            </div>
            <div class="mia-brand-text">
              <div class="school-name">${p.escapeHtml(school.en)}</div>
              <div class="school-name-zh">${p.escapeHtml(school.zh)}</div>
            </div>
          </div>
          <div class="mia-heading">
            <h1 class="report-title-en">${titleEn}</h1>
            <div class="report-title-zh">${titleZh}</div>
          </div>
          <div class="mia-term-info">
            <div class="term-block">
              <span class="term-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
              <strong class="term-value">${year || '—'}</strong>
            </div>
            <div class="term-block">
              <span class="term-label">${p.escapeHtml(p.t('metaTerm'))}</span>
              <strong class="term-value">${p.escapeHtml(term)}</strong>
            </div>
            <div class="mia-page">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</div>
          </div>
        </div>
        <section class="student-meta">
          <div class="meta-item">
            <span class="meta-label">${p.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
            <strong class="meta-value">
              ${p.escapeHtml(names.primary)}
              ${names.secondary ? `<span class="meta-secondary">${p.escapeHtml(names.secondary)}</span>` : ''}
              ${flagChips.length ? `<span class="flag-chips">${flagChips.join('')}</span>` : ''}
            </strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${p.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
            <strong class="meta-value">${p.escapeHtml(student.classGrade || '—')}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${p.thLabel('metaStudentId', 'metaStudentIdZh')}</span>
            <strong class="meta-value">${p.escapeHtml(student.studentId || '—')}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${p.thLabel('metaDate', 'metaDateZh')}</span>
            <strong class="meta-value">${reportDate || '—'}</strong>
          </div>
        </section>
      </header>
    `;
  }

  function renderContinuedHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    return `
      <header class="report-header report-header-continued">
        <div class="mia-continued">
          <div class="mia-continued-left">
            <div class="school-name school-name-sm">${p.escapeHtml(school.en)}</div>
            <div class="report-title-en report-title-continued">${titleEn} — ${p.escapeHtml(p.t('continued'))}</div>
          </div>
          <div class="mia-continued-right">
            ${p.renderStudentMetaLine(student, 'continued-student sheet-meta-line')}
            <span class="mia-page">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</span>
          </div>
        </div>
      </header>
    `;
  }

  function renderTable(subjects, student, schoolInfo) {
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
          <td class="col-score score col-midterm">${row.midterm}</td>
          <td class="col-score score col-daily">${row.daily}</td>
          <td class="col-score score col-overall overall">${row.overall}</td>
          ${badges}
          <td class="col-assessment assessment"><div class="assessment-content teacher-assessment">${p.escapeHtml(row.comment)}</div></td>
        </tr>
      `;
    }).join('');

    return `
      <table class="report-table">
        <colgroup>
          <col class="colw-subject">
          <col class="colw-score">
          <col class="colw-score">
          <col class="colw-overall">
          <col class="colw-habit">
          <col class="colw-habit">
          <col class="colw-habit">
          <col class="colw-habit">
          <col class="colw-assessment">
        </colgroup>
        <thead>
          <tr class="group-head">
            <th rowspan="2" class="th-subject">${p.thLabel('thSubject', 'thSubjectZh')}</th>
            <th colspan="3" class="th-group">${p.thLabel('thAcademic', 'thAcademicZh')}</th>
            <th colspan="4" class="th-group">${p.thLabel('thHabits', 'thHabitsZh')}</th>
            <th rowspan="2" class="th-assessment">${p.thLabel('thAssessment', 'thAssessmentZh')}</th>
          </tr>
          <tr class="sub-head">
            <th class="th-score">
              <span class="th-en">${p.escapeHtml(p.t('thMidtermShort'))}</span>
              <span class="th-zh">${p.escapeHtml(p.t('thMidtermPct').replace('{n}', String(mWeight)))}</span>
            </th>
            <th class="th-score">
              <span class="th-en">${p.escapeHtml(p.t('thDailyShort'))}</span>
              <span class="th-zh">${p.escapeHtml(p.t('thDailyPct').replace('{n}', String(dWeight)))}</span>
            </th>
            <th class="th-score th-overall col-overall">${p.thLabel('thOverall', 'thOverallZh')}</th>
            <th class="th-habit">${p.thLabel('thPerf', 'thPerfZh')}</th>
            <th class="th-habit">${p.thLabel('thTeam', 'thTeamZh')}</th>
            <th class="th-habit">${p.thLabel('thAssign', 'thAssignZh')}</th>
            <th class="th-habit">${p.thLabel('thBehav', 'thBehavZh')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  window.ReportLayouts['formal:landscape'] = function FormalLandscape(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const { pages } = splitSubjects(enabled);
    const totalPages = pages.length;
    let html = '';
    pages.forEach((pageSubjects, idx) => {
      const pageNum = idx + 1;
      const isLast = pageNum === totalPages;
      const fullHeader = pageNum === 1;
      html += `
        <article ${p.sheetAttrs(student, pageNum, liveTheme(), 'landscape', 'formal-landscape')}>
          ${fullHeader
            ? renderHeader(schoolInfo, student, pageNum, totalPages)
            : renderContinuedHeader(schoolInfo, student, pageNum, totalPages)}
          <div class="report-body">
            ${renderTable(pageSubjects, student, schoolInfo)}
            ${isLast ? p.renderLegend() : ''}
          </div>
          ${isLast ? p.renderFooter(schoolInfo, student) : ''}
          ${p.renderPageFoot({ page: pageNum, total: totalPages, continued: !isLast })}
        </article>
      `;
    });
    return html;
  };
})();
