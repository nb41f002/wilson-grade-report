/**
 * Shared report primitives — escaping, habit codes, scores, legend, signatures.
 * Layout modules compose these; they do NOT share one full report DOM.
 */
window.ReportPrimitives = {
  CONDUCT_ORDER: ['performance', 'teamwork', 'assignment', 'behavior'],

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  t(key) {
    return (window.I18n && window.I18n.t(key)) || key;
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

  getConductCode(level) {
    const raw = window.DataStore
      ? window.DataStore.migrateConductLevel(level)
      : level;
    const code = String(raw || '').toUpperCase();
    return ['EE', 'ME', 'AE', 'BE'].includes(code) ? code : '·';
  },

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


  needsTwoPagesByComments(subjects, student, schoolInfo, opts = {}) {
    const subjLimit = opts.subjLimit ?? 7;
    const lenLimit = opts.lenLimit ?? 900;
    const comboLen = opts.comboLen ?? 400;
    const comboSubj = opts.comboSubj ?? 5;
    if (subjects.length > subjLimit) return true;
    let commentLen = 0;
    subjects.forEach((subj) => {
      commentLen += (this.gradeRow(subj, student, schoolInfo).comment || '').length;
    });
    return commentLen > lenLimit || (subjects.length > comboSubj && commentLen > comboLen);
  },

  titleStack(term) {
    const raw = String(term || 'Midterm').trim().toUpperCase();
    if (/PROGRESS/.test(raw)) {
      const parts = raw.replace(/\s+/g, ' ').split(' ');
      return parts.length >= 2 ? parts : ['MIDTERM', 'PROGRESS', 'REPORT'];
    }
    return [raw, 'LEARNING', 'REPORT'];
  },

  reportDate(schoolInfo, student) {
    return this.escapeHtml(schoolInfo.reportDate || student.reportDate || '');
  },
  enabledSubjects(subjects) {
    return (subjects || []).filter((s) => s.enabled !== false);
  },

  gradeRow(subj, student, schoolInfo) {
    const g = student.grades?.[subj.id] || {};
    const mWeight = schoolInfo?.weights?.midterm ?? 40;
    const dWeight = schoolInfo?.weights?.daily ?? 60;
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
    return {
      subj,
      midterm,
      daily,
      overall,
      conduct: g.conduct || {},
      comment: g.comment || '',
      mWeight,
      dWeight
    };
  },

  studentDisplayName(student) {
    const nameEn = student.englishName || '';
    const nameZh = student.chineseName || '';
    return {
      primary: nameEn || nameZh || '—',
      secondary: nameEn && nameZh ? nameZh : '',
      en: nameEn || nameZh || ''
    };
  },

  schoolNames(schoolInfo) {
    return {
      en: schoolInfo.name || 'Wilson International Elementary School',
      zh: schoolInfo.nameZh || schoolInfo.chineseName || '威爾森國際小學'
    };
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

  renderFooter(schoolInfo, student, opts = {}) {
    const sig = schoolInfo?.signatures || {};
    const flags = this.mergeFlags(schoolInfo, student);
    const notes = schoolInfo?.notes || {};
    const showHomeroom = schoolInfo?.showHomeroomLine !== false;
    const classical = !!opts.classical;

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

    const fleuron = classical
      ? `<div class="classical-fleuron" aria-hidden="true">✦</div>`
      : '';

    return `
      <footer class="report-footer report-signatures${classical ? ' classical-signatures' : ''}">
        ${fleuron}
        ${noteBits.length ? `<div class="footer-notes">${noteBits.map((n) => `<span class="footer-note">※ ${n}</span>`).join('')}</div>` : ''}
        <div class="signature-grid${showHomeroom ? ' with-homeroom' : ''}">
          ${showHomeroom ? sigBlock(this.t('sigHomeroom'), this.t('sigHomeroomZh'), sig.homeroom) : ''}
          ${sigBlock(this.t('sigTeacher'), this.t('sigTeacherZh'), sig.teacher)}
          ${sigBlock(this.t('sigDirector'), this.t('sigDirectorZh'), sig.director)}
          ${sigBlock(this.t('sigPrincipal'), this.t('sigPrincipalZh'), sig.principal)}
        </div>
      </footer>
    `;
  },

  sheetAttrs(student, pageNum, theme, orientation, extraClass) {
    const orientClass = orientation === 'portrait' ? 'a4-portrait' : 'a4-landscape';
    return `class="report report-sheet ${orientClass} ${extraClass || ''}" data-theme="${this.escapeHtml(theme)}" data-orientation="${this.escapeHtml(orientation)}" data-student-id="${this.escapeHtml(student.id)}" data-page="${pageNum}"`;
  },

  /** Classical corner flourish (inline SVG, rotated via CSS) */
  classicalCorners() {
    const svg = `
      <svg class="classical-corner-svg" viewBox="0 0 64 64" width="16mm" height="16mm" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 28 V8 H24" stroke="#A98745" stroke-width="1.2"/>
        <path d="M8 22 V12 H18" stroke="#A98745" stroke-width="0.8"/>
        <path d="M4 8 Q14 8 18 18" stroke="#A98745" stroke-width="0.9"/>
        <circle cx="10" cy="10" r="1.4" fill="#A98745"/>
      </svg>`;
    return `
      <div class="ornate-corners" aria-hidden="true">
        <span class="corner corner-tl">${svg}</span>
        <span class="corner corner-tr">${svg}</span>
        <span class="corner corner-bl">${svg}</span>
        <span class="corner corner-br">${svg}</span>
      </div>`;
  },

  classicalDivider() {
    return `
      <div class="classical-divider" aria-hidden="true">
        <span class="classical-divider-line"></span>
        <span class="classical-divider-diamond">◇</span>
        <span class="classical-divider-line"></span>
      </div>`;
  }
};
