# BUILD_NOTES — wilson-grade-v2 vs seed

## 相對 seed（`/workspace/wilson-grade`）的改動

1. **全新版面，不沿用跑版樣式**  
   - Mobile-first：手機表單在上、預覽在下；≥960px 左右並排。  
   - 大觸控目標（約 44px）、高對比、頂部操作列可換行。  
   - 預覽用 CSS 變數 `--preview-scale` 縮放，避免 seed 的 transform 與列印選擇器不一致。

2. **模組檔名對齊規格**  
   - `js/report-template.js` → `js/report.js`（`ReportRenderer`）  
   - `js/comment-bank.js` → `js/comments.js`（`COMMENT_BANK` + `Comments`）  
   - `localStorage` key 改為 `wilson_grade_report_data_v2`，避免舊暫存污染。

3. **成績單對齊照片結構**  
   - 徽章置中 → 校名 → 學年度 → 可編輯 term（預設 Midterm）→ 中文+英文姓名置中。  
   - 表頭：Subject | Midterm Exam (40%) | Daily Perf. (60%) | Overall Grade | Conduct×4 | Teacher Assessment。  
   - 交替列底色、操行格笑臉、簽名在末頁。  
   - 預設科目含 Music / Art / Health / G.P. / Phonics / 作文 / **中唱** / 中社（seed 的「中閩」改為照片註記的中唱）。

4. **教師選項補強**  
   - 每生旗標：國際生、操行 Independent、IXL 附註、MAP 列印註記。  
   - 可開關「導師」簽名欄；科目可勾選顯示。  
   - 比重與學期標題可改，即時反映在預覽。

5. **Alice 示範資料**  
   - LA 83/93/88、Math 100/90/95、WSS 88/92/90，操行全優，評語對齊照片 gist；其餘科目補齊合理分數。

6. **列印 CSS**  
   - `@page { size: A4 landscape }`；隱藏 `.no-print`。  
   - Seed 的 print 選擇器對應舊 class（如 `.workbench-header`），v2 改為與實際 DOM 一致。  
   - `tr { break-inside: avoid }` 減少列中切斷；實際效果仍依瀏覽器。

## 已知列印限制

- 必須手動選 **A4 橫向**，並開啟 **背景圖形**，交替列與表頭底色才會印出。  
- 表情符號在部分印表機／PDF 驅動可能變成黑白或替代字型；建議先「另存 PDF」預覽。  
- 科目極多且評語很長時，單頁高度仍可能擠壓；系統最多拆 **2 頁**，若仍溢出請縮短評語或關閉部分科目。  
- `file://` 開啟時，若瀏覽器阻擋 `fetch('sample-data.json')`，會改用內建 fallback；正式使用建議以本機靜態伺服器或 Netlify 開啟。  
- 全班連印會短暫把所有學生報表掛入預覽再 `window.print()`；列印結束後還原單人預覽。

## 驗收提示

開啟 `index.html` → 應見 Alice 報表接近照片表結構 → 縮視窗確認表單可捲動 → 列印預覽應套用 `print.css`。

---

## 2026-09-16 更新（國際化介面 + EE/ME 等級）

1. **移除笑臉**：輸入區與列印成績單改為 EE / ME / AE / BE 字母徽章（圓角 pill）。
2. **等級遷移**：`store.normalize` 將 excellent→ee、good→me、satisfactory→ae、warning/needs-improvement→be；舊 localStorage v2 不崩潰。
3. **繁中｜English**：新增 `js/i18n.js`；`App.setLocale` 重繪表單與預覽；locale 存 `wilson_grade_locale_v2`。zh 成績單表頭維持英主中輔；en 純英文欄名。表下附等級圖例。
4. **溢出修正**：`.conduct-picker-row` 用 `minmax(0,1fr)` 網格 + `.level-btn-group { flex-wrap }`；窄卡 2×2；`min-width:0` / `overflow:hidden` 防止貼出白卡。
5. **視覺**：海軍藍／白、圓角卡片、較大內距；列印徽章緊湊、`tr { break-inside:avoid }`。
6. Alice 示範資料操行改為 `ee`（第二位樣本含 `me`）。

---

## 2026-09-16 更新（自訂科目）

1. **Custom subjects**：ADD / RENAME / DELETE / REORDER；id=`custom_<timestamp>`；category=`core|special|chinese|other`；可選 `chineseName`。
2. 新增時為每位學生建立空成績；刪除時移除對應 grades；順序由 `availableSubjects` 陣列決定，報表已尊重順序。
3. i18n 新增科目相關 zh/en 字串；列印表頭海軍藍 banner、徽章間距、簽名列 Date 提示。
4. 科目卡溢出：`minmax(0,1fr)`、`overflow-wrap`、`#subject-list { min-width:0 }`。

---

## 2026-09-16 更新（Quiet Ledger 成績單）

1. **Quiet Ledger 設計語彙**：`:root` 新增 navy / ink / gold / EE–BE 色票與 `pt` 字級變數；舊 `--primary` / `--gold` 映射到新色。
2. **表頭**：移除厚海軍藍 banner；左 crest + 英文校名大、中文「威爾森國際小學」小；金 1pt + 海軍 0.5pt 雙線；右上 Page n/m；學生英文主、中文輔，班級／學號靠右。
3. **表頭欄位**：`<span class="th-en">` + `<span class="th-zh">`（zh 顯示雙語；en 僅英文）。
4. **背景**：`assets/report-bg.png`（1754×1240）經 `--report-bg` 套在 `.report-sheet.has-bg`，`background-size: 100% 100%`；表頭／表格半透明底以利底圖透出。
5. **列印**：`@page { size: A4 landscape; margin: 8mm 10mm; }`；徽章用 Quiet Ledger EE/ME/AE/BE 色；`print-color-adjust: exact`。
6. **未破壞**：自訂科目 CRUD、i18n、localStorage key 均未改動。

---

## 2026-09-16 ChatGPT Modern International Academy

1. **Print + preview redesign** per `CHATGPT_DESIGN_SPEC.md`: warm paper `#FCFBF7`, navy `#17376D`, academic blue `#4E83D1`, gold accent sparingly, Overall `#FFF5D9`.
2. **Header**: crest left · school EN + 威爾森國際小學 · big MIDTERM PROGRESS REPORT + 期中學習成績報告 · academic year/term right; student meta band (name / grade / ID / date).
3. **Two-level table header**: group row ACADEMIC PROGRESS / LEARNING HABITS / TEACHER ASSESSMENT; sub-row Midterm·Daily·Overall + 4 habits; EN primary + ZH secondary.
4. **Habits**: quiet navy EE/ME/AE/BE codes on light blue chips (no colorful emoji pills / smileys).
5. **Legend band** + signature lines (Teacher / Director / Principal, optional Homeroom); fonts Inter + Noto Sans TC (not Times New Roman).
6. **Watermark**: dropped Quiet Ledger `report-bg.png` reliance; optional very light crest `::before` (~3% opacity).
7. **Preserved**: custom subjects CRUD, zh/en i18n, EE|ME|AE|BE model, localStorage + JSON, Alice sample, 1–2 page split (≤8 / page), Netlify static.
