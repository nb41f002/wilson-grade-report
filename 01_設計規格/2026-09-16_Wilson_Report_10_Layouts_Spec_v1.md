# Wilson International Elementary School
## A4 成績單 10 套版面規格 v1.0

**專案目的**  
此規格用於「Wilson International Elementary School｜威爾森國際小學」雙語小學期中成績單列印系統。  
資料欄位與計算邏輯不變；本次只重新定義 **5 個 Theme × 2 個 Orientation = 10 個真正不同的版面模板**。

---

# 0. 共通規則（所有主題必須遵守）

## 0.1 Theme / Orientation ID

```ts
type ReportTheme =
  | "formal"
  | "playful"
  | "fashion"
  | "pro"
  | "classical";

type ReportOrientation =
  | "landscape"
  | "portrait";
```

建議根節點：

```html
<article
  class="report"
  data-theme="formal"
  data-orientation="landscape"
>
  ...
</article>
```

---

## 0.2 固定資料欄位

所有版型使用同一份資料，不得改動資料 schema：

- Subject
- Midterm 40%
- Daily 60%
- Overall
- Learning Habits
  - Performance
  - Teamwork
  - Assignment
  - Behavior
- Habit code 僅能：`EE / ME / AE / BE`
- Teacher Assessment
- Student Name
- Grade & Class
- Student ID
- Academic Year
- Term / Report Type
- Signatures

**禁止**用 smiley / emoji 取代 EE / ME / AE / BE。

---

## 0.3 A4 尺寸與可用範圍

### Landscape
- 紙張：297 × 210 mm
- Page margin：上/下 8 mm；左/右 10 mm
- **Content box：277 × 194 mm**

```css
@page report-landscape {
  size: A4 landscape;
  margin: 8mm 10mm;
}
```

### Portrait
- 紙張：210 × 297 mm
- Page margin：上/下 10 mm；左/右 11 mm
- **Content box：188 × 277 mm**

```css
@page report-portrait {
  size: A4 portrait;
  margin: 10mm 11mm;
}
```

---

## 0.4 頁數與溢位規則

1. 成績單最多 2 頁。
2. 不硬編碼「第 8 科一定換頁」，應以實際 rendered height 分頁。
3. 第 1 頁保留完整主表頭。
4. 第 2 頁使用各主題自己的 compact continuation header。
5. Legend 與 Signatures 只出現在**最後一頁**。
6. Teacher Assessment 的單一科目 block **不可跨頁切半**。
7. 如果第 2 頁仍溢位：
   - 先進入 `compact-print`：
     - body font 最低 6.8pt
     - assessment line-height 最低 1.18
     - row vertical padding 最低 1.2mm
   - 若仍超過兩頁，UI 顯示：
     **「內容超過兩頁，請縮短評語或減少列印科目。」**
   - 不允許默默裁切內容。

---

## 0.5 列印共通設定

```css
* {
  box-sizing: border-box;
}

.report {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

thead {
  display: table-header-group;
}

tr,
.subject-block,
.assessment-block {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

所有背景填色應保持淡色；accent 視覺面積原則上 ≤ 10%。

---

# 1. FORMAL / LANDSCAPE
## ID：`formal + landscape`

### 定義
**維持現況。**  
現有 Modern International Academy（MIA）橫式版即為正式預設，不重做 composition。

### 版面位置
- Header：維持目前
- Student info band：維持目前
- 雙層表格：維持目前
- Overall 淡金底：維持目前
- Footer / Page continuation：維持目前
- Page 2 compact header：維持目前

### DOM
沿用目前 production DOM，不需重構。

### Page 1 → Page 2
維持目前：
- Page 1：full header + student info + subject table
- Page 2：compact school name + `MIDTERM PROGRESS REPORT — CONTINUED` + student name/class
- Signatures / legend：最後一頁

### SVG
- 可保留現有極淡校徽 watermark
- opacity 建議 0.025–0.035
- 不新增其他裝飾

---

# 2. FORMAL / PORTRAIT
## ID：`formal + portrait`

### 核心風格
MIA 的直式「正式學籍報告版」，不是把橫式九欄表縮窄。

## 2.1 版面座標（Content box 188 × 277 mm）

### Header：0–30 mm
- Logo：x 0–18 mm；y 2–20 mm
- School name：x 22–95 mm；y 3–16 mm
- Report title：x 22–150 mm；y 17–29 mm
- Academic year / term：x 150–188 mm；y 3–27 mm，右對齊

### Student Info：32–52 mm
- 188 × 18 mm 淡藍資訊帶
- 2 × 2 grid：
  - Student：0–94 mm
  - Grade & Class：94–188 mm
  - ID：0–94 mm
  - Date / Term：94–188 mm

### Academic Progress：56–122 mm
Full width。
4 欄：
- Subject：42%
- Midterm：18%
- Daily：18%
- Overall：22%

### Learning Habits：126–184 mm
Full width matrix：
- Subject：42%
- Performance：14.5%
- Teamwork：14.5%
- Assignment：14.5%
- Behavior：14.5%

### Teacher Assessment：188–249 mm
改為 list，不再塞成最右一欄：

```text
LANGUAGE ARTS
Alice is a highly motivated...

