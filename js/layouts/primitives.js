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
      <svg class="classical-corner-svg" viewBox="0 0 80 80" width="16mm" height="16mm" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 38 V4 H38" stroke="currentColor" stroke-width="1.65" stroke-linecap="square"/>
        <path d="M8.5 33 V8.5 H33" stroke="currentColor" stroke-width="0.95" stroke-linecap="square" opacity="0.85"/>
        <circle cx="4" cy="4" r="2.2" stroke="currentColor" stroke-width="1.1"/>
        <circle cx="4" cy="4" r="0.85" fill="currentColor"/>
        <path d="M10 4 C16 4 20 7 22 12 C24 17 22 22 17 24 C13 26 9 24 8 20 C7 16 10 14 13 15 C15.5 16 16.5 18.5 15 20.5" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8.5 C16.5 8.5 19.5 11 20.5 14.5 C21.5 18 19.5 21 16.5 21.5" stroke="currentColor" stroke-width="0.75" opacity="0.75" stroke-linecap="round"/>
        <path d="M24 4.2 C28 2.2 34 3.5 37 7 C34.5 6.2 31 6.5 28.5 8.5 C31.5 8.2 35 9.5 36.5 12.5 C33 11 29.5 11.5 27 14" stroke="currentColor" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26.5 4.8 C29 5.5 31.5 7.2 32.5 9.5" stroke="currentColor" stroke-width="0.65" opacity="0.7" stroke-linecap="round"/>
        <path d="M4.2 24 C2.2 28 3.5 34 7 37 C6.2 34.5 6.5 31 8.5 28.5 C8.2 31.5 9.5 35 12.5 36.5 C11 33 11.5 29.5 14 27" stroke="currentColor" stroke-width="0.95" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.8 26.5 C5.5 29 7.2 31.5 9.5 32.5" stroke="currentColor" stroke-width="0.65" opacity="0.7" stroke-linecap="round"/>
        <path d="M14 14 Q22 14 26 22" stroke="currentColor" stroke-width="0.7" opacity="0.65" stroke-linecap="round"/>
        <path d="M14 14 Q14 22 22 26" stroke="currentColor" stroke-width="0.7" opacity="0.65" stroke-linecap="round"/>
        <path d="M17 17 Q22 17 24.5 21.5" stroke="currentColor" stroke-width="0.55" opacity="0.5" stroke-linecap="round"/>
        <path d="M17 17 Q17 22 21.5 24.5" stroke="currentColor" stroke-width="0.55" opacity="0.5" stroke-linecap="round"/>
        <path d="M36 4 L38.6 6.6 L36 9.2 L33.4 6.6 Z" stroke="currentColor" stroke-width="0.85" fill="none"/>
        <path d="M4 36 L6.6 38.6 L9.2 36 L6.6 33.4 Z" stroke="currentColor" stroke-width="0.85" fill="none"/>
        <path d="M29 11 L30.6 12.6 L29 14.2 L27.4 12.6 Z" fill="currentColor" opacity="0.85"/>
        <path d="M11 29 L12.6 30.6 L14.2 29 L12.6 27.4 Z" fill="currentColor" opacity="0.85"/>
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
        <span class="classical-divider-diamond" aria-hidden="true">
          <svg viewBox="0 0 14 14" width="3.2mm" height="3.2mm" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1.2 L12.8 7 L7 12.8 L1.2 7 Z" stroke="currentColor" stroke-width="1.1"/>
            <path d="M7 4 L10 7 L7 10 L4 7 Z" fill="currentColor" opacity="0.85"/>
          </svg>
        </span>
        <span class="classical-divider-line"></span>
      </div>`;
  }
};
