/**
 * A4 landscape report renderer — Modern International Academy
 * EE/ME/AE/BE navy habit codes, bilingual two-level headers
 */
window.ReportRenderer = {
  CONDUCT_ORDER: ['performance', 'teamwork', 'assignment', 'behavior'],

  getConductBadge(level) {
    const raw = window.DataStore
      ? window.DataStore.migrateConductLevel(level)
      : ({ excellent: 'ee', good: 'me', satisfactory: 'ae', 'needs-improvement': 'be', warning: 'be' }[level] || level);
    const code = String(raw || '').toUpperCase();
    if (!['EE', 'ME', 'AE', 'BE'].includes(code)) {
      return '<span class="habit-code habit-empty">·</span>';
    }
    const tipKey = 'tip' + code;
    const tip = (window.I18n && window.I18n.t(tipKey)) || code;
    return `<span class="habit-code" title="${this.escapeHtml(tip)}">${code}</span>`;
  },

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  subjectLabel(subj) {
    if (window.DataStore && typeof window.DataStore.subjectDisplayName === 'function') {
      return window.DataStore.subjectDisplayName(subj);
    }
    if (!subj) return '';
    const name = subj.name || '';
    const zh = subj.chineseName || '';
    if (zh && zh !== name) return name + ' / ' + zh;
    return name;
  },

  t(key) {
    return (window.I18n && window.I18n.t(key)) || key;
  },

  /** Bilingual th: EN primary + ZH secondary */
  thLabel(enKey, zhKey) {
    const en = this.escapeHtml(this.t(enKey));
    const locale = (window.I18n && window.I18n.locale) || 'zh';
    if (locale === 'en' || !zhKey) {
      return `<span class="th-en">${en}</span>`;
    }
    const zh = this.escapeHtml(this.t(zhKey));
    if (!zh || zh === zhKey) {
      return `<span class="th-en">${en}</span>`;
    }
    return `<span class="th-en">${en}</span><span class="th-zh">${zh}</span>`;
  },

  /** 1–8 subjects → 1 page; 9–16 → 2 pages (max 2) */
  MAX_SUBJECTS_PAGE1: 8,

  splitSubjects(subjects) {
    const list = subjects || [];
    if (list.length <= this.MAX_SUBJECTS_PAGE1) {
      return { pages: [list], twoPages: false };
    }
    return {
      pages: [
        list.slice(0, this.MAX_SUBJECTS_PAGE1),
        list.slice(this.MAX_SUBJECTS_PAGE1, this.MAX_SUBJECTS_PAGE1 * 2)
      ],
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

  reportTitleEn(term) {
    const t = String(term || 'Midterm').trim();
    if (/progress\s*report/i.test(t)) return t.toUpperCase();
    return `${t.toUpperCase()} PROGRESS REPORT`;
  },

  renderStudentReport(student, schoolInfo, subjects) {
    const enabled = (subjects || []).filter((s) => s.enabled !== false);
    const { pages } = this.splitSubjects(enabled);
    const totalPages = pages.length;
    let html = '';

    pages.forEach((pageSubjects, idx) => {
      const pageNum = idx + 1;
      const isLast = pageNum === totalPages;
      const fullHeader = pageNum === 1;
      html += `
        <article class="report-sheet a4-landscape" data-student-id="${this.escapeHtml(student.id)}" data-page="${pageNum}">
          ${fullHeader
            ? this.renderHeader(schoolInfo, student, pageNum, totalPages)
            : this.renderContinuedHeader(schoolInfo, student, pageNum, totalPages)}
          <div class="report-body">
            ${this.renderTable(pageSubjects, student, schoolInfo)}
            ${isLast ? this.renderLegend() : ''}
          </div>
          ${isLast ? this.renderFooter(schoolInfo, student) : `<div class="page-continue">${this.t('pageContinue')} ${pageNum} ${this.t('of')} ${totalPages}</div>`}
        </article>
      `;
    });

    return html;
  },

  renderHeader(schoolInfo, student, pageNum, totalPages) {
    const nameZh = this.escapeHtml(student.chineseName || '');
    const nameEn = this.escapeHtml(student.englishName || '');
    const term = schoolInfo.term || 'Midterm';
    const year = this.escapeHtml(schoolInfo.academicYear || '');
    const school = this.escapeHtml(schoolInfo.name || 'Wilson International Elementary School');
    const schoolZh = this.escapeHtml(schoolInfo.nameZh || schoolInfo.chineseName || '威爾森國際小學');
    const titleEn = this.escapeHtml(this.reportTitleEn(term));
    const titleZh = this.escapeHtml(this.t('reportTitleZh'));
    const flags = this.mergeFlags(schoolInfo, student);
    const reportDate = this.escapeHtml(schoolInfo.reportDate || student.reportDate || '');

    const flagChips = [];
    if (flags.internationalStudent) flagChips.push(`<span class="flag-chip">${this.escapeHtml(this.t('flagChipIntl'))}</span>`);
    if (flags.independentConduct) flagChips.push(`<span class="flag-chip">${this.escapeHtml(this.t('flagChipConduct'))}</span>`);

    const namePrimary = nameEn || nameZh || '—';
    const nameSecondary = nameEn && nameZh ? nameZh : '';

    return `
      <header class="report-header">
        <div class="mia-top">
          <div class="mia-brand">
            <div class="header-crest-wrap">
              <img src="assets/wilson-crest.svg" alt="Wilson Crest" class="crest-icon">
            </div>
            <div class="mia-brand-text">
              <div class="school-name">${school}</div>
              <div class="school-name-zh">${schoolZh}</div>
            </div>
          </div>
          <div class="mia-heading">
            <h1 class="report-title-en">${titleEn}</h1>
            <div class="report-title-zh">${titleZh}</div>
          </div>
          <div class="mia-term-info">
            <div class="term-block">
              <span class="term-label">${this.escapeHtml(this.t('metaAcademicYear'))}</span>
              <strong class="term-value">${year || '—'}</strong>
            </div>
            <div class="term-block">
              <span class="term-label">${this.escapeHtml(this.t('metaTerm'))}</span>
              <strong class="term-value">${this.escapeHtml(term)}</strong>
            </div>
            <div class="mia-page">Page ${pageNum} / ${totalPages}</div>
          </div>
        </div>
        <section class="student-meta">
          <div class="meta-item">
            <span class="meta-label">${this.thLabel('metaStudentName', 'metaStudentNameZh')}</span>
            <strong class="meta-value">
              ${namePrimary}
              ${nameSecondary ? `<span class="meta-secondary">${nameSecondary}</span>` : ''}
              ${flagChips.length ? `<span class="flag-chips">${flagChips.join('')}</span>` : ''}
            </strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${this.thLabel('metaGradeClass', 'metaGradeClassZh')}</span>
            <strong class="meta-value">${this.escapeHtml(student.classGrade || '—')}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${this.thLabel('metaStudentId', 'metaStudentIdZh')}</span>
            <strong class="meta-value">${this.escapeHtml(student.studentId || '—')}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">${this.thLabel('metaDate', 'metaDateZh')}</span>
            <strong class="meta-value">${reportDate || '—'}</strong>
          </div>
        </section>
      </header>
    `;
  },

  renderContinuedHeader(schoolInfo, student, pageNum, totalPages) {
    const nameEn = this.escapeHtml(student.englishName || student.chineseName || '');
    const school = this.escapeHtml(schoolInfo.name || 'Wilson International Elementary School');
    const term = schoolInfo.term || 'Midterm';
    const titleEn = this.escapeHtml(this.reportTitleEn(term));
    const grade = this.escapeHtml(student.classGrade || '');
    return `
      <header class="report-header report-header-continued">
        <div class="mia-continued">
          <div class="mia-continued-left">
            <div class="school-name school-name-sm">${school}</div>
            <div class="report-title-en report-title-continued">${titleEn} — ${this.escapeHtml(this.t('continued'))}</div>
          </div>
          <div class="mia-continued-right">
            <span class="continued-student">${nameEn}${grade ? ` · ${grade}` : ''}</span>
            <span class="mia-page">Page ${pageNum} / ${totalPages}</span>
          </div>
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
      const badges = this.CONDUCT_ORDER.map((key) =>
        `<td class="col-habit">${this.getConductBadge(conduct[key])}</td>`
      ).join('');
      const comment = this.escapeHtml(g.comment || '');
      const alt = i % 2 === 1 ? ' row-alt' : '';

      return `
        <tr class="subject-row${alt}">
          <td class="col-subject subject">${this.escapeHtml(this.subjectLabel(subj))}</td>
          <td class="col-score score col-midterm">${midterm}</td>
          <td class="col-score score col-daily">${daily}</td>
          <td class="col-score score col-overall overall">${overall}</td>
          ${badges}
          <td class="col-assessment assessment"><div class="assessment-content teacher-assessment">${comment}</div></td>
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
            <th rowspan="2" class="th-subject">${this.thLabel('thSubject', 'thSubjectZh')}</th>
            <th colspan="3" class="th-group">${this.thLabel('thAcademic', 'thAcademicZh')}</th>
            <th colspan="4" class="th-group">${this.thLabel('thHabits', 'thHabitsZh')}</th>
            <th rowspan="2" class="th-assessment">${this.thLabel('thAssessment', 'thAssessmentZh')}</th>
          </tr>
          <tr class="sub-head">
            <th class="th-score">
              <span class="th-en">${this.escapeHtml(this.t('thMidtermShort'))}</span>
              <span class="th-zh">${this.escapeHtml(this.t('thMidtermPct').replace('{n}', String(mWeight)))}</span>
            </th>
            <th class="th-score">
              <span class="th-en">${this.escapeHtml(this.t('thDailyShort'))}</span>
              <span class="th-zh">${this.escapeHtml(this.t('thDailyPct').replace('{n}', String(dWeight)))}</span>
            </th>
            <th class="th-score th-overall col-overall">${this.thLabel('thOverall', 'thOverallZh')}</th>
            <th class="th-habit">${this.thLabel('thPerf', 'thPerfZh')}</th>
            <th class="th-habit">${this.thLabel('thTeam', 'thTeamZh')}</th>
            <th class="th-habit">${this.thLabel('thAssign', 'thAssignZh')}</th>
            <th class="th-habit">${this.thLabel('thBehav', 'thBehavZh')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  },

  renderLegend() {
    const locale = (window.I18n && window.I18n.locale) || 'zh';
    const item = (code, enKey, zhKey) => {
      const en = this.escapeHtml(this.t(enKey));
      const zh = locale === 'en' ? '' : `<small>${this.escapeHtml(this.t(zhKey))}</small>`;
      return `<span class="legend-item"><b>${code}</b> ${en}${zh}</span>`;
    };
    return `
      <section class="habit-legend conduct-legend">
        <strong class="legend-title">
          ${this.escapeHtml(this.t('legendTitle'))}
          ${locale === 'en' ? '' : `<small>${this.escapeHtml(this.t('legendTitleZh'))}</small>`}
        </strong>
        ${item('EE', 'legendEEEn', 'legendEEZh')}
        ${item('ME', 'legendMEEn', 'legendMEZh')}
        ${item('AE', 'legendAEEn', 'legendAEZh')}
        ${item('BE', 'legendBEEn', 'legendBEZh')}
      </section>
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

    const locale = (window.I18n && window.I18n.locale) || 'zh';
    const sigBlock = (en, zh, custom) => {
      let title = en;
      let sub = zh;
      if (custom && /[\/／]/.test(custom)) {
        const parts = custom.split(/\s*[\/／]\s*/);
        title = parts[0] || en;
        sub = parts[1] || zh;
      } else if (custom) {
        title = custom;
      }
      const showZh = locale !== 'en' && sub && sub !== title;
      return `
        <div class="signature sig-block">
          <div class="signature-line sig-line"></div>
          <strong class="sig-title">${this.escapeHtml(title)}</strong>
          ${showZh ? `<span class="sig-zh">${this.escapeHtml(sub)}</span>` : ''}
        </div>`;
    };

    return `
      <footer class="report-footer report-signatures">
        ${noteBits.length ? `<div class="footer-notes">${noteBits.map((n) => `<span class="footer-note">※ ${n}</span>`).join('')}</div>` : ''}
        <div class="signature-grid${showHomeroom ? ' with-homeroom' : ''}">
          ${showHomeroom ? sigBlock(this.t('sigHomeroom'), this.t('sigHomeroomZh'), sig.homeroom) : ''}
          ${sigBlock(this.t('sigTeacher'), this.t('sigTeacherZh'), sig.teacher)}
          ${sigBlock(this.t('sigDirector'), this.t('sigDirectorZh'), sig.director)}
          ${sigBlock(this.t('sigPrincipal'), this.t('sigPrincipalZh'), sig.principal)}
        </div>
      </footer>
    `;
  }
};
