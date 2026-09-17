/**
 * Classical + Portrait — certificate ledger / academy report book (Spec §10).
 * Double frame, centered crest, split Academic / Habits / Remarks ledgers.
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'classical';
  window.ReportLayouts = window.ReportLayouts || {};

  function crestHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const term = schoolInfo.term || 'Midterm';
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const titleEn = p.escapeHtml(p.reportTitleEn(term));
    return `
      <header class="classical-centered-crest">
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
            <strong class="classical-page-roman">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</strong>
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
      <section class="classical-student-ledger classical-student-ledger-2x2">
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

  function academicLedger(subjects, student, schoolInfo) {
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
      <section class="classical-academic-ledger">
        <h2 class="classical-section-title">${p.thLabel('thAcademic', 'thAcademicZh')}</h2>
        <table class="portrait-table classical-table">
          <colgroup>
            <col style="width:44%"><col style="width:18%"><col style="width:18%"><col style="width:20%">
          </colgroup>
          <thead>
            <tr class="sub-head classical-sub-head">
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

  function habitsLedger(subjects, student, schoolInfo) {
    const p = P();
    const rows = (subjects || []).map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const codes = p.CONDUCT_ORDER.map((key) =>
        `<td class="col-habit classical-habit-code">${p.escapeHtml(p.getConductCode(row.conduct[key]))}</td>`
      ).join('');
      const alt = i % 2 === 1 ? ' row-alt' : '';
      return `
        <tr class="subject-row${alt}">
          <td class="col-subject subject">${p.escapeHtml(p.subjectLabel(subj))}</td>
          ${codes}
        </tr>`;
    }).join('');
    return `
      <section class="classical-habits-ledger">
        <h2 class="classical-section-title">${p.thLabel('thHabits', 'thHabitsZh')}</h2>
        <table class="portrait-table classical-table">
          <colgroup>
            <col style="width:44%">
            <col style="width:14%"><col style="width:14%"><col style="width:14%"><col style="width:14%">
          </colgroup>
          <thead>
            <tr class="sub-head classical-sub-head">
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

  function remarks(subjects, student, schoolInfo) {
    const p = P();
    const blocks = (subjects || []).map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `
        <article class="assessment-block classical-remark-block subject-block">
          <h3 class="classical-remark-subject">${p.escapeHtml(p.subjectLabel(subj))}</h3>
          <div class="classical-remark-rule" aria-hidden="true"></div>
          <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
        </article>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `
      <section class="classical-remarks">
        <h2 class="classical-section-title">${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
        ${blocks}
      </section>`;
  }

  function continuedHeader(schoolInfo, student, pageNum, totalPages) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    return `
      <header class="classical-continued-header classical-continued-portrait">
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon classical-crest-sm">
        <div class="classical-continued-text">
          <div class="school-name school-name-sm">${p.escapeHtml(school.en)}</div>
          <div class="report-title-continued">${p.escapeHtml(p.reportTitleEn(schoolInfo.term || 'Midterm'))} — ${p.escapeHtml(p.t('continued'))}</div>
        </div>
        ${p.renderStudentMetaLine(student, 'continued-student sheet-meta-line')}
      </header>`;
  }

  function needsTwoPages(subjects, student, schoolInfo) {
    const p = P();
    if (subjects.length > 7) return true;
    let commentLen = 0;
    subjects.forEach((subj) => {
      commentLen += (p.gradeRow(subj, student, schoolInfo).comment || '').length;
    });
    return commentLen > 700 || (subjects.length > 5 && commentLen > 350);
  }

  window.ReportLayouts['classical:portrait'] = function ClassicalPortrait(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = needsTwoPages(enabled, student, schoolInfo);
    const totalPages = two ? 2 : 1;
    let html = '';

    if (!two) {
      html += `
        <article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'classical-portrait ornate-frame')}>
          ${p.classicalCorners()}
          <div class="classical-safe">
            ${crestHeader(schoolInfo, student, 1, 1)}
            ${studentLedger(schoolInfo, student)}
            <div class="report-body">
              ${academicLedger(enabled, student, schoolInfo)}
              ${habitsLedger(enabled, student, schoolInfo)}
              ${remarks(enabled, student, schoolInfo)}
              <section class="classical-legend">${p.renderLegend()}</section>
            </div>
            ${p.renderFooter(schoolInfo, student, { classical: true })}
            ${p.renderPageFoot({ page: 1, total: 1 })}
          </div>
        </article>`;
    } else {
      html += `
        <article ${p.sheetAttrs(student, 1, liveTheme(), 'portrait', 'classical-portrait ornate-frame')}>
          ${p.classicalCorners()}
          <div class="classical-safe">
            ${crestHeader(schoolInfo, student, 1, 2)}
            ${studentLedger(schoolInfo, student)}
            <div class="report-body">
              ${academicLedger(enabled, student, schoolInfo)}
              ${habitsLedger(enabled, student, schoolInfo)}
            </div>
            ${p.renderPageFoot({ page: 1, total: 2, continued: true })}
          </div>
        </article>
        <article ${p.sheetAttrs(student, 2, liveTheme(), 'portrait', 'classical-portrait ornate-frame')}>
          ${p.classicalCorners()}
          <div class="classical-safe">
            ${continuedHeader(schoolInfo, student, 2, 2)}
            <div class="report-body">
              ${remarks(enabled, student, schoolInfo)}
              <section class="classical-legend">${p.renderLegend()}</section>
            </div>
            ${p.renderFooter(schoolInfo, student, { classical: true })}
            ${p.renderPageFoot({ page: 2, total: 2 })}
          </div>
        </article>`;
    }
    return html;
  };
})();