MATHEMATICS
Alice achieved...
```

每科：
- Subject label 8pt bold
- Assessment 7.2–7.8pt
- block 間隔 2mm

### Legend + Signatures：252–277 mm
若 1 頁能放：
- Legend：252–260
- Signatures：263–277

若 2 頁：
- 第 1 頁不顯示 legend / signatures
- 全部移至第 2 頁底部

## 2.2 DOM

```html
<article class="formal-portrait">
  <header class="formal-header"></header>
  <section class="student-meta-grid"></section>

  <section class="academic-section">
    <table class="academic-table"></table>
  </section>

  <section class="habits-section">
    <table class="habits-table"></table>
  </section>

  <section class="assessment-list">
    <article class="assessment-block"></article>
  </section>

  <section class="habit-legend"></section>
  <footer class="report-signatures"></footer>
</article>
```

## 2.3 Page 2
Compact header 14 mm：
- 左：Wilson International Elementary School
- 下：MIDTERM PROGRESS REPORT — CONTINUED
- 右：Alice · Grade 4 / 401 · Page 2/2
- 下方 0.5pt navy rule

Page 2 接續 `assessment-list`，必要時再接 habits。
Final 22–26 mm 固定給 legend + signatures。

## 2.4 SVG
- `formal-crest-watermark.svg`
- 置於右下或中右
- 最大 62 × 62 mm
- opacity 0.025

---

# 3. PLAYFUL / LANDSCAPE
## ID：`playful + landscape`

### 核心風格
「Learning Journey」：國際小學 portfolio 感。  
**真正改 composition：左側 identity rail + 右側模組化學習區。**

## 3.1 版面座標（277 × 194 mm）

### 左側 Identity Rail：0–58 mm
寬 58 mm，全高。

內容：
- Logo：x 5–23；y 6–24
- School name：x 5–52；y 28–43
- 大標題：
  - `MIDTERM`
  - `LEARNING REPORT`
  - x 5–52；y 52–78
- Student：
  - Alice
  - Grade 4 / 401
  - W114028
  - y 91–116
- Academic year / term：y 128–148
- 下方只放 1 個簡單幾何 SVG，不放人物

Rail 背景：paper white。
左上可有淡幾何色塊，但總面積 ≤ 8%。

### 右側 Main：64–277 mm（寬 213 mm）

#### Student Strip：y 0–18 mm
簡化，只顯示：
- Student
- Class
- Report
- Date

因左 rail 已有完整身份，不需重複太多。

#### Academic Progress：y 24–83 mm
獨立 table，不含 habits/comments。
欄寬：
- Subject 46%
- Midterm 17%
- Daily 17%
- Overall 20%

#### Learning Habits：y 88–133 mm
獨立 matrix。
- Subject 46%
- 4 habits 平分 54%

Habit code 可使用 9–10mm 寬的淡色文字 badge，但只寫 EE/ME/AE/BE。

#### Teacher Assessment：y 138–194 mm
兩欄 assessment list：
- Left column：x 64–168
- Right column：x 173–277
- 每科 block 高度依文字
- Subject label 可用 2mm 小 accent bar

**重要：Playful 不使用同一張九欄表。**

## 3.2 DOM

```html
<article class="playful-landscape">
  <aside class="identity-rail"></aside>

  <main class="learning-main">
    <section class="student-strip"></section>
    <section class="academic-panel"></section>
    <section class="habits-panel"></section>
    <section class="assessment-grid"></section>
  </main>
