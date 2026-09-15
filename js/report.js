/**
 * A4 橫式成績單渲染器（對齊實體照片結構）
 */
window.ReportRenderer = {
  CONDUCT_ORDER: ['performance', 'teamwork', 'assignment', 'behavior'],
  CONDUCT_LABELS: {
    performance: 'Performance',
    teamwork: 'Teamwork',
    assignment: 'Assignment',
    behavior: 'Behavior'
  },

  getConductEmoji(level) {
    const map = {
      excellent: { icon: '😀', title: 'Excellent' },
      good: { icon: '🙂', title: 'Good' },
      satisfactory: { icon: '😐', title: 'Satisfactory' },
      'needs-improvement': { icon: '😟', title: 'Needs Improvement' },
      warning: { icon: '😟', title: 'Needs Improvement' }
    };
    const item = map[level];
    if (!item) return '<span class="smiley smiley-empty">·</span>';
    return `<span class="smiley smiley-${level}" title="${item.title}">${item.icon}</span>`;
  },

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /** 科目超過此數拆成兩頁（最多 2 頁） */
  MAX_SUBJECTS_PAGE1: 5,

  splitSubjects(subjects) {
    const list = subjects || [];
    if (list.length <= this.MAX_SUBJECTS_PAGE1) {
      return { pages: [list], twoPages: false };
    }
    const mid = Math.ceil(list.length / 2);
    return {
      pages: [list.slice(0, mid), list.slice(mid)],
      twoPages: true
    };
  },

  mergeFlags(schoolInfo, student) {
    const sf = schoolInfo?.flags || {};
    const uf = student?.flags || {};
    return {
      internationalStudent: !!(uf.internationalStudent || sf.internationalStudent),
      independentConduct: !!(uf.independentConduct || sf.independentConduct),
      ixlNote: !!(uf.ixlNote || sf.ixlNote),
      mapPrintNote: !!(uf.mapPrintNote || sf.mapPrintNote)
    };
  },

  renderStudentReport(student, schoolInfo, subjects) {
    const enabled = (subjects || []).filter((s) => s.enabled !== false);
    const { pages, twoPages } = this.splitSubjects(enabled);
    const totalPages = pages.length;
    let html = '';

    pages.forEach((pageSubjects, idx) => {
      const pageNum = idx + 1;
      const isLast = pageNum === totalPages;
      html += `
        <article class="report-sheet a4-landscape" data-student-id="${this.escapeHtml(student.id)}" data-page="${pageNum}">
          ${this.renderHeader(schoolInfo, student, pageNum, totalPages)}
          <div class="report-body">
            ${this.renderTable(pageSubjects, student, schoolInfo)}
          </div>
          ${isLast ? this.renderFooter(schoolInfo, student) : `<div class="page-continue">Continued on next page · Page ${pageNum} of ${totalPages}</div>`}
        </article>
      `;
    });

    return html;
  },

  renderHeader(schoolInfo, student, pageNum, totalPages) {
    const nameZh = this.escapeHtml(student.chineseName || '');
    const nameEn = this.escapeHtml(student.englishName || '');
    const displayName = `${nameZh}${nameZh && nameEn ? ' ' : ''}${nameEn}`.trim() || '—';
    const term = this.escapeHtml(schoolInfo.term || 'Midterm');
    const year = this.escapeHtml(schoolInfo.academicYear || '');
    const school = this.escapeHtml(schoolInfo.name || 'Wilson International Elementary School');
    const flags = this.mergeFlags(schoolInfo, student);

    const flagChips = [];
    if (flags.internationalStudent) flagChips.push('<span class="flag-chip">國際生</span>');
    if (flags.independentConduct) flagChips.push('<span class="flag-chip">操行 Independent</span>');

    return `
      <header class="report-header">
        <div class="header-crest-wrap">
          <img src="assets/wilson-crest.svg" alt="Wilson Crest" class="crest-icon">
        </div>
        <h1 class="school-name">${school}</h1>
        <p class="academic-year">${year}</p>
        <p class="term-title">${term}</p>
        <div class="student-name-line">
          <span class="student-name-val">${displayName}</span>
          ${flagChips.length ? `<span class="flag-chips">${flagChips.join('')}</span>` : ''}
        </div>
        <div class="header-meta-slim">
          ${student.classGrade ? `<span>${this.escapeHtml(student.classGrade)}</span>` : ''}
          ${student.studentId ? `<span>ID: ${this.escapeHtml(student.studentId)}</span>` : ''}
          ${totalPages > 1 ? `<span>Page ${pageNum} / ${totalPages}</span>` : ''}
        </div>
      </header>
    `;
  },

  renderTable(subjects, student, schoolInfo) {
    const mWeight = schoolInfo?.weights?.midterm ?? 40;
    const dWeight = schoolInfo?.weights?.daily ?? 60;
    const rows = (subjects || []).map((subj, i) => {
      const g = student.grades?.[subj.id] || {};
      const midterm = g.midterm !== undefined && g.midterm !== null && g.midterm !== '' ? g.midterm : '';
      const daily = g.daily !== undefined && g.daily !== null && g.daily !== '' ? g.daily : '';
      let overall = '';
      if (g.isManualOverall && g.overall !== undefined && g.overall !== '') {
        overall = g.overall;
      } else if (midterm !== '' && daily !== '') {
        overall = Math.round(Number(midterm) * (mWeight / 100) + Number(daily) * (dWeight / 100));
      } else if (g.overall !== undefined && g.overall !== '') {
        overall = g.overall;
      }
      const conduct = g.conduct || {};
      const smileys = this.CONDUCT_ORDER.map((key) =>
        `<td class="col-conduct">${this.getConductEmoji(conduct[key])}</td>`
      ).join('');
      const comment = this.escapeHtml(g.comment || '');
      const alt = i % 2 === 1 ? ' row-alt' : '';

      return `
        <tr class="subject-row${alt}">
          <td class="col-subject">${this.escapeHtml(subj.name)}</td>
          <td class="col-score col-midterm">${midterm}</td>
          <td class="col-score col-daily">${daily}</td>
          <td class="col-score col-overall">${overall}</td>
          ${smileys}
          <td class="col-assessment"><div class="assessment-content">${comment}</div></td>
        </tr>
      `;
    }).join('');

    return `
      <table class="report-table">
        <thead>
          <tr>
            <th rowspan="2" class="th-subject">Subject</th>
            <th class="th-score">Midterm Exam<br><span class="th-weight">${mWeight}%</span></th>
            <th class="th-score">Daily Perf.<br><span class="th-weight">${dWeight}%</span></th>
            <th rowspan="2" class="th-score th-overall">Overall<br>Grade</th>
            <th colspan="4" class="th-conduct">Conduct</th>
            <th rowspan="2" class="th-assessment">Teacher Assessment</th>
          </tr>
          <tr class="th-sub-row">
            <th class="th-sub">Exam</th>
            <th class="th-sub">Perf.</th>
            <th class="th-conduct-sub">Performance</th>
            <th class="th-conduct-sub">Teamwork</th>
            <th class="th-conduct-sub">Assignment</th>
            <th class="th-conduct-sub">Behavior</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  },

  renderFooter(schoolInfo, student) {
    const sig = schoolInfo?.signatures || {};
    const flags = this.mergeFlags(schoolInfo, student);
    const notes = schoolInfo?.notes || {};
    const showHomeroom = schoolInfo?.showHomeroomLine !== false;

    const noteBits = [];
    if (flags.ixlNote) noteBits.push(this.escapeHtml(notes.ixl || 'IXL progress report attached.'));
    if (flags.mapPrintNote) noteBits.push(this.escapeHtml(notes.map || 'MAP Growth scores available upon request.'));

    return `
      <footer class="report-footer">
        ${noteBits.length ? `<div class="footer-notes">${noteBits.map((n) => `<span class="footer-note">※ ${n}</span>`).join('')}</div>` : ''}
        <div class="signature-grid${showHomeroom ? ' with-homeroom' : ''}">
          ${showHomeroom ? `
          <div class="sig-block">
            <span class="sig-title">${this.escapeHtml(sig.homeroom || '導師')}</span>
            <div class="sig-line"></div>
          </div>` : ''}
          <div class="sig-block">
            <span class="sig-title">${this.escapeHtml(sig.teacher || 'Teacher / 教師')}</span>
            <div class="sig-line"></div>
          </div>
          <div class="sig-block">
            <span class="sig-title">${this.escapeHtml(sig.director || 'Director / 主任')}</span>
            <div class="sig-line"></div>
          </div>
          <div class="sig-block">
            <span class="sig-title">${this.escapeHtml(sig.principal || 'Principal / 校長')}</span>
            <div class="sig-line"></div>
          </div>
        </div>
      </footer>
    `;
  }
};
