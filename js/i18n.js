/**
 * Bilingual UI (繁中 | English) — teacher chrome + report header labels
 */
const LOCALE_KEY = 'wilson_grade_locale_v2';

window.I18n = {
  locale: 'zh',

  dict: {
    zh: {
      brandTitle: '雙語小學橫式成績報告',
      brandSubtitle: 'Wilson International · 葉容辰老師',
      saveReady: '就緒',
      saveAuto: '已自動暫存',
      btnImport: '讀取備份',
      btnExport: '匯出 JSON',
      btnSample: '示範資料',
      btnPrintCurrent: '列印此生',
      btnPrintAll: '全班連印',
      prevStudent: '上一位',
      nextStudent: '下一位',
      selectStudent: '選擇學生',
      btnAdd: '＋ 新增',
      btnBatch: '貼上名單',
      btnDelete: '刪除',
      sectionSchool: '學校與學期',
      labelYear: '學年度標題（英文）',
      labelTerm: '報告類型（可改）',
      labelWeights: '比重 %',
      weightMid: '期中',
      weightDaily: '平時',
      chkHomeroom: '簽名區顯示「導師」欄',
      sectionStudent: '學生資料',
      labelChineseName: '中文姓名',
      labelEnglishName: 'English Name',
      labelClass: '班級',
      labelStudentId: '學號',
      flagIntl: '國際生',
      flagConduct: '操行 Independent',
      flagIxl: 'IXL 附註',
      flagMap: 'MAP 列印註記',
      sectionSubjects: '顯示科目（可勾選）',
      sectionGrades: '各科成績與評語',
      sectionHint: '期中 + 平時依比重自動算總評；可勾「手動」覆寫。學習習慣選 EE / ME / AE / BE。',
      labelMidterm: '期中考',
      labelDaily: '平時成績',
      labelOverall: '總評 Overall',
      chkManual: '手動',
      dimPerformance: '表現',
      dimTeamwork: '合作',
      dimAssignment: '作業',
      dimBehavior: '常規',
      labelComment: '教師評語 Teacher Assessment',
      btnCommentBank: '評語庫',
      commentPlaceholder: '點評語庫插入，或自行輸入…',
      zoomLabel: 'A4 橫式預覽（297×210 mm）',
      zoomReset: '重設',
      commentModalTitle: '常用評語庫',
      close: '關閉',
      batchModalTitle: '貼上學生名單',
      batchHelp: '一行一位。格式：01 林詩穎 Alice 或 林詩穎 Alice',
      btnCancel: '取消',
      btnConfirmImport: '確認匯入',
      toastInserted: '已插入評語',
      toastExported: '已匯出 JSON 備份',
      toastImported: '匯入成功',
      toastSample: '已載入示範資料',
      toastAdded: '已新增學生',
      toastDeleted: '已刪除',
      toastBatch: '已匯入',
      studentsUnit: '人',
      filledLabel: '已填',
      alertKeepOne: '至少保留一位學生',
      confirmDelete: '確定刪除',
      confirmPrintAll: '即將列印全班',
      confirmPrintAllQ: '位學生成績單，確定？',
      confirmSample: '載入示範資料（林詩穎 Alice）？目前資料會被覆蓋。',
      importFail: '匯入失敗：',
      studentFallback: '學生',
      newStudent: '新學生',
      // Report (zh = bilingual headers)
      thSubject: 'Subject<br><span class="th-zh">科目</span>',
      thMidterm: 'Midterm Exam<br><span class="th-zh">期中考</span>',
      thDaily: 'Daily Perf.<br><span class="th-zh">平時成績</span>',
      thOverall: 'Overall<br>Grade',
      thConduct: 'Learning Habits / Conduct<br><span class="th-zh">學習習慣</span>',
      thAssessment: 'Teacher Assessment<br><span class="th-zh">教師評語</span>',
      thSubExam: 'Exam',
      thSubPerf: 'Perf.',
      thPerf: 'Performance',
      thTeam: 'Teamwork',
      thAssign: 'Assignment',
      thBehav: 'Behavior',
      legendTitle: 'Scale',
      legendEE: 'EE Exceeds Expectations / 超過期待',
      legendME: 'ME Meets Expectations / 符合期待',
      legendAE: 'AE Approaching Expectations / 接近期待',
      legendBE: 'BE Beginning / 起步中',
      flagChipIntl: '國際生',
      flagChipConduct: '操行 Independent',
      pageContinue: 'Continued on next page · Page',
      of: 'of',
      tipEE: '超過期待 Exceeds',
      tipME: '符合期待 Meets',
      tipAE: '接近期待 Approaching',
      tipBE: '起步中 Beginning'
    },
    en: {
      brandTitle: 'Bilingual Grade Report (Landscape)',
      brandSubtitle: 'Wilson International · Teacher Yeh',
      saveReady: 'Ready',
      saveAuto: 'Saved',
      btnImport: 'Import backup',
      btnExport: 'Export JSON',
      btnSample: 'Sample data',
      btnPrintCurrent: 'Print this student',
      btnPrintAll: 'Print class',
      prevStudent: 'Previous',
      nextStudent: 'Next',
      selectStudent: 'Select student',
      btnAdd: '+ Add',
      btnBatch: 'Paste roster',
      btnDelete: 'Delete',
      sectionSchool: 'School & term',
      labelYear: 'Academic year title (English)',
      labelTerm: 'Report type (editable)',
      labelWeights: 'Weights %',
      weightMid: 'Midterm',
      weightDaily: 'Daily',
      chkHomeroom: 'Show Homeroom signature line',
      sectionStudent: 'Student info',
      labelChineseName: 'Chinese name',
      labelEnglishName: 'English name',
      labelClass: 'Class / Grade',
      labelStudentId: 'Student ID',
      flagIntl: 'International student',
      flagConduct: 'Independent conduct',
      flagIxl: 'IXL note',
      flagMap: 'MAP print note',
      sectionSubjects: 'Subjects shown',
      sectionGrades: 'Scores & comments',
      sectionHint: 'Overall = midterm + daily by weight; check Manual to override. Learning habits use EE / ME / AE / BE.',
      labelMidterm: 'Midterm',
      labelDaily: 'Daily',
      labelOverall: 'Overall',
      chkManual: 'Manual',
      dimPerformance: 'Performance',
      dimTeamwork: 'Teamwork',
      dimAssignment: 'Assignment',
      dimBehavior: 'Behavior',
      labelComment: 'Teacher Assessment',
      btnCommentBank: 'Comment bank',
      commentPlaceholder: 'Insert from bank, or type…',
      zoomLabel: 'A4 landscape preview (297×210 mm)',
      zoomReset: 'Reset',
      commentModalTitle: 'Comment bank',
      close: 'Close',
      batchModalTitle: 'Paste student roster',
      batchHelp: 'One student per line. Format: 01 林詩穎 Alice or 林詩穎 Alice',
      btnCancel: 'Cancel',
      btnConfirmImport: 'Import',
      toastInserted: 'Comment inserted',
      toastExported: 'JSON exported',
      toastImported: 'Import successful',
      toastSample: 'Sample data loaded',
      toastAdded: 'Student added',
      toastDeleted: 'Deleted',
      toastBatch: 'Imported',
      studentsUnit: 'students',
      filledLabel: 'filled',
      alertKeepOne: 'Keep at least one student',
      confirmDelete: 'Delete',
      confirmPrintAll: 'Print reports for all',
      confirmPrintAllQ: 'students?',
      confirmSample: 'Load sample (Alice)? Current data will be replaced.',
      importFail: 'Import failed: ',
      studentFallback: 'Student',
      newStudent: 'New student',
      thSubject: 'Subject',
      thMidterm: 'Midterm Exam',
      thDaily: 'Daily Perf.',
      thOverall: 'Overall<br>Grade',
      thConduct: 'Learning Habits / Conduct',
      thAssessment: 'Teacher Assessment',
      thSubExam: 'Exam',
      thSubPerf: 'Perf.',
      thPerf: 'Performance',
      thTeam: 'Teamwork',
      thAssign: 'Assignment',
      thBehav: 'Behavior',
      legendTitle: 'Scale',
      legendEE: 'EE Exceeds Expectations',
      legendME: 'ME Meets Expectations',
      legendAE: 'AE Approaching Expectations',
      legendBE: 'BE Beginning',
      flagChipIntl: 'Intl',
      flagChipConduct: 'Independent conduct',
      pageContinue: 'Continued on next page · Page',
      of: 'of',
      tipEE: 'Exceeds Expectations',
      tipME: 'Meets Expectations',
      tipAE: 'Approaching Expectations',
      tipBE: 'Beginning'
    }
  },

  t(key) {
    const loc = this.dict[this.locale] || this.dict.zh;
    return loc[key] ?? this.dict.zh[key] ?? key;
  },

  load() {
    try {
      const saved = localStorage.getItem(LOCALE_KEY);
      if (saved === 'en' || saved === 'zh') this.locale = saved;
    } catch (e) { /* ignore */ }
    return this.locale;
  },

  save() {
    try { localStorage.setItem(LOCALE_KEY, this.locale); } catch (e) { /* ignore */ }
  },

  setLocale(locale) {
    if (locale !== 'zh' && locale !== 'en') return;
    this.locale = locale;
    this.save();
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-Hant';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', this.t(key));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', this.t(key));
    });
    document.querySelectorAll('.locale-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.locale === locale);
    });
    if (window.App && typeof window.App.onLocaleChange === 'function') {
      window.App.onLocaleChange(locale);
    }
  }
};