</article>
```

## 3.3 Page 1 → Page 2

Page 1：
- identity rail 保留完整
- Academic + Habits 優先完整
- Assessment 接到可用高度

Page 2：
- 左 rail 縮為 32 mm：
  - Logo
  - `CONTINUED`
  - Alice / Grade
- 右側 239 mm 接續 assessments
- Legend + signatures 放 Page 2 底部 25 mm

若 1 頁：
- legend/signatures 放主區最底 22–25mm

## 3.4 SVG 飾件
1. `playful-arc-dots.svg`
   - 左 rail 左下
   - 32 × 28 mm
   - 1–2 色，opacity 0.25
2. `playful-half-circle.svg`
   - 左上角，20 × 20 mm
   - 淡杏色
3. `playful-mini-wave.svg`
   - section title 旁，18 × 3 mm
   - 僅線條
4. 禁止人物、火箭、彩虹、emoji

---

# 4. PLAYFUL / PORTRAIT
## ID：`playful + portrait`

### 核心風格
「Primary School Learning Portfolio」：模組卡片式，但仍正式。

## 4.1 版面座標（188 × 277 mm）

### Hero Header：0–48 mm
- 左上 logo：0–17 × 3–20
- school name：22–110 × 3–18
- 大標題：0–145 × 23–45
  - MIDTERM
  - LEARNING REPORT
- 右上 term/year：145–188 × 4–23
- Hero 右下可放淡抽象半圓 SVG

### Student Card：52–78 mm
188 × 24 mm，2 × 2：
- Alice
- Grade 4 / 401
- W114028
- Date

圓角 5–6px。
背景淡 sky。

### Academic Score Table：82–142 mm
4 欄：
- Subject 44%
- Midterm 18%
- Daily 18%
- Overall 20%

### Habits Grid：146–202 mm
每科為一列：
- Subject 44%
- P / T / A / B，各 14%

### Assessment Cards：206–258 mm
單欄卡片串列：
- 不是每科大白卡；以薄分隔線分段
- Subject 7.8pt bold
- assessment 7.1pt
- 左側小色 bar 2mm

### Legend / Signatures：261–277 mm
若空間不足則移到第二頁。

## 4.2 DOM

```html
<article class="playful-portrait">
  <header class="playful-hero"></header>
  <section class="student-card"></section>
  <section class="score-table"></section>
  <section class="habit-grid"></section>
  <section class="assessment-stack"></section>
  <section class="habit-legend"></section>
  <footer class="report-signatures"></footer>
