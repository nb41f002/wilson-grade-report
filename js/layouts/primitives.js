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
      <svg class="classical-corner-svg" viewBox="0 0 80 80" width="17mm" height="17mm" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer / inner L brackets -->
        <path d="M2.5 44 V2.5 H44" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
        <path d="M7 38.5 V7 H38.5" stroke="currentColor" stroke-width="1.15" stroke-linecap="square"/>
      
        <!-- Corner medallion -->
        <circle cx="2.5" cy="2.5" r="3.1" stroke="currentColor" stroke-width="1.35"/>
        <circle cx="2.5" cy="2.5" r="1.35" fill="currentColor"/>
        <circle cx="2.5" cy="2.5" r="5" stroke="currentColor" stroke-width="0.65" opacity="0.6"/>
      
        <!-- Bold primary scroll -->
        <path d="M12 2.8
                 C20.5 2.8 27 7.5 29.5 15
                 C32.2 23 29 31 21.5 34
                 C15.2 36.5 8.8 33.5 7 27.5
                 C5.4 22.2 9.2 18.5 13.5 19.5
                 C17 20.3 19 23.8 17.2 27"
              stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 8.2
                 C21 8.2 25.5 12 27 17.5
                 C28.5 23 25.2 28.2 20 29.2
                 C16.2 30 13 27.5 12.5 24"
              stroke="currentColor" stroke-width="0.95" opacity="0.85" stroke-linecap="round"/>
      
        <!-- Dense acanthus top arm -->
        <path d="M24 3
                 C29.5 0.6 37.5 1.8 42 6.5
                 C38 5.2 33.2 5.8 29.5 9
                 C34.2 8.2 39.2 10.2 42 14.5
                 C37.8 12.5 33.2 13.2 29.5 16.5
                 C33.8 15.5 37.8 17.2 40 20.5
                 C36.5 18.8 33 19.5 30 22"
              stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26.5 4 C31 5.2 34.8 8 36.8 11.8" stroke="currentColor" stroke-width="0.85" opacity="0.8" stroke-linecap="round"/>
        <path d="M30.5 4.5 C34.2 6.2 37.2 9.5 38.8 13" stroke="currentColor" stroke-width="0.7" opacity="0.65" stroke-linecap="round"/>
        <path d="M35 6.8 C38 5.2 41.5 6 43.2 8.5 C41.2 7.6 39 8.2 37.2 9.8" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>
        <path d="M37.5 12.2 C40.5 11 43.5 12.2 44.5 14.8 C42.5 13.8 40.2 14.5 38.5 16" stroke="currentColor" stroke-width="0.85" stroke-linecap="round"/>
        <path d="M39.5 17 C42 16.2 44.5 17.5 45.2 19.8 C43.5 18.8 41.5 19.2 40 20.5" stroke="currentColor" stroke-width="0.75" stroke-linecap="round"/>
      
        <!-- Dense acanthus left arm (mirror) -->
        <path d="M3 24
                 C0.6 29.5 1.8 37.5 6.5 42
                 C5.2 38 5.8 33.2 9 29.5
                 C8.2 34.2 10.2 39.2 14.5 42
                 C12.5 37.8 13.2 33.2 16.5 29.5
                 C15.5 33.8 17.2 37.8 20.5 40
                 C18.8 36.5 19.5 33 22 30"
              stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 26.5 C5.2 31 8 34.8 11.8 36.8" stroke="currentColor" stroke-width="0.85" opacity="0.8" stroke-linecap="round"/>
        <path d="M4.5 30.5 C6.2 34.2 9.5 37.2 13 38.8" stroke="currentColor" stroke-width="0.7" opacity="0.65" stroke-linecap="round"/>
        <path d="M6.8 35 C5.2 38 6 41.5 8.5 43.2 C7.6 41.2 8.2 39 9.8 37.2" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>
        <path d="M12.2 37.5 C11 40.5 12.2 43.5 14.8 44.5 C13.8 42.5 14.5 40.2 16 38.5" stroke="currentColor" stroke-width="0.85" stroke-linecap="round"/>
        <path d="M17 39.5 C16.2 42 17.5 44.5 19.8 45.2 C18.8 43.5 19.2 41.5 20.5 40" stroke="currentColor" stroke-width="0.75" stroke-linecap="round"/>
      
        <!-- Guilloche lattice -->
        <path d="M16 16 Q27 16 33 28" stroke="currentColor" stroke-width="0.9" opacity="0.75" stroke-linecap="round"/>
        <path d="M16 16 Q16 27 28 33" stroke="currentColor" stroke-width="0.9" opacity="0.75" stroke-linecap="round"/>
        <path d="M19.5 19.5 Q26.5 19.5 30.5 26" stroke="currentColor" stroke-width="0.7" opacity="0.6" stroke-linecap="round"/>
        <path d="M19.5 19.5 Q19.5 26.5 26 30.5" stroke="currentColor" stroke-width="0.7" opacity="0.6" stroke-linecap="round"/>
        <path d="M22.8 22.8 Q27 22.8 29.2 26.2" stroke="currentColor" stroke-width="0.55" opacity="0.5" stroke-linecap="round"/>
        <path d="M22.8 22.8 Q22.8 27 26.2 29.2" stroke="currentColor" stroke-width="0.55" opacity="0.5" stroke-linecap="round"/>
      
        <!-- Soft fill petals (very light) for mass -->
        <path d="M12 5 C16 5 19 8 19.5 12 C17 9.5 14 8.5 12 9.5 Z" fill="currentColor" opacity="0.12"/>
        <path d="M5 12 C5 16 8 19 12 19.5 C9.5 17 8.5 14 9.5 12 Z" fill="currentColor" opacity="0.12"/>
        <path d="M28 5.5 C32 4 36.5 5.5 39 9 C35.5 8 32.5 9 30.5 11.5 C32.5 10.5 35 11.5 36.5 14 C33.5 12.5 30.5 13 28.5 15 Z" fill="currentColor" opacity="0.1"/>
        <path d="M5.5 28 C4 32 5.5 36.5 9 39 C8 35.5 9 32.5 11.5 30.5 C10.5 32.5 11.5 35 14 36.5 C12.5 33.5 13 30.5 15 28.5 Z" fill="currentColor" opacity="0.1"/>
      
        <!-- Finials -->
        <path d="M42.5 2.5 L46.2 6.2 L42.5 9.9 L38.8 6.2 Z" stroke="currentColor" stroke-width="1.05" fill="none"/>
        <path d="M42.5 4.8 L44.2 6.2 L42.5 7.6 L40.8 6.2 Z" fill="currentColor"/>
        <path d="M2.5 42.5 L6.2 46.2 L9.9 42.5 L6.2 38.8 Z" stroke="currentColor" stroke-width="1.05" fill="none"/>
        <path d="M4.8 42.5 L6.2 44.2 L7.6 42.5 L6.2 40.8 Z" fill="currentColor"/>
      
        <!-- Arm diamonds -->
        <path d="M33.5 13.5 L35.8 15.8 L33.5 18.1 L31.2 15.8 Z" fill="currentColor" opacity="0.9"/>
        <path d="M13.5 33.5 L15.8 35.8 L18.1 33.5 L15.8 31.2 Z" fill="currentColor" opacity="0.9"/>
      </svg>
    `;
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
            <path d="M7 1 L13 7 L7 13 L1 7 Z" stroke="currentColor" stroke-width="1.15"/>
            <path d="M7 3.2 L10.8 7 L7 10.8 L3.2 7 Z" stroke="currentColor" stroke-width="0.7" opacity="0.85"/>
            <path d="M7 5.2 L8.8 7 L7 8.8 L5.2 7 Z" fill="currentColor" opacity="0.9"/>
          </svg>
        </span>
        <span class="classical-divider-line"></span>
      </div>`;
  }
};
