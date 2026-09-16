/**
 * Formal + Portrait — MIA stacked Academic / Habits / Assessment (Spec §2).
 * Never jam 9 columns into portrait.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'formal';
  const liveOrient = () => (window.Orientation && window.Orientation.orientation) || 'landscape';
  window.ReportLayouts = window.ReportLayouts || {};

  function renderHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    const titleZh = p.escapeHtml(p.t('reportTitleZh'));
    return `
      <header class="formal-header formal-portrait-header">
        <div class="fp-brand-row">
          <div class="fp-brand-left">
            <img src="assets/wilson-crest.svg" alt="" class="crest-icon fp-crest">
            <div class="fp-brand-text">
              <div class="school-name">${p.escapeHtml(school.en)}</div>
              <div class="school-name-zh">${p.escapeHtml(school.zh)}</div>
              <h1 class="report-title-en fp-title">${titleEn}</h1>
              <div class="report-title-zh">${titleZh}</div>
            </div>
          </div>
          <div class="fp-term-block">
            <div class="term-block">
              <span class="term-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
              <strong class="term-value">${year || '—'}</strong>
            </div>
            <div class="term-block">
              <span class="term-label">${p.escapeHtml(p.t('metaTerm'))}</span>
              <strong class="term-value">${p.escapeHtml(term)}</strong>
            </div>
            <div class="mia-page">Page ${pageNum} / ${totalPages}</div>
          </div>
        </div>
      </header>
    `;
  }

  function renderStudentMeta(schoolInfo, student) {
    const p = P();
    const names = p.studentDisplayName(student);
    const flags = p.mergeFlags(schoolInfo, student);
    const reportDate = p.escapeHtml(schoolInfo.reportDate || student.reportDate || '');
    const flagChips = [];
    if (flags.internationalStudent) flagChips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipIntl'))}</span>`);
    if (flags.independentConduct) flagChips.push(`<span class="flag-chip">${p.escapeHtml(p.t('flagChipConduct'))}</span>`);
    return `
      <section class="student-meta-grid student-meta">
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
    `;
  }

  function renderAcademicTable(subjects, student, schoolInfo) {
    const p = P();
    const mWeight = schoolInfo?.weights?.midterm ?? 40;
    const dWeight = schoolInfo?.weights?.daily ?? 60;
    const rows = (subjects || []).map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const alt = i % 2 === 1 ? ' row-alt' : '';
      return `
        <tr class="subject-row${alt}">
          <td class="col-subject subject">${p.escapeHtml(p.subjectLabel(subj))}</td>
          <td class="col-score score">${row.midterm}</td>
          <td class="col-score score">${row.daily}</td>
          <td class="col-score score overall col-overall">${row.overall}</td>
        </tr>`;
    }).join('');
    return `
      <section class="academic-section">
        <h2 class="section-label">${p.thLabel('thAcademic', 'thAcademicZh')}</h2>
        <table class="academic-table portrait-table">
          <colgroup>
            <col style="width:42%"><col style="width:18%"><col style="width:18%"><col style="width:22%">
          </colgroup>
          <thead>
            <tr class="sub-head">
              <th>${p.thLabel('thSubject', 'thSubjectZh')}</th>
              <th><span class="th-en">${p.escapeHtml(p.t('thMidtermShort'))}</span>
                <span class="th-zh">${p.escapeHtml(p.t('thMidtermPct').replace('{n}', String(mWeight)))}</span></th>
              <th><span class="th-en">${p.escapeHtml(p.t('thDailyShort'))}</span>
                <span class="th-zh">${p.escapeHtml(p.t('thDailyPct').replace('{n}', String(dWeight)))}</span></th>
              <th class="th-overall col-overall">${p.thLabel('thOverall', 'thOverallZh')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function renderHabitsTable(subjects, student, schoolInfo) {
    const p = P();
    const rows = (subjects || []).map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const badges = p.CONDUCT_ORDER.map((key) =>
        `<td class="col-habit">${p.getConductBadge(row.conduct[key])}</td>`
      ).join('');
      const alt = i % 2 === 1 ? ' row-alt' : '';
      return `
        <tr class="subject-row${alt}">
          <td class="col-subject subject">${p.escapeHtml(p.subjectLabel(subj))}</td>
          ${badges}
        </tr>`;
    }).join('');
    return `
      <section class="habits-section">
        <h2 class="section-label">${p.thLabel('thHabits', 'thHabitsZh')}</h2>
        <table class="habits-table portrait-table">
          <colgroup>
            <col style="width:42%">
            <col style="width:14.5%"><col style="width:14.5%"><col style="width:14.5%"><col style="width:14.5%">
          </colgroup>
          <thead>
            <tr class="sub-head">
              <th>${p.thLabel('thSubject', 'thSubjectZh')}</th>
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

  function renderAssessmentList(subjects, student, schoolInfo) {
    const p = P();
    const blocks = (subjects || []).map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `
        <article class="assessment-block subject-block">
          <h3 class="assessment-subject">${p.escapeHtml(p.subjectLabel(subj))}</h3>
          <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
        </article>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `
      <section class="assessment-list">
        <h2 class="section-label">${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
        ${blocks}
      </section>`;
  }

  function renderContinuedHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const names = p.studentDisplayName(student);
    const school = p.schoolNames(schoolInfo);
    const grade = p.escapeHtml(student.classGrade || '');
    return `
      <header class="report-header-continued formal-portrait-continued">
        <div class="fp-continued">
          <div class="fp-continued-left">
            <div class="school-name school-name-sm">${p.escapeHtml(school.en)}</div>
            <div class="report-title-continued">${p.escapeHtml(p.reportTitleEn(schoolInfo.term || 'Midterm'))} — ${p.escapeHtml(p.t('continued'))}</div>
          </div>
          <div class="fp-continued-right">
            <span>${p.escapeHtml(names.en)}${grade ? ` · ${grade}` : ''}</span>
            <span class="mia-page">Page ${pageNum}/${totalPages}</span>
          </div>
        </div>
      </header>`;
  }

  /**
   * Heuristic: many subjects + comments → page 2 for assessments.
   * Prefer keeping Academic+Habits intact on page 1.
   */
  function needsTwoPages(subjects, student, schoolInfo) {
    const p = P();
    if (subjects.length > 7) return true;
    let commentLen = 0;
    subjects.forEach((subj) => {
      commentLen += (p.gradeRow(subj, student, schoolInfo).comment || '').length;
    });
    return commentLen > 900 || (subjects.length > 5 && commentLen > 400);
  }

  window.ReportLayouts['formal:portrait'] = function FormalPortrait(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = needsTwoPages(enabled, student, schoolInfo);
    const totalPages = two ? 2 : 1;
    let html = '';

    if (!two) {
      html += `
        <article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'formal-portrait')}>
          ${renderHeader(schoolInfo, student, 1, 1)}
          ${renderStudentMeta(schoolInfo, student)}
          <div class="report-body formal-portrait-body">
            ${renderAcademicTable(enabled, student, schoolInfo)}
            ${renderHabitsTable(enabled, student, schoolInfo)}
            ${renderAssessmentList(enabled, student, schoolInfo)}
            ${p.renderLegend()}
          </div>
          ${p.renderFooter(schoolInfo, student)}
        </article>`;
    } else {
      html += `
        <article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'formal-portrait')}>
          ${renderHeader(schoolInfo, student, 1, 2)}
          ${renderStudentMeta(schoolInfo, student)}
          <div class="report-body formal-portrait-body">
            ${renderAcademicTable(enabled, student, schoolInfo)}
            ${renderHabitsTable(enabled, student, schoolInfo)}
          </div>
          <div class="page-continue">${p.t('pageContinue')} 1 ${p.t('of')} 2</div>
        </article>
        <article ${p.sheetAttrs(student, 2, liveTheme(), 'portrait', 'formal-portrait')}>
          ${renderContinuedHeader(schoolInfo, student, 2, 2)}
          <div class="report-body formal-portrait-body">
            ${renderAssessmentList(enabled, student, schoolInfo)}
            ${p.renderLegend()}
          </div>
          ${p.renderFooter(schoolInfo, student)}
        </article>`;
    }
    return html;
  };
})();