</article>
```

## 4.3 Page 2
上方 18 mm compact hero：
- 左：logo + Wilson International Elementary School
- 中：LEARNING REPORT — CONTINUED
- 右：Alice / Page 2 of 2

Assessment stack 接續。
Final 25 mm = legend + signatures。

## 4.4 SVG
1. `playful-orbit.svg`
   - Hero 右上/右下，30×22 mm
2. `playful-dots.svg`
   - Student card 一角，20×12 mm
3. `playful-wave-divider.svg`
   - section header 下方，24×3 mm
4. 所有 SVG 僅 1–2 色，無卡通物件

---

# 5. FASHION / LANDSCAPE
## ID：`fashion + landscape`

### 核心風格
真正 Editorial Report。  
**不使用傳統「校徽＋中央標題＋一張大表格」構圖。**

## 5.1 版面座標（277 × 194 mm）

### Editorial Masthead Column：0–68 mm
寬 68 mm。

- 小校徽：4–17 × 4–17
- WILSON INTERNATIONAL：4–61 × 21–32
- 大標：
  - `MIDTERM`
  - `PROGRESS`
  - `REPORT`
  - x 4–64；y 45–90
  - 22–26pt
- 期別超大數字：
  - `01` 或 `MID`
  - y 98–128
  - outline / 5% tint，不可深底滿版
- Student：
  - Alice
  - Grade 4 / 401
  - y 142–165
- 頁碼：y 184–194

### Main Content：76–277 mm（201 mm）

#### Academic Performance：0–66 mm
不要外框 table。
使用 editorial ruled list：

```text
LANGUAGE ARTS          83     93       88
MATHEMATICS           100     90       94
```

欄位位置固定：
- subject 0–96 mm
- midterm 98–127
- daily 128–157
- overall 160–201

只用水平線。

#### Learning Habits：72–116 mm
Matrix：
- subject 0–102
- P/T/A/B 其餘四欄
- header 使用 6.5pt uppercase

#### Teacher Assessment：122–177 mm
2 欄 editorial text：
- 0–96 mm
- 105–201 mm

#### Signature line：181–194 mm
三組超細線簽名，可在單頁時出現。

## 5.2 DOM

```html
<article class="fashion-landscape editorial-grid">
  <aside class="editorial-masthead"></aside>

  <main class="editorial-content">
    <section class="editorial-academic"></section>
    <section class="editorial-habits"></section>
    <section class="editorial-assessments"></section>
    <footer class="editorial-signatures"></footer>
  </main>
</article>
```

**不得復用 Formal 的 `.report-table` 九欄 DOM。**

## 5.3 Page 2
Page 2 masthead column 縮成 42 mm。
內容：
- Logo
- `REPORT / 02`
- Alice
- Page 2

主內容寬 227 mm。
接 assessments / overflow rows。
最後 22 mm 放 legend + signatures。

## 5.4 SVG
1. `fashion-editorial-bracket.svg`
   - Masthead title 左側
   - 4 × 38 mm
2. `fashion-number-outline.svg` 可不做檔案，CSS text 亦可
3. `fashion-rule-mark.svg`
   - section heading 後 8×2mm
4. 不要花紋、不用插圖、不用大面積背景圖

---

# 6. FASHION / PORTRAIT
## ID：`fashion + portrait`

### 核心風格
Asymmetric Magazine Page：左側垂直識別帶 + 右側大排版。

## 6.1 版面座標（188 × 277 mm）

### Vertical Edge Band：0–15 mm
全高。
- paper 保持白
- 只使用 1.5–2mm cobalt line 或超淡色塊
- y 15–88 mm 放：
  `WILSON / REPORT / 2026`
  可用旋轉 90° 的短詞，不使用長句

### Main：21–188 mm（167 mm）

#### Masthead：0–54 mm
- logo：0–16 × 2–18
- school name：21–126 × 4–18
- 大標題：
  `MIDTERM`
  `PROGRESS REPORT`
  x 0–150；y 23–52
- term/year：126–167 × 4–19

#### Student Metadata：58–82 mm
不做色塊。
4 個 metadata cell 以 typography + bottom rule 區分。

#### Academic Performance：87–151 mm
4 欄 ruled list。
不做 box。

#### Learning Habits：157–207 mm
5 欄 matrix。

#### Teacher Assessment：212–262 mm
單欄 editorial blocks。
Subject 使用 serif / small caps。
comment 使用 sans。

#### Footer：265–277 mm
page no / signature short line。
若 2 頁，正式 signatures 置第 2 頁。

## 6.2 DOM

```html
<article class="fashion-portrait">
  <aside class="vertical-brand-band"></aside>

  <main class="fashion-page-main">
    <header class="fashion-masthead"></header>
    <section class="fashion-meta"></section>
    <section class="fashion-score-list"></section>
    <section class="fashion-habit-matrix"></section>
    <section class="fashion-assessment-list"></section>
    <footer class="fashion-footer"></footer>
  </main>
