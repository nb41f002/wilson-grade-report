/**
 * Grade-level → subject visibility STUB.
 * Official table columns TBD from classmate; heuristics only until then.
 *
 * Does NOT delete custom subjects — only toggles `enabled` on known ids / name matches.
 * Custom subjects (id starting with custom_) are left untouched.
 */
window.GradeSubjects = {
  /**
   * @type {Record<string, {disableIds?: string[], disableNameRe?: RegExp[]}>}
   */
  STUB_MAP: {
    // Lower grades: hide denser Chinese writing / mid-high social; keep phonics
    '1': {
      disableIds: ['writing', 'singing', 'social', 'wss'],
      disableNameRe: [/作文/, /writing/i, /中社/, /western\s*social/i]
    },
    '2': {
      disableIds: ['writing', 'social'],
      disableNameRe: [/作文/, /writing/i, /中社/]
    },
    '3': { disableIds: [], disableNameRe: [] },
    '4': { disableIds: [], disableNameRe: [] },
    // Upper: phonics often dropped
    '5': {
      disableIds: ['phonics'],
      disableNameRe: [/phonics/i, /拼音/]
    },
    '6': {
      disableIds: ['phonics'],
      disableNameRe: [/phonics/i, /拼音/]
    }
  },

  parseGrade(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    const m = raw.match(/([1-6])/);
    return m ? m[1] : null;
  },

  /**
   * Apply stub enable/disable. Preserves _gradeStubPrevEnabled for restore.
   * @returns {{changed: number, grade: string|null}}
   */
  applyToSubjects(subjects, gradeValue) {
    const grade = this.parseGrade(gradeValue);
    const list = subjects || [];
    let changed = 0;

    list.forEach((subj) => {
      if (!subj || !subj.id) return;
      if (String(subj.id).startsWith('custom_')) return;

      if (subj._gradeStubPrevEnabled === undefined) {
        subj._gradeStubPrevEnabled = subj.enabled !== false;
      }

      if (!grade) {
        const next = !!subj._gradeStubPrevEnabled;
        if ((subj.enabled !== false) !== next) {
          subj.enabled = next;
          changed += 1;
        }
        return;
      }

      const rule = this.STUB_MAP[grade] || { disableIds: [], disableNameRe: [] };
      const idHit = (rule.disableIds || []).includes(subj.id);
      const label = `${subj.name || ''} ${subj.chineseName || ''}`;
      const reHit = (rule.disableNameRe || []).some((re) => re.test(label));
      const shouldDisable = idHit || reHit;
      const next = shouldDisable ? false : !!subj._gradeStubPrevEnabled;
      if ((subj.enabled !== false) !== next) {
        subj.enabled = next;
        changed += 1;
      }
    });

    return { changed, grade };
  }
};
