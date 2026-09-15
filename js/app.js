/**
 * Wilson 雙語成績報告系統 — 主應用（EE/ME/AE/BE + i18n）
 */
window.App = {
  setLocale(locale) {
    if (window.I18n) window.I18n.setLocale(locale);
  },
  onLocaleChange() { /* filled after DOM ready */ }
};

document.addEventListener('DOMContentLoaded', async () => {
  let currentStudentIndex = 0;
  let currentZoom = 0.72;
  let activeCommentTarget = null;
  let previewMode = 'current'; // current | all

  const t = (key) => (window.I18n ? window.I18n.t(key) : key);

  window.I18n.load();
  if (window.Theme) window.Theme.init();
  await window.DataStore.init();

  const $ = (id) => document.getElementById(id);
  const studentSelect = $('student-select');
  const studentCounter = $('student-counter');
  const progressFill = $('progress-fill');
  const subjectList = $('subject-list');
  const reportViewport = $('report-viewport');
  const zoomVal = $('zoom-val');
  const saveStatusText = $('save-status-text');

  function toast(msg, ms = 2200) {
    let el = $('app-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'app-toast';
      el.className = 'toast-bar';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  function setZoom(v) {
    currentZoom = Math.min(1.2, Math.max(0.35, Math.round(v * 100) / 100));
    reportViewport.style.setProperty('--preview-scale', String(currentZoom));
    zoomVal.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  function currentStudent() {
    return window.DataStore.data.students[currentStudentIndex];
  }

  function refreshSelector() {
    const students = window.DataStore.data.students;
    studentSelect.innerHTML = students.map((stu, idx) => {
      const label = `${stu.seatNo ? stu.seatNo + ' ' : ''}${stu.chineseName || ''} ${stu.englishName || ''}`.trim()
        || `${t('studentFallback')} ${idx + 1}`;
      return `<option value="${idx}"${idx === currentStudentIndex ? ' selected' : ''}>${label}</option>`;
    }).join('');
    const prog = window.DataStore.countFilledStudents();
    studentCounter.textContent = `${currentStudentIndex + 1} / ${students.length} ${t('studentsUnit')} · ${t('filledLabel')} ${prog.filled}`;
    const pct = students.length ? Math.round((prog.filled / students.length) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    $('btn-prev-student').disabled = currentStudentIndex <= 0;
    $('btn-next-student').disabled = currentStudentIndex >= students.length - 1;
  }

  function ensureStudent() {
    if (!window.DataStore.data.students.length) {
      window.DataStore.data.students.push(window.DataStore.normalizeStudent({
        chineseName: t('newStudent'),
        englishName: 'Student',
        seatNo: '01'
      }, 0));
      window.DataStore.saveImmediate();
    }
    if (currentStudentIndex >= window.DataStore.data.students.length) {
      currentStudentIndex = window.DataStore.data.students.length - 1;
    }
  }

  function loadStudentForm() {
    ensureStudent();
    const stu = currentStudent();
    $('input-chinese-name').value = stu.chineseName || '';
    $('input-english-name').value = stu.englishName || '';
    $('input-class-grade').value = stu.classGrade || '';
    $('input-student-id').value = stu.studentId || '';
    $('flag-intl').checked = !!stu.flags.internationalStudent;
    $('flag-conduct').checked = !!stu.flags.independentConduct;
    $('flag-ixl').checked = !!stu.flags.ixlNote;
    $('flag-map').checked = !!stu.flags.mapPrintNote;

    const si = window.DataStore.data.schoolInfo;
    $('input-term').value = si.term || 'Midterm';
    $('input-year').value = si.academicYear || '';
    $('input-weight-mid').value = si.weights.midterm;
    $('input-weight-daily').value = si.weights.daily;
    $('chk-homeroom').checked = si.showHomeroomLine !== false;

    refreshSelector();
    renderSubjectCards();
    renderSubjectsConfig();
    renderPreview();
  }

  function catLabel(cat) {
    const map = { core: 'catCore', special: 'catSpecial', chinese: 'catChinese', other: 'catOther' };
    return t(map[cat] || 'catOther');
  }

  function escapeAttr(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function refreshCategorySelects() {
    [['select-new-subj-cat', false], ['edit-subj-cat', true]].forEach(([id, keepValue]) => {
      const sel = $(id);
      if (!sel) return;
      const cur = sel.value;
      const opts = [
        ['core', 'catCore'],
        ['special', 'catSpecial'],
        ['chinese', 'catChinese'],
        ['other', 'catOther']
      ];
      sel.innerHTML = opts.map(([val, key]) =>
        `<option value="${val}">${t(key)}</option>`
      ).join('');
      if (keepValue && opts.some(([v]) => v === cur)) sel.value = cur;
      else if (!keepValue) sel.value = 'other';
    });
  }

  function renderSubjectsConfig() {
    const box = $('subjects-config');
    if (!box) return;
    const list = window.DataStore.data.availableSubjects || [];
    box.innerHTML = list.map((s, idx) => {
      const isCustom = window.DataStore.isCustomSubject(s);
      const display = window.DataStore.subjectDisplayName(s);
      const tag = isCustom ? t('customTag') : t('builtinTag');
      return `
        <div class="subj-row" data-subj-id="${escapeAttr(s.id)}">
          <label class="subj-enable" title="${escapeAttr(t('labelEnabled'))}">
            <input type="checkbox" data-subj-toggle="${escapeAttr(s.id)}" ${s.enabled !== false ? 'checked' : ''} aria-label="${escapeAttr(t('labelEnabled'))}">
          </label>
          <div class="subj-info">
            <span class="subj-name">${escapeAttr(display)}</span>
            <span class="subj-meta">
              <span class="subj-tag ${isCustom ? 'tag-custom' : 'tag-builtin'}">${escapeAttr(tag)}</span>
              <span class="subj-cat">${escapeAttr(catLabel(s.category))}</span>
            </span>
          </div>
          <div class="subj-actions">
            <button type="button" class="btn btn-secondary btn-xs" data-subj-up="${escapeAttr(s.id)}" ${idx === 0 ? 'disabled' : ''} title="${escapeAttr(t('btnMoveUp'))}" aria-label="${escapeAttr(t('btnMoveUp'))}">▲</button>
            <button type="button" class="btn btn-secondary btn-xs" data-subj-down="${escapeAttr(s.id)}" ${idx >= list.length - 1 ? 'disabled' : ''} title="${escapeAttr(t('btnMoveDown'))}" aria-label="${escapeAttr(t('btnMoveDown'))}">▼</button>
            <button type="button" class="btn btn-secondary btn-xs" data-subj-edit="${escapeAttr(s.id)}" title="${escapeAttr(t('btnEditSubject'))}" aria-label="${escapeAttr(t('btnEditSubject'))}">✎</button>
            <button type="button" class="btn btn-danger btn-xs" data-subj-del="${escapeAttr(s.id)}" title="${escapeAttr(t('btnDeleteSubject'))}" aria-label="${escapeAttr(t('btnDeleteSubject'))}">×</button>
          </div>
        </div>
      `;
    }).join('');

    box.querySelectorAll('[data-subj-toggle]').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.subjToggle;
        try {
          window.DataStore.updateSubject(id, { enabled: e.target.checked });
        } catch (err) { /* ignore */ }
        renderSubjectCards();
        renderPreview();
        refreshSelector();
      });
    });

    box.querySelectorAll('[data-subj-up]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.DataStore.moveSubject(btn.dataset.subjUp, 'up')) {
          renderSubjectsConfig();
          renderSubjectCards();
          renderPreview();
        }
      });
    });

    box.querySelectorAll('[data-subj-down]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.DataStore.moveSubject(btn.dataset.subjDown, 'down')) {
          renderSubjectsConfig();
          renderSubjectCards();
          renderPreview();
        }
      });
    });

    box.querySelectorAll('[data-subj-edit]').forEach((btn) => {
      btn.addEventListener('click', () => openEditSubjectModal(btn.dataset.subjEdit));
    });

    box.querySelectorAll('[data-subj-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.subjDel;
        const subj = (window.DataStore.data.availableSubjects || []).find((x) => x.id === id);
        if (!subj) return;
        const isCustom = window.DataStore.isCustomSubject(subj);
        const msg = isCustom
          ? `${t('confirmDeleteSubject')}\n「${subj.name}」`
          : `${t('confirmDeleteBuiltin')}\n「${subj.name}」`;
        if (!confirm(msg)) return;
        window.DataStore.deleteSubject(id);
        renderSubjectsConfig();
        renderSubjectCards();
        renderPreview();
        refreshSelector();
        toast(t('toastSubjectDeleted'));
      });
    });
  }

  function openEditSubjectModal(id) {
    const subj = (window.DataStore.data.availableSubjects || []).find((x) => x.id === id);
    if (!subj) return;
    refreshCategorySelects();
    $('edit-subj-id').value = subj.id;
    $('edit-subj-name').value = subj.name || '';
    $('edit-subj-zh').value = subj.chineseName || '';
    $('edit-subj-cat').value = subj.category || 'other';
    $('edit-subject-modal').classList.add('active');
    setTimeout(() => $('edit-subj-name').focus(), 50);
  }

  function closeEditSubjectModal() {
    $('edit-subject-modal').classList.remove('active');
  }

  function defaultGrade() {
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
  }

  function renderConductPicker(subjId, dim, label, active) {
    const levels = [
      { val: 'ee', code: 'EE', tip: t('tipEE') },
      { val: 'me', code: 'ME', tip: t('tipME') },
      { val: 'ae', code: 'AE', tip: t('tipAE') },
      { val: 'be', code: 'BE', tip: t('tipBE') }
    ];
    const migrated = window.DataStore.migrateConductLevel(active);
    const btns = levels.map((l) =>
      `<button type="button" class="level-btn level-${l.val}${migrated === l.val ? ' active' : ''}" data-subj="${subjId}" data-dim="${dim}" data-val="${l.val}" title="${l.tip}" aria-label="${l.tip}">${l.code}</button>`
    ).join('');
    return `<div class="conduct-box"><div class="conduct-box-label">${label}</div><div class="level-btn-group">${btns}</div></div>`;
  }

  function renderSubjectCards() {
    const stu = currentStudent();
    if (!stu.grades) stu.grades = {};
    const weights = window.DataStore.data.schoolInfo.weights;
    const subjects = window.DataStore.enabledSubjects();

    subjectList.innerHTML = subjects.map((subj) => {
      const g = Object.assign(defaultGrade(), stu.grades[subj.id] || {});
      if (g.conduct) g.conduct = window.DataStore.migrateConduct(g.conduct);
      if (!stu.grades[subj.id]) stu.grades[subj.id] = g;
      else stu.grades[subj.id].conduct = g.conduct;
      const overall = window.DataStore.calculateOverall(g.midterm, g.daily, g.isManualOverall, g.overall);
      return `
        <article class="subject-card" data-card="${subj.id}">
          <div class="subject-card-head">
            <h3 class="subject-name">${window.DataStore.subjectDisplayName(subj)}</h3>
          </div>
          <div class="score-row">
            <div class="score-field">
              <label>${t('labelMidterm')} ${weights.midterm}%</label>
              <input type="number" min="0" max="100" inputmode="numeric" class="score-input" data-field="midterm" data-subj="${subj.id}" value="${g.midterm !== '' && g.midterm !== undefined ? g.midterm : ''}" placeholder="0–100">
            </div>
            <div class="score-field">
              <label>${t('labelDaily')} ${weights.daily}%</label>
              <input type="number" min="0" max="100" inputmode="numeric" class="score-input" data-field="daily" data-subj="${subj.id}" value="${g.daily !== '' && g.daily !== undefined ? g.daily : ''}" placeholder="0–100">
            </div>
            <div class="score-field">
              <label>${t('labelOverall')}</label>
              <div class="overall-wrap">
                <input type="number" min="0" max="100" class="score-input overall-input" data-field="overall" data-subj="${subj.id}" value="${overall !== '' ? overall : ''}" ${g.isManualOverall ? '' : 'readonly'}>
                <label class="manual-chk"><input type="checkbox" data-manual="${subj.id}" ${g.isManualOverall ? 'checked' : ''}> ${t('chkManual')}</label>
              </div>
            </div>
          </div>
          <div class="conduct-picker-row">
            ${renderConductPicker(subj.id, 'performance', t('dimPerformance'), g.conduct.performance)}
            ${renderConductPicker(subj.id, 'teamwork', t('dimTeamwork'), g.conduct.teamwork)}
            ${renderConductPicker(subj.id, 'assignment', t('dimAssignment'), g.conduct.assignment)}
            ${renderConductPicker(subj.id, 'behavior', t('dimBehavior'), g.conduct.behavior)}
          </div>
          <div class="comment-block">
            <div class="comment-toolbar">
              <label>${t('labelComment')}</label>
              <button type="button" class="btn btn-sm btn-secondary btn-open-bank" data-subj="${subj.id}">${t('btnCommentBank')}</button>
            </div>
            <textarea class="comment-textarea" data-subj="${subj.id}" rows="3" placeholder="${t('commentPlaceholder')}">${g.comment || ''}</textarea>
          </div>
        </article>
      `;
    }).join('');

    bindSubjectEvents();
  }

  function ensureGrade(subjId) {
    const stu = currentStudent();
    if (!stu.grades[subjId]) stu.grades[subjId] = defaultGrade();
    if (!stu.grades[subjId].conduct) {
      stu.grades[subjId].conduct = {
        performance: 'ee', teamwork: 'ee',
        assignment: 'ee', behavior: 'ee'
      };
    } else {
      stu.grades[subjId].conduct = window.DataStore.migrateConduct(stu.grades[subjId].conduct);
    }
    return stu.grades[subjId];
  }

  function bindSubjectEvents() {
    subjectList.querySelectorAll('.score-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const subjId = e.target.dataset.subj;
        const field = e.target.dataset.field;
        const g = ensureGrade(subjId);
        const raw = e.target.value;
        if (field === 'overall') {
          g.overall = raw === '' ? '' : Number(raw);
          g.isManualOverall = true;
          const chk = subjectList.querySelector(`[data-manual="${subjId}"]`);
          if (chk) chk.checked = true;
        } else {
          g[field] = raw === '' ? '' : Number(raw);
          if (!g.isManualOverall) {
            const ov = window.DataStore.calculateOverall(g.midterm, g.daily, false, '');
            const ovInput = subjectList.querySelector(`.overall-input[data-subj="${subjId}"]`);
            if (ovInput) ovInput.value = ov !== '' ? ov : '';
            g.overall = ov;
          }
        }
        window.DataStore.saveDebounced();
        renderPreview();
        refreshSelector();
      });
    });

    subjectList.querySelectorAll('[data-manual]').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const subjId = e.target.dataset.manual;
        const g = ensureGrade(subjId);
        g.isManualOverall = e.target.checked;
        const ovInput = subjectList.querySelector(`.overall-input[data-subj="${subjId}"]`);
        if (ovInput) {
          ovInput.readOnly = !e.target.checked;
          if (!e.target.checked) {
            const ov = window.DataStore.calculateOverall(g.midterm, g.daily, false, '');
            ovInput.value = ov !== '' ? ov : '';
            g.overall = ov;
          }
        }
        window.DataStore.saveImmediate();
        renderPreview();
      });
    });

    subjectList.querySelectorAll('.level-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const b = e.target.closest('.level-btn');
        const g = ensureGrade(b.dataset.subj);
        g.conduct[b.dataset.dim] = b.dataset.val;
        b.closest('.level-btn-group').querySelectorAll('.level-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        window.DataStore.saveDebounced();
        renderPreview();
      });
    });

    subjectList.querySelectorAll('.comment-textarea').forEach((ta) => {
      ta.addEventListener('input', (e) => {
        ensureGrade(e.target.dataset.subj).comment = e.target.value;
        window.DataStore.saveDebounced();
        renderPreview();
        refreshSelector();
      });
    });

    subjectList.querySelectorAll('.btn-open-bank').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        activeCommentTarget = e.target.closest('[data-subj]').dataset.subj;
        openCommentModal();
      });
    });
  }

  function renderPreview() {
    const schoolInfo = window.DataStore.data.schoolInfo;
    const subjects = window.DataStore.data.availableSubjects;
    if (previewMode === 'all') {
      reportViewport.innerHTML = window.DataStore.data.students
        .map((stu) => window.ReportRenderer.renderStudentReport(stu, schoolInfo, subjects))
        .join('');
    } else {
      const stu = currentStudent();
      if (!stu) return;
      reportViewport.innerHTML = window.ReportRenderer.renderStudentReport(stu, schoolInfo, subjects);
    }
  }

  window.App.onLocaleChange = () => {
    refreshSelector();
    refreshCategorySelects();
    renderSubjectsConfig();
    renderSubjectCards();
    renderPreview();
    if (window.Theme) window.Theme.syncUI();
    if (saveStatusText && !saveStatusText.textContent.includes(':')) {
      saveStatusText.textContent = t('saveReady');
    }
  };

  // —— Locale toggle ——
  document.querySelectorAll('.locale-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.App.setLocale(btn.dataset.locale);
    });
  });
  window.I18n.setLocale(window.I18n.locale);

  // —— 基本資料 ——
  ['input-chinese-name', 'input-english-name', 'input-class-grade', 'input-student-id'].forEach((id) => {
    $(id).addEventListener('input', () => {
      const stu = currentStudent();
      stu.chineseName = $('input-chinese-name').value;
      stu.englishName = $('input-english-name').value;
      stu.classGrade = $('input-class-grade').value;
      stu.studentId = $('input-student-id').value;
      refreshSelector();
      renderPreview();
      window.DataStore.saveDebounced();
    });
  });

  [['flag-intl', 'internationalStudent'], ['flag-conduct', 'independentConduct'], ['flag-ixl', 'ixlNote'], ['flag-map', 'mapPrintNote']].forEach(([id, key]) => {
    $(id).addEventListener('change', (e) => {
      currentStudent().flags[key] = e.target.checked;
      window.DataStore.saveDebounced();
      renderPreview();
    });
  });

  $('input-term').addEventListener('input', (e) => {
    window.DataStore.data.schoolInfo.term = e.target.value || 'Midterm';
    window.DataStore.saveDebounced();
    renderPreview();
  });
  $('input-year').addEventListener('input', (e) => {
    window.DataStore.data.schoolInfo.academicYear = e.target.value;
    window.DataStore.saveDebounced();
    renderPreview();
  });
  function syncWeights() {
    const m = Number($('input-weight-mid').value) || 40;
    const d = Number($('input-weight-daily').value) || 60;
    window.DataStore.data.schoolInfo.weights.midterm = m;
    window.DataStore.data.schoolInfo.weights.daily = d;
    window.DataStore.saveDebounced();
    renderSubjectCards();
    renderPreview();
  }
  $('input-weight-mid').addEventListener('change', syncWeights);
  $('input-weight-daily').addEventListener('change', syncWeights);
  $('chk-homeroom').addEventListener('change', (e) => {
    window.DataStore.data.schoolInfo.showHomeroomLine = e.target.checked;
    window.DataStore.saveDebounced();
    renderPreview();
  });

  // —— 學生導覽 ——
  studentSelect.addEventListener('change', (e) => {
    currentStudentIndex = Number(e.target.value);
    loadStudentForm();
  });
  $('btn-prev-student').addEventListener('click', () => {
    if (currentStudentIndex > 0) { currentStudentIndex--; loadStudentForm(); }
  });
  $('btn-next-student').addEventListener('click', () => {
    if (currentStudentIndex < window.DataStore.data.students.length - 1) {
      currentStudentIndex++;
      loadStudentForm();
    }
  });
  $('btn-add-student').addEventListener('click', () => {
    const students = window.DataStore.data.students;
    const n = students.length + 1;
    const seat = String(n).padStart(2, '0');
    students.push(window.DataStore.normalizeStudent({
      seatNo: seat,
      chineseName: `${t('studentFallback')}${seat}`,
      englishName: `Student ${seat}`,
      classGrade: students[0]?.classGrade || 'Grade 4 / 401'
    }, n - 1));
    currentStudentIndex = students.length - 1;
    window.DataStore.saveImmediate();
    loadStudentForm();
    toast(`${t('toastAdded')} ${seat}`);
  });
  $('btn-delete-student').addEventListener('click', () => {
    const students = window.DataStore.data.students;
    if (students.length <= 1) { alert(t('alertKeepOne')); return; }
    const stu = students[currentStudentIndex];
    if (!confirm(`${t('confirmDelete')}「${stu.chineseName} ${stu.englishName}」？`)) return;
    students.splice(currentStudentIndex, 1);
    if (currentStudentIndex >= students.length) currentStudentIndex = students.length - 1;
    window.DataStore.saveImmediate();
    loadStudentForm();
    toast(t('toastDeleted'));
  });

  // —— 評語庫 ——
  function openCommentModal() {
    const stu = currentStudent();
    $('comment-bank-container').innerHTML = window.Comments.renderBankHtml(stu.englishName, stu.chineseName);
    $('comment-modal').classList.add('active');
    $('comment-bank-container').querySelectorAll('.comment-item-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        if (!activeCommentTarget) return;
        const g = ensureGrade(activeCommentTarget);
        g.comment = g.comment ? `${g.comment} ${text}` : text;
        const ta = subjectList.querySelector(`.comment-textarea[data-subj="${activeCommentTarget}"]`);
        if (ta) ta.value = g.comment;
        window.DataStore.saveDebounced();
        renderPreview();
        closeCommentModal();
        toast(t('toastInserted'));
      });
    });
  }
  function closeCommentModal() {
    $('comment-modal').classList.remove('active');
    activeCommentTarget = null;
  }
  $('comment-modal-close').addEventListener('click', closeCommentModal);
  $('comment-modal').addEventListener('click', (e) => { if (e.target === $('comment-modal')) closeCommentModal(); });

  // —— 批次匯入 ——
  $('btn-batch-import').addEventListener('click', () => $('batch-modal').classList.add('active'));
  $('batch-modal-close').addEventListener('click', () => $('batch-modal').classList.remove('active'));
  $('btn-batch-cancel').addEventListener('click', () => $('batch-modal').classList.remove('active'));
  $('btn-batch-submit').addEventListener('click', () => {
    const raw = $('batch-textarea').value.trim();
    if (!raw) return;
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    const classGrade = window.DataStore.data.students[0]?.classGrade || 'Grade 4 / 401';
    const newStudents = lines.map((line, idx) => {
      const parts = line.split(/\s+/);
      let seatNo = String(idx + 1).padStart(2, '0');
      let cName = '';
      let eName = '';
      if (/^\d+$/.test(parts[0])) {
        seatNo = String(parts[0]).padStart(2, '0');
        cName = parts[1] || `${t('studentFallback')}${seatNo}`;
        eName = parts.slice(2).join(' ') || '';
      } else {
        cName = parts[0] || `${t('studentFallback')}${seatNo}`;
        eName = parts.slice(1).join(' ') || '';
      }
      return window.DataStore.normalizeStudent({
        seatNo, chineseName: cName, englishName: eName, classGrade, grades: {}
      }, idx);
    });
    window.DataStore.data.students = newStudents;
    currentStudentIndex = 0;
    window.DataStore.saveImmediate();
    loadStudentForm();
    $('batch-modal').classList.remove('active');
    $('batch-textarea').value = '';
    toast(`${t('toastBatch')} ${newStudents.length}`);
  });

  // —— 列印 / 備份 ——
  $('btn-print-current').addEventListener('click', () => {
    previewMode = 'current';
    renderPreview();
    setTimeout(() => window.print(), 80);
  });
  $('btn-print-all').addEventListener('click', () => {
    const n = window.DataStore.data.students.length;
    if (!confirm(`${t('confirmPrintAll')} ${n} ${t('confirmPrintAllQ')}`)) return;
    previewMode = 'all';
    renderPreview();
    setTimeout(() => {
      window.print();
      previewMode = 'current';
      renderPreview();
    }, 120);
  });
  $('btn-export-json').addEventListener('click', () => {
    window.DataStore.exportJsonFile();
    toast(t('toastExported'));
  });
  $('file-import-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await window.DataStore.importJsonFile(file);
      currentStudentIndex = 0;
      loadStudentForm();
      toast(t('toastImported'));
    } catch (err) {
      alert(t('importFail') + err.message);
    }
    e.target.value = '';
  });
  $('btn-reset-sample').addEventListener('click', async () => {
    if (!confirm(t('confirmSample'))) return;
    await window.DataStore.resetToSample();
    currentStudentIndex = 0;
    loadStudentForm();
    toast(t('toastSample'));
  });

  // —— 自訂科目 ——
  $('btn-add-subject').addEventListener('click', () => {
    const name = ($('input-new-subj-name').value || '').trim();
    const chineseName = ($('input-new-subj-zh').value || '').trim();
    const category = $('select-new-subj-cat').value || 'other';
    if (!name) {
      alert(t('alertSubjectName'));
      $('input-new-subj-name').focus();
      return;
    }
    try {
      window.DataStore.addCustomSubject({ name, chineseName, category, enabled: true });
      $('input-new-subj-name').value = '';
      $('input-new-subj-zh').value = '';
      $('select-new-subj-cat').value = 'other';
      renderSubjectsConfig();
      renderSubjectCards();
      renderPreview();
      refreshSelector();
      toast(t('toastSubjectAdded') + '「' + name + '」');
    } catch (err) {
      alert(t('alertSubjectName'));
    }
  });
  $('input-new-subj-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); $('btn-add-subject').click(); }
  });

  $('edit-subject-close').addEventListener('click', closeEditSubjectModal);
  $('btn-edit-subject-cancel').addEventListener('click', closeEditSubjectModal);
  $('edit-subject-modal').addEventListener('click', (e) => {
    if (e.target === $('edit-subject-modal')) closeEditSubjectModal();
  });
  $('btn-edit-subject-save').addEventListener('click', () => {
    const id = $('edit-subj-id').value;
    const name = ($('edit-subj-name').value || '').trim();
    if (!name) {
      alert(t('alertSubjectName'));
      return;
    }
    try {
      window.DataStore.updateSubject(id, {
        name,
        chineseName: ($('edit-subj-zh').value || '').trim(),
        category: $('edit-subj-cat').value || 'other'
      });
      closeEditSubjectModal();
      renderSubjectsConfig();
      renderSubjectCards();
      renderPreview();
      toast(t('toastSubjectRenamed'));
    } catch (err) {
      alert(t('alertSubjectName'));
    }
  });

  // —— 縮放 ——
  $('btn-zoom-in').addEventListener('click', () => setZoom(currentZoom + 0.06));
  $('btn-zoom-out').addEventListener('click', () => setZoom(currentZoom - 0.06));
  $('btn-zoom-reset').addEventListener('click', () => setZoom(0.72));

  window.DataStore.onChange((type) => {
    if (String(type).startsWith('saved:')) {
      saveStatusText.textContent = t('saveAuto') + ' ' + String(type).slice(6);
    }
  });

  window.addEventListener('afterprint', () => {
    if (previewMode !== 'current') {
      previewMode = 'current';
      renderPreview();
    }
  });

  setZoom(currentZoom);
  refreshCategorySelects();
  loadStudentForm();
});