</article>
```

## 6.3 Page 2
保留 15mm 左 edge band。
Top 13mm：
- `MIDTERM PROGRESS REPORT / CONTINUED`
- Alice / Grade 4 / 401 / 2 of 2

內容接續 assessment list。
底部 24mm 放 legend + 三簽名。

## 6.4 SVG
1. `fashion-corner-notch.svg`
   - 右上角 8×8mm
2. `fashion-editorial-dot.svg`
   - section title small marker 2×2mm
3. 其餘使用 CSS lines，不使用 decorative background

---

# 7. PROFESSIONAL / LANDSCAPE
## ID：`pro + landscape`

### 核心風格
Institutional / Accreditation Report。  
**左側 profile rail，右側 report body；幾乎無裝飾。**

## 7.1 版面座標（277 × 194 mm）

### Profile Rail：0–52 mm
- 背景：#F3F5F6 或非常淡灰藍
- Logo：6–23 × 6–23
- School：6–46 × 27–43
- Document code：6–46 × 54–69
  - MIDTERM REPORT
- Student metadata：6–46 × 82–125
- Academic Year / Term：6–46 × 136–156
- Page no：6–46 × 180–190

### Report Body：60–277 mm（217 mm）

#### Body Header：0–22 mm
- `ACADEMIC PROGRESS REPORT`
- 中文小副標
- thin rule

#### Academic：27–82 mm
4 欄完整 grid。
沒有卡片、沒有圓角。

#### Habits：87–128 mm
5 欄 matrix。
EE/ME/AE/BE 僅純文字，不做 pill。

#### Assessments：133–181 mm
2 欄 text log。
Subject label 使用 7.5pt bold。
每 block 只用 0.5pt separator。

#### Signature strip：183–194 mm
若單頁，底部三條線。
若兩頁則移除，放第二頁。

## 7.2 DOM

```html
<article class="pro-landscape">
  <aside class="pro-profile-rail"></aside>

  <main class="pro-report-body">
    <header class="pro-body-header"></header>
    <section class="pro-academic"></section>
    <section class="pro-habits"></section>
    <section class="pro-assessments"></section>
    <footer class="pro-signatures"></footer>
  </main>
</article>
```

## 7.3 Page 2
Profile rail 52 mm 繼續，但資訊縮減：
- Logo
- `CONTINUED`
- Alice / Grade
- Page 2

Body top 14mm continuation header。
Assessment overflow。
Final 22mm legend + signatures。

## 7.4 SVG
**不需要主要 SVG 飾件。**

可選：
- `pro-micro-mark.svg`
  - 2×2mm small square/cross
  - section title marker
  - 單色
但可完全不使用。

---

# 8. PROFESSIONAL / PORTRAIT
## ID：`pro + portrait`

### 核心風格
正式行政／顧問報告，採「文件 section」排列，不採卡片式。

## 8.1 版面座標（188 × 277 mm）

### Institutional Header：0–27 mm
- Logo：0–15 × 3–18
- school：20–123 × 3–14
- title：20–150 × 15–26
- term / year：150–188 × 3–24

### Student Metadata Table：31–58 mm
188 × 25 mm
兩列兩欄。
使用 0.5pt border，方角。

### Academic Results：63–127 mm
4 欄 grid：
- Subject 44%
- Midterm 18%
- Daily 18%
- Overall 20%

### Learning Habits：132–184 mm
5 欄 grid：
- Subject 44%
- P/T/A/B 各14%

### Assessment Log：189–250 mm
table-like list：
- 左側 Subject 38mm
- 右側 Assessment 150mm
- 每科以底線區隔
- 不做圓角 card

### Legend + Signature：254–277 mm
若 2 頁移到最後一頁。

## 8.2 DOM

```html
<article class="pro-portrait">
  <header class="institutional-header"></header>
  <table class="pro-meta-table"></table>
  <section class="pro-results-grid"></section>
  <section class="pro-habits-grid"></section>
  <section class="pro-assessment-log"></section>
  <section class="habit-legend"></section>
  <footer class="pro-signatures"></footer>
