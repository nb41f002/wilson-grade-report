# 雙語小學橫式成績報告系統 v2

專為 Wilson International Elementary School 教師設計的 **A4 橫式** 期中成績報告登記與列印工具。  
介面為繁體中文；成績單科目與評語為英文（中文科目可顯示中文）。

**教師：** 葉容辰（nb41f002）

---

## 快速開始

1. 用 Chrome / Edge / Safari 直接開啟 `index.html`（免安裝）。
2. 首次開啟會載入示範資料（林詩穎 Alice，分數對齊實體成績單照片）。
3. 左側輸入、右側即時預覽；手機直向堆疊、桌面左右並排。

### 部署到 Netlify

- 已附 `netlify.toml`，Publish directory 為 `.`，無需 Build。
- 可將資料夾拖到 [Netlify Drop](https://app.netlify.com/drop)，或連結 Git 儲存庫部署。

---

## 主要功能

| 功能 | 說明 |
|------|------|
| 成績試算 | 期中考預設 40%、平時 60%，總評自動計算；可勾「手動」覆寫 |
| 操行笑臉 | Performance / Teamwork / Assignment / Behavior → 😀 🙂 😐 😟 |
| 評語庫 | 插入片語，`[Name]` 自動換成學生英文名 |
| 名單 | 貼上批次匯入、切換學生、進度條 |
| 暫存 | `localStorage` 自動儲存；可匯出／讀取 JSON 備份 |
| 列印 | 列印目前學生或全班連印；`@page` A4 landscape |
| 科目 | 可勾選顯示：LA、Math、WSS、Music、Art、Health、G.P.、Phonics、作文、中唱、中社 |
| 選項 | 學期標題可改（預設 Midterm）、國際生／操行 Independent／IXL／MAP 註記、導師簽名欄 |

科目較多時自動拆成最多 **2 頁**；簽名欄（導師／Teacher／Director／Principal）在最後一頁。

---

## 列印提醒

1. 列印對話框選擇 **A4**、**橫向（Landscape）**。
2. 開啟 **背景圖形／Background graphics**，才能印出表頭底色與交替列底色。
3. 邊界建議「預設」或「最小」；若瀏覽器裁切，可再縮小邊界。
4. Chrome：更多設定 → 勾選「背景圖形」。

---

## 資料備份

- 頂端 **匯出 JSON** 下載全班資料。
- **讀取備份** 選同一格式的 JSON 還原。
- 資料存在瀏覽器本機；清除網站資料會遺失，請定期匯出。

---

## 檔案結構

```
wilson-grade-v2/
├── index.html
├── netlify.toml
├── sample-data.json
├── README.md
├── BUILD_NOTES.md
├── css/app.css
├── css/print.css
├── js/store.js
├── js/report.js
├── js/comments.js
├── js/app.js
└── assets/wilson-crest.svg
```

無需建置步驟；純靜態 HTML／CSS／JS。
