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