</article>
```

## 8.3 Page 2
上方 12mm：
- School name 左
- REPORT — CONTINUED 中
- Alice / Page 2 右
- 1px graphite rule

接 assessment log。
Legend/signatures 固定於最後 25mm。

## 8.4 SVG
無必要裝飾。
若使用，只允許：
- `pro-rule-end.svg`
- 5×2mm
- section rule 尾端
- 單色灰藍

---

# 9. CLASSICAL / LANDSCAPE
## ID：`classical + landscape`

### 核心風格
European Private Academy / Certificate Ledger。  
目前 Classical 是正確方向，但要進一步變成真正獨立 composition。

## 9.1 外框
Content box 277 × 194 mm。

在 content box 內：
- Outer frame：inset 0 mm
- Inner frame：inset 3 mm
- Corner ornaments：四角各 14–16mm
- 所有線條 0.5–1pt
- 無深色滿版背景

實際主內容 safe box：
**8–269 mm × 8–186 mm**

## 9.2 Header：y 8–46 mm
採中央 crest 構圖：

- Crest：中心 x 128–149；y 9–27
- School：中心對齊；y 28–35
- 中文校名：y 35–39
- ornament divider：y 40–42
- MIDTERM PROGRESS REPORT：y 43–50

Academic year / term：
- 右上 safe corner x 223–264；y 10–25
- 小字，不搶 crest

### Student Ledger：y 54–75 mm
不做藍色 bar。
使用 4 欄文字 ledger：
- Student 25%
- Grade 25%
- ID 25%
- Date 25%
上、下各 0.5pt antique line。

### Main Results Table：y 80–142 mm
仍可維持 9 欄，但 classical header 不用現代藍色雙層：
- 第一層 Oxford Navy（深色面積控制）
- 第二層 parchment
- row-alt warm ivory
- Overall pale antique gold
- Vertical rule 0.4–0.6pt

### Assessment area：y 146–175 mm
若橫表 comment 已在最右欄，可只保留表格。
若 comment 過長，允許 overflow assessment 轉到 page 2 的 ledger list。

### Legend + Signatures：y 176–186 mm
單頁時，legend 左、signatures 右。
兩頁時移至第 2 頁。

## 9.3 DOM

```html
<article class="classical-landscape ornate-frame">
  <svg class="corner corner-tl"></svg>
  <svg class="corner corner-tr"></svg>
  <svg class="corner corner-bl"></svg>
  <svg class="corner corner-br"></svg>

  <header class="classical-crest-header"></header>
  <section class="classical-student-ledger"></section>
  <section class="classical-results-ledger"></section>
  <section class="classical-legend"></section>
  <footer class="classical-signatures"></footer>
