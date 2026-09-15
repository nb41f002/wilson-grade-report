/**
 * 資料儲存、加權試算、JSON 匯出入、操行等級遷移
 */
const STORAGE_KEY = 'wilson_grade_report_data_v2';

const CONDUCT_LEVELS = ['ee', 'me', 'ae', 'be'];
const CONDUCT_MIGRATE = {
  excellent: 'ee',
  good: 'me',
  satisfactory: 'ae',
  'needs-improvement': 'be',
  warning: 'be',
  ee: 'ee',
  me: 'me',
  ae: 'ae',
  be: 'be'
};

window.DataStore = {
  data: null,
  saveTimeout: null,
  listeners: [],
  CONDUCT_LEVELS,

  migrateConductLevel(val) {
    if (val == null || val === '') return 'ee';
    const key = String(val).toLowerCase().trim();
    return CONDUCT_MIGRATE[key] || 'me';
  },

  migrateConduct(conduct) {
    const c = conduct && typeof conduct === 'object' ? conduct : {};
    return {
      performance: this.migrateConductLevel(c.performance),
      teamwork: this.migrateConductLevel(c.teamwork),
      assignment: this.migrateConductLevel(c.assignment),
      behavior: this.migrateConductLevel(c.behavior)
    };
  },

  async init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.data = this.normalize(JSON.parse(saved));
        this.notifyChange('loaded_from_storage');
        return this.data;
      } catch (e) {
        console.warn('暫存讀取失敗，載入範例資料:', e);
      }
    }
    await this.loadSample();
    this.saveImmediate();
    this.notifyChange('initialized');
    return this.data;
  },

  async loadSample() {
    try {
      const resp = await fetch('sample-data.json');
      if (resp.ok) {
        this.data = this.normalize(await resp.json());
        return;
      }
    } catch (e) { /* file:// fallback */ }
    this.data = this.normalize(this.getFallbackData());
  },

  normalize(raw) {
    const d = raw && typeof raw === 'object' ? raw : {};
    d.schoolInfo = Object.assign({
      name: 'Wilson International Elementary School',
      nameZh: '威爾森國際小學',
      academicYear: 'The Second Semester of the 114th Academic Year',
      term: 'Midterm',
      weights: { midterm: 40, daily: 60 },
      signatures: {
        teacher: 'Teacher / 教師',
        director: 'Director / 主任',
        principal: 'Principal / 校長',
        homeroom: '導師'
      },
      showHomeroomLine: true,
      flags: {
        internationalStudent: false,
        independentConduct: false,
        ixlNote: false,
        mapPrintNote: false
      },
      notes: {
        ixl: 'IXL progress report attached.',
        map: 'MAP Growth scores available upon request.'
      }
    }, d.schoolInfo || {});
    d.schoolInfo.weights = Object.assign({ midterm: 40, daily: 60 }, d.schoolInfo.weights || {});
    d.schoolInfo.flags = Object.assign({
      internationalStudent: false,
      independentConduct: false,
      ixlNote: false,
      mapPrintNote: false
    }, d.schoolInfo.flags || {});
    if (!Array.isArray(d.availableSubjects) || !d.availableSubjects.length) {
      d.availableSubjects = this.getFallbackData().availableSubjects;
    }
    d.availableSubjects = d.availableSubjects.map((s, i) => this.normalizeSubject(s, i));
    if (!Array.isArray(d.students)) d.students = [];
    d.students = d.students.map((stu, i) => this.normalizeStudent(stu, i));
    if (d.locale !== 'en' && d.locale !== 'zh') d.locale = undefined;
    return d;
  },

  normalizeStudent(stu, i) {
    const s = stu || {};
    const grades = {};
    const rawGrades = s.grades && typeof s.grades === 'object' ? s.grades : {};
    Object.keys(rawGrades).forEach((subjId) => {
      const g = rawGrades[subjId] || {};
      grades[subjId] = {
        midterm: g.midterm !== undefined ? g.midterm : '',
        daily: g.daily !== undefined ? g.daily : '',
        overall: g.overall !== undefined ? g.overall : '',
        isManualOverall: !!g.isManualOverall,
        conduct: this.migrateConduct(g.conduct),
        comment: g.comment || ''
      };
    });
    return {
      id: s.id || ('s_' + Date.now() + '_' + i),
      seatNo: s.seatNo || String(i + 1).padStart(2, '0'),
      chineseName: s.chineseName || '',
      englishName: s.englishName || '',
      classGrade: s.classGrade || 'Grade 4 / 401',
      studentId: s.studentId || '',
      flags: Object.assign({
        internationalStudent: false,
        independentConduct: false,
        ixlNote: false,
        mapPrintNote: false
      }, s.flags || {}),
      grades
    };
  },

  getFallbackData() {
    return {
      schoolInfo: {
        name: 'Wilson International Elementary School',
        nameZh: '威爾森國際小學',
        academicYear: 'The Second Semester of the 114th Academic Year',
        term: 'Midterm',
        weights: { midterm: 40, daily: 60 },
        signatures: {
          teacher: 'Teacher / 教師',
          director: 'Director / 主任',
          principal: 'Principal / 校長',
          homeroom: '導師'
        },
        showHomeroomLine: true,
        flags: {
          internationalStudent: false,
          independentConduct: false,
          ixlNote: false,
          mapPrintNote: false
        },
        notes: {
          ixl: 'IXL progress report attached.',
          map: 'MAP Growth scores available upon request.'
        }
      },
      availableSubjects: [
        { id: 'la', name: 'Language Arts', chineseName: '語文', category: 'core', enabled: true },
        { id: 'math', name: 'Mathematics', chineseName: '數學', category: 'core', enabled: true },
        { id: 'wss', name: 'Western Social Studies', chineseName: '西社', category: 'core', enabled: true },
        { id: 'music', name: 'Music', chineseName: '音樂', category: 'special', enabled: true },
        { id: 'art', name: 'Art', chineseName: '美勞', category: 'special', enabled: true },
        { id: 'health', name: 'Health', chineseName: '健康', category: 'special', enabled: true },
        { id: 'gp', name: 'G.P.', chineseName: '體能', category: 'special', enabled: true },
        { id: 'phonics', name: 'Phonics', chineseName: '拼音', category: 'special', enabled: true },
        { id: 'writing', name: '作文', chineseName: '作文', category: 'chinese', enabled: true },
        { id: 'singing', name: '中唱', chineseName: '中唱', category: 'chinese', enabled: true },
        { id: 'social', name: '中社', chineseName: '中社', category: 'chinese', enabled: true }
      ],
      students: [{
        id: 's01',
        seatNo: '01',
        chineseName: '林詩穎',
        englishName: 'Alice',
        classGrade: 'Grade 4 / 401',
        studentId: 'W114028',
        flags: {},
        grades: {
          la: {
            midterm: 83, daily: 93, overall: 88, isManualOverall: true,
            conduct: { performance: 'ee', teamwork: 'ee', assignment: 'ee', behavior: 'ee' },
            comment: 'Alice is a highly motivated, patient, attentive, and capable learner. She shows good concentration during lessons and has developed effective study habits. She is a little quiet sometimes, but her answers are almost all correct.'
          },
          math: {
            midterm: 100, daily: 90, overall: 95, isManualOverall: false,
            conduct: { performance: 'ee', teamwork: 'ee', assignment: 'ee', behavior: 'ee' },
            comment: 'Alice achieved a perfect score—wonderful work! She shows excellent understanding and works very carefully. Her effort is excellent. Keep it up!'
          },
          wss: {
            midterm: 88, daily: 92, overall: 90, isManualOverall: false,
            conduct: { performance: 'ee', teamwork: 'ee', assignment: 'ee', behavior: 'ee' },
            comment: 'Alice has grown wonderfully this term. She is attentive, helpful, and her confidence in supporting both her own learning and that of her peers has strengthened noticeably.'
          }
        }
      }]
    };
  },

  onChange(fn) { this.listeners.push(fn); },
  notifyChange(type) { this.listeners.forEach((fn) => fn(type, this.data)); },

  saveDebounced(delay = 350) {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveImmediate(), delay);
  },

  saveImmediate() {
    if (!this.data) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      this.notifyChange('saved:' + timeStr);
    } catch (e) {
      console.error('儲存失敗:', e);
      this.notifyChange('save_error');
    }
  },

  exportJsonFile() {
    if (!this.data) return;
    const term = this.data.schoolInfo?.term || 'Midterm';
    const filename = `Wilson成績報告_${term}_${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importJsonFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed || !parsed.students || !parsed.schoolInfo) {
            reject(new Error('檔案格式不相符，缺少 students 或 schoolInfo'));
            return;
          }
          this.data = this.normalize(parsed);
          this.saveImmediate();
          this.notifyChange('imported');
          resolve(true);
        } catch (err) {
          reject(new Error('JSON 解析失敗'));
        }
      };
      reader.onerror = () => reject(new Error('檔案讀取錯誤'));
      reader.readAsText(file);
    });
  },

  async resetToSample() {
    await this.loadSample();
    this.saveImmediate();
    this.notifyChange('reset_to_sample');
  },

  calculateOverall(midterm, daily, isManual, manualVal) {
    if (isManual && manualVal !== undefined && manualVal !== null && manualVal !== '') {
      return Math.round(Number(manualVal));
    }
    if (midterm === '' || midterm === null || midterm === undefined ||
        daily === '' || daily === null || daily === undefined) {
      return '';
    }
    const mWeight = (this.data?.schoolInfo?.weights?.midterm ?? 40) / 100;
    const dWeight = (this.data?.schoolInfo?.weights?.daily ?? 60) / 100;
    return Math.round(Number(midterm) * mWeight + Number(daily) * dWeight);
  },

  SUBJECT_CATEGORIES: ['core', 'special', 'chinese', 'other'],

  BUILTIN_IDS: {
    la: 'core', math: 'core', wss: 'core',
    music: 'special', art: 'special', health: 'special', gp: 'special', phonics: 'special',
    writing: 'chinese', singing: 'chinese', social: 'chinese'
  },

  isCustomSubject(subjOrId) {
    const id = typeof subjOrId === 'string' ? subjOrId : (subjOrId && subjOrId.id);
    return !!(id && String(id).startsWith('custom_'));
  },

  normalizeSubject(s, i) {
    const raw = s && typeof s === 'object' ? s : {};
    const id = raw.id || ('custom_' + Date.now() + '_' + (i || 0));
    const builtinCat = this.BUILTIN_IDS[id];
    let category = raw.category;
    if (!this.SUBJECT_CATEGORIES.includes(category)) {
      category = builtinCat || (String(id).startsWith('custom_') ? 'other' : 'core');
    }
    return {
      id,
      name: (raw.name != null && String(raw.name).trim()) ? String(raw.name).trim() : id,
      chineseName: raw.chineseName != null ? String(raw.chineseName).trim() : '',
      category,
      enabled: raw.enabled !== false && raw.defaultEnabled !== false
    };
  },

  emptyGrade() {
    return {
      midterm: '',
      daily: '',
      overall: '',
      isManualOverall: false,
      conduct: {
        performance: 'ee',
        teamwork: 'ee',
        assignment: 'ee',
        behavior: 'ee'
      },
      comment: ''
    };
  },

  ensureGradeEntriesForSubject(subjId) {
    if (!this.data || !Array.isArray(this.data.students)) return;
    this.data.students.forEach((stu) => {
      if (!stu.grades) stu.grades = {};
      if (!stu.grades[subjId]) stu.grades[subjId] = this.emptyGrade();
    });
  },

  addCustomSubject({ name, chineseName, category, enabled } = {}) {
    const trimmed = (name || '').trim();
    if (!trimmed) throw new Error('name_required');
    const cat = this.SUBJECT_CATEGORIES.includes(category) ? category : 'other';
    const id = 'custom_' + Date.now();
    const subj = this.normalizeSubject({
      id,
      name: trimmed,
      chineseName: (chineseName || '').trim(),
      category: cat,
      enabled: enabled !== false
    });
    if (!Array.isArray(this.data.availableSubjects)) this.data.availableSubjects = [];
    this.data.availableSubjects.push(subj);
    this.ensureGradeEntriesForSubject(id);
    this.saveImmediate();
    this.notifyChange('subject_added');
    return subj;
  },

  updateSubject(id, patch = {}) {
    const list = this.data?.availableSubjects || [];
    const subj = list.find((s) => s.id === id);
    if (!subj) return null;
    if (patch.name !== undefined) {
      const n = String(patch.name).trim();
      if (!n) throw new Error('name_required');
      subj.name = n;
    }
    if (patch.chineseName !== undefined) {
      subj.chineseName = String(patch.chineseName || '').trim();
    }
    if (patch.category !== undefined && this.SUBJECT_CATEGORIES.includes(patch.category)) {
      subj.category = patch.category;
    }
    if (patch.enabled !== undefined) subj.enabled = !!patch.enabled;
    this.saveImmediate();
    this.notifyChange('subject_updated');
    return subj;
  },

  deleteSubject(id) {
    const list = this.data?.availableSubjects || [];
    const idx = list.findIndex((s) => s.id === id);
    if (idx < 0) return false;
    list.splice(idx, 1);
    (this.data.students || []).forEach((stu) => {
      if (stu.grades && stu.grades[id]) delete stu.grades[id];
    });
    this.saveImmediate();
    this.notifyChange('subject_deleted');
    return true;
  },

  moveSubject(id, direction) {
    const list = this.data?.availableSubjects || [];
    const idx = list.findIndex((s) => s.id === id);
    if (idx < 0) return false;
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return false;
    const tmp = list[idx];
    list[idx] = list[target];
    list[target] = tmp;
    this.saveImmediate();
    this.notifyChange('subject_reordered');
    return true;
  },

  subjectDisplayName(subj) {
    if (!subj) return '';
    const name = subj.name || '';
    const zh = subj.chineseName || '';
    if (zh && zh !== name) return name + ' / ' + zh;
    return name;
  },

  enabledSubjects() {
    return (this.data?.availableSubjects || []).filter((s) => s.enabled !== false);
  },

  countFilledStudents() {
    const subjects = this.enabledSubjects();
    const students = this.data?.students || [];
    let filled = 0;
    students.forEach((stu) => {
      const hasAny = subjects.some((subj) => {
        const g = stu.grades?.[subj.id];
        return g && (g.midterm !== '' && g.midterm !== undefined || g.comment);
      });
      if (hasAny) filled += 1;
    });
    return { filled, total: students.length };
  }
};
