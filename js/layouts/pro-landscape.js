/**
 * Professional + Landscape — Institutional profile rail + report body (Spec §7).
 */
(function () {
  const P = () => window.ReportPrimitives;
  const liveTheme = () => (window.Theme && window.Theme.theme) || 'pro';
  window.ReportLayouts = window.ReportLayouts || {};

  function profileRail(schoolInfo, student, pageNum, totalPages, compact) {
    const p = P();
    const school = p.schoolNames(schoolInfo);
    const names = p.studentDisplayName(student);
    const year = p.escapeHtml(schoolInfo.academicYear || '');
    const term = schoolInfo.term || 'Midterm';
    if (compact) {
      return `
        <aside class="pro-profile-rail pro-profile-compact">
          <img src="assets/wilson-crest.svg" alt="" class="crest-icon pro-crest">
          <div class="pro-doc-code">${p.escapeHtml(p.t('continued'))}</div>
          <div class="pro-rail-name sheet-meta-line">${p.escapeHtml(p.formatStudentMetaLine(student))}</div>
          <div class="pro-rail-page">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</div>
        </aside>`;
    }
    return `
      <aside class="pro-profile-rail">
        <img src="assets/wilson-crest.svg" alt="" class="crest-icon pro-crest">
        <div class="pro-rail-school">${p.escapeHtml(school.en)}</div>
        <div class="pro-rail-school-zh">${p.escapeHtml(school.zh)}</div>
        <div class="pro-doc-code">MIDTERM REPORT</div>
        <div class="pro-rail-meta">
          <strong>${p.escapeHtml(names.primary)}</strong>
          <span>${p.escapeHtml(student.classGrade || '—')}</span>
          <span>${p.escapeHtml(student.studentId || '—')}</span>
        </div>
        <div class="pro-rail-term">
          <span class="term-label">${p.escapeHtml(p.t('metaAcademicYear'))}</span>
          <strong>${year || '—'}</strong>
          <span class="term-label">${p.escapeHtml(p.t('metaTerm'))}</span>
          <strong>${p.escapeHtml(term)}</strong>
        </div>
        <div class="pro-rail-page">${p.escapeHtml(p.formatPageFoot({ page: pageNum, total: totalPages }))}</div>
      </aside>`;
  }

  function bodyHeader(schoolInfo) {
    const p = P();
    return `
      <header class="pro-body-header">
        <h1>ACADEMIC PROGRESS REPORT</h1>
        <div class="pro-body-sub">${p.escapeHtml(p.t('reportTitleZh'))}</div>
        <div class="pro-thin-rule" aria-hidden="true"></div>
      </header>`;
  }

  function academic(subjects, student, schoolInfo) {
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
      <section class="pro-academic">
        <h2 class="pro-sec-title"><span class="pro-mark" aria-hidden="true"></span>${p.thLabel('thAcademic', 'thAcademicZh')}</h2>
        <table class="portrait-table pro-table">
          <colgroup><col style="width:46%"><col style="width:18%"><col style="width:18%"><col style="width:18%"></colgroup>
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

  function habits(subjects, student, schoolInfo) {
    const p = P();
    const rows = subjects.map((subj, i) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      const codes = p.CONDUCT_ORDER.map((k) =>
        `<td class="col-habit pro-habit-plain">${p.escapeHtml(p.getConductCode(row.conduct[k]))}</td>`).join('');
      return `<tr class="${i % 2 ? 'row-alt' : ''}">
        <td class="subject">${p.escapeHtml(p.subjectLabel(subj))}</td>${codes}</tr>`;
    }).join('');
    return `
      <section class="pro-habits">
        <h2 class="pro-sec-title"><span class="pro-mark" aria-hidden="true"></span>${p.thLabel('thHabits', 'thHabitsZh')}</h2>
        <table class="portrait-table pro-table">
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

  function assessments(subjects, student, schoolInfo) {
    const p = P();
    const blocks = subjects.map((subj) => {
      const row = p.gradeRow(subj, student, schoolInfo);
      if (!row.comment) return '';
      return `<div class="assessment-block subject-block pro-assess-block">
        <h3 class="pro-assess-subj">${p.escapeHtml(p.subjectLabel(subj))}</h3>
        <p class="assessment-text teacher-assessment">${p.escapeHtml(row.comment)}</p>
      </div>`;
    }).filter(Boolean).join('');
    if (!blocks) return '';
    return `<section class="pro-assessments">
      <h2 class="pro-sec-title"><span class="pro-mark" aria-hidden="true"></span>${p.thLabel('thAssessment', 'thAssessmentZh')}</h2>
      <div class="pro-assess-cols">${blocks}</div>
    </section>`;
  }

  window.ReportLayouts['pro:landscape'] = function ProLandscape(student, schoolInfo, subjects) {
    const p = P();
    const enabled = p.enabledSubjects(subjects);
    const two = p.needsTwoPagesByComments(enabled, student, schoolInfo, { subjLimit: 7, lenLimit: 700 });
    const total = two ? 2 : 1;
    if (!two) {
      return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'pro-landscape')}>
        <div class="pro-grid">
          ${profileRail(schoolInfo, student, 1, 1, false)}
          <main class="pro-report-body">
            ${bodyHeader(schoolInfo)}
            ${academic(enabled, student, schoolInfo)}
            ${habits(enabled, student, schoolInfo)}
            ${assessments(enabled, student, schoolInfo)}
            ${p.renderLegend()}
            <div class="pro-signatures">${p.renderFooter(schoolInfo, student)}</div>
            ${p.renderPageFoot({ page: 1, total: 1 })}
          </main>
        </div>
      </article>`;
    }
    return `<article ${p.sheetAttrs(student, 1, liveTheme(), 'landscape', 'pro-landscape')}>
      <div class="pro-grid">
        ${profileRail(schoolInfo, student, 1, 2, false)}
        <main class="pro-report-body">
          ${bodyHeader(schoolInfo)}
          ${academic(enabled, student, schoolInfo)}
          ${habits(enabled, student, schoolInfo)}
          ${p.renderPageFoot({ page: 1, total: 2, continued: true })}
        </main>
      </div>
    </article>
    <article ${p.sheetAttrs(student, 2, liveTheme(), 'landscape', 'pro-landscape')}>
      <div class="pro-grid">
        ${profileRail(schoolInfo, student, 2, 2, true)}
        <main class="pro-report-body">
          <header class="pro-continued-body">REPORT — ${p.escapeHtml(p.t('continued'))}</header>
          ${assessments(enabled, student, schoolInfo)}
          ${p.renderLegend()}
          <div class="pro-signatures">${p.renderFooter(schoolInfo, student)}</div>
          ${p.renderPageFoot({ page: 2, total: 2 })}
        </main>
      </div>
    </article>`;
  };
})();