</article>
```

## 9.4 Page 2
外框與 corner flourish 保留。
Header 縮為 18 mm：
- 左：Wilson International Elementary School
- 中：MIDTERM PROGRESS REPORT — CONTINUED
- 右：Alice · Grade 4 / 401 · II

接 overflow table/assessment。
底部 signatures。

## 9.5 SVG
必做：
1. `classical-corner-flourish.svg`
   - 單一 SVG，以 transform rotate 複用四角
   - 16 × 16mm
   - fill:none
   - stroke:#A98745
2. `classical-divider-diamond.svg`
   - 34 × 4mm
   - title divider
3. `classical-crest-surround.svg`
   - 26 × 26mm
   - 校徽外圍極細 laurels / shield line
   - 不要滿版紋章背景
4. `classical-mini-fleuron.svg`
   - 5 × 5mm
   - signature section marker

---

# 10. CLASSICAL / PORTRAIT
## ID：`classical + portrait`

### 核心風格
最像「私立學院正式成績冊／證書內頁」的版本。  
這一版要成為整個系統視覺辨識度最高的 portrait theme。

## 10.1 外框
Content box 188 × 277 mm。

- Outer frame：inset 0
- Inner frame：inset 3mm
- corner flourish：14mm
- safe content：8–180mm × 8–269mm

## 10.2 Crest Header：y 8–53 mm
完全置中：

- Crest：中心 86–102mm；y 10–28
- School EN：y 30–36
- School ZH：y 36–40
- divider：y 42–45
- MIDTERM PROGRESS REPORT：y 47–53

### Term folio：右上 y 10–27
- Academic Year
- Term
- Page I / II
小字 serif。

## 10.3 Student Ledger：y 58–86 mm
兩列兩欄：
- Student / Grade
- ID / Date
不使用色塊。
上下雙細線：
- 第一線 0.8pt
- 第二線 0.4pt，相距 1.2mm

## 10.4 Academic Ledger：y 92–150 mm
4 欄：
- Subject 44%
- Midterm 18%
- Daily 18%
- Overall 20%

表頭：
- parchment
- 上下 antique gold thin rule
- 不用整片深 navy；只在 section title 使用 navy/sepia

## 10.5 Habits Ledger：y 155–205 mm
5 欄 matrix。
EE/ME/AE/BE 使用 serif small caps 或 bold sans。
不做 badge。

## 10.6 Teacher Remarks：y 211–252 mm
單欄：
每科：
- Subject 7.4pt serif small caps
- 1mm ornamental short rule
- Assessment 7pt
- 2mm gap

## 10.7 Signatures：y 257–269 mm
三欄：
- Homeroom Teacher
- Academic Director
- Parent / Guardian

上方可有 miniature fleuron。

Legend 若無空間：
- 放在 Teacher Remarks section 上方 8–10mm
或第二頁 final area。

## 10.8 DOM

```html
<article class="classical-portrait ornate-frame">
  <div class="ornate-corners"></div>
  <header class="classical-centered-crest"></header>
  <section class="classical-student-ledger"></section>
  <section class="classical-academic-ledger"></section>
  <section class="classical-habits-ledger"></section>
  <section class="classical-remarks"></section>
  <section class="classical-legend"></section>
  <footer class="classical-signatures"></footer>
</article>
```

## 10.9 Page 2
外框完整保留。
Header 22mm：
- small crest 9×9mm
- Wilson International Elementary School
- `MIDTERM PROGRESS REPORT — CONTINUED`
- Alice · Grade · II

第二頁 remarks 接續。
最後：
- Learning Habits Legend
- Signatures
- optional school seal area（僅留空框，不預設印章圖）

## 10.10 SVG
與 Classical Landscape 共用：
- `classical-corner-flourish.svg`
- `classical-divider-diamond.svg`
- `classical-crest-surround.svg`
- `classical-mini-fleuron.svg`

Portrait 只改尺寸，不另做 raster 底圖。

---

# 11. 十套版面 DOM 對照

| Theme | Landscape | Portrait |
|---|---|---|
| formal | 現有 full-width 9 欄 table | Academic / Habits / Assessment 三段拆開 |
| playful | 左 identity rail + 右模組區 | Hero + student card + 三段模組 |
| fashion | 左 editorial masthead + 右 ruled content | 左 edge band + asymmetric magazine page |
| pro | 左 profile rail + 右 institutional body | 全寬行政文件 sections |
| classical | 雙框 + crest + classical 9 欄 ledger | 雙框 + centered crest + 分段 ledger |

---

# 12. 第 1 / 2 頁共通接續規則

## 第 1 頁
必須有：
- 完整 school identity
- report title
- student identification
- 至少一個主要成績 section

## 第 2 頁
不可重新印完整第一頁 header。
只印：
- school short identity
- `... — CONTINUED`
- student name + class
- page 2 / 2

## 最後一頁才顯示
- Learning Habits Legend
- Signatures
- Parent signature
- final footer

## 禁止
- 在兩頁都印完整大型 logo / title
- 把單一 Teacher Assessment block 切半
- 把 signatures 單獨擠到第 3 頁
- 用 CSS `transform: scale()` 把整張 A4 強縮到不可閱讀

---

# 13. SVG Asset 清單

建議專案：

```text
01_設計規格/
assets/
  formal/
    formal-crest-watermark.svg

  playful/
    playful-arc-dots.svg
    playful-half-circle.svg
    playful-mini-wave.svg
    playful-orbit.svg
    playful-dots.svg
    playful-wave-divider.svg

  fashion/
    fashion-editorial-bracket.svg
    fashion-rule-mark.svg
    fashion-corner-notch.svg
    fashion-editorial-dot.svg

  pro/
    pro-micro-mark.svg
    pro-rule-end.svg

  classical/
    classical-corner-flourish.svg
    classical-divider-diamond.svg
    classical-crest-surround.svg
    classical-mini-fleuron.svg
```

SVG 規則：
- 所有 ornament 使用 vector
- 不使用全頁 PNG/JPG 背景
- SVG `currentColor` 優先，方便換 theme 色
- classical 可使用 0.6–1pt stroke
- playful 不可有卡通人物
- fashion/pro 不得過度裝飾

---

# 14. 實作架構建議

不要再讓所有 theme 強制共用一個 DOM。

資料元件共用：

```tsx
<StudentData />
<AcademicData />
<HabitData />
<AssessmentData />
<SignatureData />
```

但 Layout component 分開：

```tsx
switch (`${theme}:${orientation}`) {
  case "formal:landscape":
    return <FormalLandscapeReport {...props} />;

  case "formal:portrait":
    return <FormalPortraitReport {...props} />;

  case "playful:landscape":
    return <PlayfulLandscapeReport {...props} />;

  case "playful:portrait":
    return <PlayfulPortraitReport {...props} />;

  case "fashion:landscape":
    return <FashionLandscapeReport {...props} />;

  case "fashion:portrait":
    return <FashionPortraitReport {...props} />;

  case "pro:landscape":
    return <ProfessionalLandscapeReport {...props} />;

  case "pro:portrait":
    return <ProfessionalPortraitReport {...props} />;

  case "classical:landscape":
    return <ClassicalLandscapeReport {...props} />;

  case "classical:portrait":
    return <ClassicalPortraitReport {...props} />;
}
```

**重點：**
共用的是資料與基礎 primitives，不是整張 report DOM。

---

# 15. UI 控制項

原本：

```text
主題 [正式 ▼]
```

改為：

```text
方向
[ 橫式 ] [ 直式 ]

主題
[ 正式 ▼ ]
```

Theme：
- 正式 Formal
- 童趣 Playful
- 時尚 Fashion
- 專業 Professional
- 古典 Classical

Preview container 要依 orientation 即時改比例：

```css
.preview[data-orientation="landscape"] {
  aspect-ratio: 297 / 210;
}

.preview[data-orientation="portrait"] {
  aspect-ratio: 210 / 297;
}
```

---

# 16. 實作優先順序

1. **先加 Orientation 狀態與 preview / print page size**
2. Formal landscape：完全不動
3. Formal portrait
4. Classical portrait + landscape
5. Fashion landscape + portrait
6. Playful landscape + portrait
7. Professional landscape + portrait
8. 最後才做 SVG polish

這樣每完成一步都能測列印，不會一次重寫整個系統。

---

# 17. 驗收標準

每一套都必須符合：

- [ ] 一眼可辨識不同 composition，而不是只換色
- [ ] A4 landscape / portrait 真實列印比例正確
- [ ] 最多 2 頁
- [ ] 第 2 頁有 continuation header
- [ ] 只有 final page 有 signatures
- [ ] EE/ME/AE/BE 沒有 emoji
- [ ] Teacher Assessment 不被裁切
- [ ] 英主中輔
- [ ] Wilson International Elementary School
- [ ] 威爾森國際小學
- [ ] 無「葳格」
- [ ] accent 面積不超過約 10%
- [ ] 無全頁 raster 背景
- [ ] SVG ornament 列印清楚
- [ ] 黑白印表機仍可辨識結構
- [ ] 100% print scale 時不超出 A4 printable area

---

**規格結論：**  
Formal Landscape 保留現況；其餘九套必須實作成真正不同的 layout component。Theme 不再只是 CSS skin，而是「共用資料、不同 composition、不同 page continuation、不同 ornament system」。
