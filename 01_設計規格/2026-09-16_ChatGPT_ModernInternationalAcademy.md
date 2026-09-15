我會直接把方向定成 **「Modern International Academy｜現代國際學院風」**。

不是把現在 Quiet Ledger 加幾個顏色而已，而是把整份成績單的「視覺層級」重做：保留你實體成績單那種正式、資訊密度高的結構，但吸收你第 2 張藍色 Academic Progress、第 4 張 International School，以及第 5 張彩色 Class Report 的優點。

其中我最想保留的是 **第 2 張的國際學校藍＋第 4 張的現代排版＋第 5 張的教育感**。但把火箭、彩虹、ABC 方塊、試管這些卡通物件全部拿掉，改成細線、幾何色塊、校徽浮水印、柔和藍色分區。這樣老師拿到會覺得是「國際學校正式文件」，而不是補習班模板。

---

# 我最推薦的成品方向

### Modern International Academy Report

整體感覺大概是：

> Wilson International Elementary School
> **MIDTERM PROGRESS REPORT**
> 期中學習成績報告

左上校徽，中央學校與文件名稱，右側 Academic Year / Semester。

下面不是一大堆框框，而是一條很乾淨的學生資訊帶：

**Student Name / 學生姓名　　Grade & Class / 年級班級　　Student ID / 學號　　Date / 日期**

然後直接進入主成績表。

最大改變會是把原本「工程後台表格」感消掉。

---

## 1. 建議色彩

我不建議用照片裡第一張那種橘綠藍紫全部上，也不建議全黑。

最適合 Wilson International Elementary 的是：

| 用途            | 色彩    | HEX         |
| ------------- | ----- | ----------- |
| School Navy   | 深國際藍  | **#17376D** |
| Academic Blue | 學院藍   | **#4E83D1** |
| Soft Blue     | 淺藍底   | **#EAF2FC** |
| Powder Blue   | 次區塊   | **#D7E6F8** |
| Warm Gold     | 重點金   | **#F2B84B** |
| Warm Paper    | 紙張暖白  | **#FCFBF7** |
| Main Ink      | 文字深藍黑 | **#17233C** |
| Secondary Ink | 次文字   | **#64748B** |
| Border        | 淡灰藍   | **#CAD7E7** |
| Overall BG    | 總評淡金  | **#FFF5D9** |

真正大量使用的只有：

**深藍 + 白 + 淺藍。**

黃色只當 5% 左右的 accent。

這會比現在純白 Quiet Ledger 高級非常多，但印表機也不會瘋狂吃墨。

---

# 2. A4 Landscape 版型

```css
@page {
  size: A4 landscape;
  margin: 8mm 10mm 8mm 10mm;
}
```

A4 landscape：

**297 × 210 mm**

扣掉左右 10mm：

**有效寬度約 277mm**

這其實非常適合你的欄位。

我會這樣分：

| 欄位                 |        寬度 |
| ------------------ | --------: |
| Subject            |      36mm |
| Midterm 40%        |      20mm |
| Daily 60%          |      20mm |
| Overall            |      20mm |
| Performance        |      15mm |
| Teamwork           |      15mm |
| Assignment         |      15mm |
| Behavior           |      15mm |
| Teacher Assessment | 剩餘約 121mm |

也就是：

### Teacher Assessment 一定要給它最大空間。

這正是你實體成績單的特色，也會比一般成績單更有「國際學校 progress report」感。

---

# 3. Page 1 頂部

我會避免現在那種：

> logo
> 一條線
> 然後大片空白

而改成：

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [LOGO]  WILSON INTERNATIONAL ELEMENTARY SCHOOL          ACADEMIC YEAR    │
│         Wilson International Elementary School          2026–2027       │
│                                                                          │
│         MIDTERM PROGRESS REPORT                         SEMESTER 1      │
│         期中學習成績報告                                                 │
│ ──────────────────────────────────────────────────────────────────────── │
│ Student Name      Grade & Class       Homeroom Teacher       Date        │
│ Alice Lin         Grade 5 / B         Ms. Anderson           2026.11.06 │
└──────────────────────────────────────────────────────────────────────────┘
```

但實際不是外框，而是留白＋色帶。

---

# 4. 頁首最好長這樣

左邊校徽控制在約：

**18–20mm**

旁邊：

### WILSON INTERNATIONAL

### ELEMENTARY SCHOOL

小字：

`威爾森國際小學`

下一行才是：

# MIDTERM PROGRESS REPORT

下面小一級：

`期中學習成績報告`

不要把中英文做成一樣大。

你的需求是：

> 英主中輔

所以我建議比例：

**英文 100% / 中文 72–78%**

例如：

```css
.title-en {
  font-size: 18pt;
  font-weight: 800;
}

.title-zh {
  font-size: 9pt;
  font-weight: 500;
  color: var(--text-muted);
}
```

這會立刻產生國際學校感。

---

# 5. 表格不要做傳統 Excel 格

這點最重要。

現在 Quiet Ledger 很可能醜就在：

* 每一格都有框
* header 跟 body 差異很小
* 所有文字權重差不多
* 沒有 group hierarchy

我要把 header 做成 **兩層式 Header**。

大概：

```text
┌─────────┬────────────────────────────┬─────────────────────────────────────┬───────────────┐
│ SUBJECT │      ACADEMIC PROGRESS     │          LEARNING HABITS            │    TEACHER    │
│ 科目    ├─────────┬─────────┬────────┼────────┬────────┬────────┬────────┤ ASSESSMENT    │
│         │ MIDTERM │ DAILY   │ OVERALL│Perform.│Teamwork│Assign. │Behavior│ 教師評語      │
│         │  40%    │  60%    │ 總評   │ 表現   │ 合作   │ 作業   │ 行為   │               │
└─────────┴─────────┴─────────┴────────┴────────┴────────┴────────┴────────┴───────────────┘
```

第一層：

**School Navy**

第二層：

**Soft Blue**

而不是全部深藍。

---

# 6. Learning Habits 不再放 😃

這點我完全同意你。

原本：

😀 🙂 😐 😢

太像幼兒園聯絡簿。

改成：

**EE / ME / AE / BE**

例如：

```text
Performance    EE
Teamwork       ME
Assignment     EE
Behavior       EE
```

儲存的資料就直接是：

```js
"EE"
"ME"
"AE"
"BE"
```

視覺上我也不建議做成彩色 Emoji pill。

直接：

```css
.habit-code {
  font-weight: 800;
  letter-spacing: .04em;
  color: var(--navy);
}
```

甚至可以有很淡的藍色背景：

```css
background: #EEF5FD;
border-radius: 4px;
```

會像 assessment rubric，而不是評價表情。

---

# 7. EE / ME / AE / BE Legend

頁尾放一條非常重要。

```text
LEARNING HABITS SCALE  學習習慣評量

EE  Exceeds Expectations   超越期待
ME  Meets Expectations     符合期待
AE  Approaching Expectations  接近期待
BE  Below Expectations     尚待加強
```

不要塞在表格裡。

放在底部淡藍色 band。

這也非常符合國際學校常見 rubric 系統。

---

# 8. Teacher Assessment

這裡我反而不會做得很花。

例如：

### Language Arts

成績：

**83　93　88**

Learning Habits：

**EE　ME　EE　EE**

Teacher Assessment：

> Alice is a highly motivated and capable learner. She demonstrates strong concentration during lessons and has developed effective study habits.

但 HTML 裡仍然是普通文字。

建議：

```css
.teacher-assessment {
  font-size: 7.6pt;
  line-height: 1.35;
  color: #334155;
  text-align: left;
}
```

英文評語千萬不要 9–10pt。

A4 landscape 要放很多科目時：

**7.5–8pt 其實是最舒服的。**

---

# 9. Overall 要做視覺強調

我很建議 Overall 不跟另外兩欄一模一樣。

例如：

```text
Midterm      Daily       Overall
83           93          88
                         ↑
                  淡黃色背景
```

CSS：

```css
.col-overall {
  background: var(--overall-bg);
  font-weight: 800;
  color: var(--navy);
}
```

這一點會讓閱讀速度快非常多。

老師和家長一眼就找到總成績。

---

# 10. Font

如果是瀏覽器列印，而且你有中文，我建議：

```css
font-family:
  "Inter",
  "Noto Sans TC",
  "PingFang TC",
  "Microsoft JhengHei",
  sans-serif;
```

不要用 Times New Roman。

也不要用 Canva 那種過度圓體。

---

## 建議字級

| 內容                      |          字級 |
| ----------------------- | ----------: |
| 學校名                     |     11–12pt |
| MIDTERM PROGRESS REPORT | **18–20pt** |
| 中文副標                    |     8.5–9pt |
| 學生姓名                    |         9pt |
| Metadata label          |     6.5–7pt |
| 表格 group header         |         8pt |
| 表格 secondary header     |         7pt |
| Subject                 |     8–8.5pt |
| Scores                  |  **9–10pt** |
| EE / ME / AE / BE       |         8pt |
| Teacher Assessment      |     7.4–8pt |
| Footer                  |     6.5–7pt |

---

# 11. CSS Variables

這組可以直接丟給你現在系統。

```css
:root {
  /* Brand */
  --navy: #17376D;
  --blue: #4E83D1;
  --blue-soft: #EAF2FC;
  --blue-soft-2: #D7E6F8;

  --gold: #F2B84B;
  --gold-soft: #FFF5D9;

  /* Neutral */
  --paper: #FCFBF7;
  --white: #FFFFFF;

  --ink: #17233C;
  --ink-2: #334155;
  --text-muted: #64748B;

  --border: #CAD7E7;
  --border-light: #E5ECF4;

  /* Table */
  --header-bg: #17376D;
  --subheader-bg: #EAF2FC;
  --row-alt: #F8FAFD;
  --overall-bg: #FFF5D9;

  /* Geometry */
  --page-radius: 0;
  --box-radius: 4px;

  /* Typography */
  --font:
    "Inter",
    "Noto Sans TC",
    "PingFang TC",
    "Microsoft JhengHei",
    sans-serif;
}
```

---

# 12. Print CSS

這一段其實非常重要。

```css
@page {
  size: A4 landscape;
  margin: 8mm 10mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font);
  color: var(--ink);
  background: #eef2f7;
}

.report-sheet {
  background: var(--white);
  width: 100%;
  min-height: 194mm;
  position: relative;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  display: table-header-group;
}

tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

@media print {
  body {
    background: #fff;
  }

  .report-sheet {
    box-shadow: none;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }
}
```

---

# 13. 表格 CSS

這裡就是整份成績單從「後台工程」變成「國際學校」的核心。

```css
.report-table {
  margin-top: 4mm;
  border: 1px solid var(--border);
}

.report-table th,
.report-table td {
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.report-table thead .group-head th {
  background: var(--navy);
  color: white;

  height: 8mm;

  font-size: 7.6pt;
  font-weight: 750;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.report-table thead .sub-head th {
  background: var(--blue-soft);

  height: 9mm;

  color: var(--navy);
  font-size: 6.8pt;
  font-weight: 700;

  line-height: 1.15;
}

.report-table tbody tr:nth-child(even) {
  background: var(--row-alt);
}

.report-table td {
  padding: 2mm 2.2mm;
}

.report-table .subject {
  padding-left: 3mm;

  font-size: 8.2pt;
  font-weight: 700;

  color: var(--navy);
}

.report-table .score {
  text-align: center;

  font-size: 9.5pt;
  font-weight: 700;

  font-variant-numeric: tabular-nums;
}

.report-table .overall {
  background: var(--overall-bg);

  color: var(--navy);
  font-weight: 850;
}

.report-table .habit {
  text-align: center;

  font-size: 8pt;
  font-weight: 800;

  color: var(--navy);
}

.report-table .assessment {
  font-size: 7.5pt;
  line-height: 1.35;

  color: var(--ink-2);
}
```

---

# 14. 關鍵 HTML 結構

你現在的工程可以直接往這個 DOM 結構改。

```html
<article class="report-sheet">

  <header class="report-header">

    <div class="school-brand">
      <img
        class="school-logo"
        src="/assets/wilson-logo.svg"
        alt="Wilson International Elementary School"
      />

      <div class="school-name">
        <div class="school-name-en">
          WILSON INTERNATIONAL ELEMENTARY SCHOOL
        </div>

        <div class="school-name-zh">
          威爾森國際小學
        </div>
      </div>
    </div>


    <div class="report-heading">
      <h1>MIDTERM PROGRESS REPORT</h1>
      <div class="title-zh">期中學習成績報告</div>
    </div>


    <div class="term-info">
      <div>
        <span>ACADEMIC YEAR</span>
        <strong>2026–2027</strong>
      </div>

      <div>
        <span>SEMESTER</span>
        <strong>1</strong>
      </div>
    </div>

  </header>


  <section class="student-meta">

    <div class="meta-item">
      <span class="meta-label">
        Student Name
        <small>學生姓名</small>
      </span>

      <strong>Alice Lin</strong>
    </div>


    <div class="meta-item">
      <span class="meta-label">
        Grade & Class
        <small>年級班級</small>
      </span>

      <strong>Grade 5 · B</strong>
    </div>


    <div class="meta-item">
      <span class="meta-label">
        Homeroom Teacher
        <small>導師</small>
      </span>

      <strong>Ms. Anderson</strong>
    </div>


    <div class="meta-item">
      <span class="meta-label">
        Date
        <small>日期</small>
      </span>

      <strong>2026 / 11 / 06</strong>
    </div>

  </section>
```

表格：

```html
<table class="report-table">

  <colgroup>
    <col style="width:13%">
    <col style="width:7%">
    <col style="width:7%">
    <col style="width:7%">

    <col style="width:5.5%">
    <col style="width:5.5%">
    <col style="width:5.5%">
    <col style="width:5.5%">

    <col style="width:44%">
  </colgroup>


  <thead>

    <tr class="group-head">

      <th rowspan="2">
        SUBJECT<br>
        <span>科目</span>
      </th>

      <th colspan="3">
        ACADEMIC PROGRESS
      </th>

      <th colspan="4">
        LEARNING HABITS
      </th>

      <th rowspan="2">
        TEACHER ASSESSMENT<br>
        <span>教師評語</span>
      </th>

    </tr>


    <tr class="sub-head">

      <th>
        MIDTERM<br>
        <small>期中 40%</small>
      </th>

      <th>
        DAILY<br>
        <small>平時 60%</small>
      </th>

      <th class="col-overall">
        OVERALL<br>
        <small>總評</small>
      </th>

      <th>
        PERFORMANCE<br>
        <small>表現</small>
      </th>

      <th>
        TEAMWORK<br>
        <small>合作</small>
      </th>

      <th>
        ASSIGNMENT<br>
        <small>作業</small>
      </th>

      <th>
        BEHAVIOR<br>
        <small>行為</small>
      </th>

    </tr>

  </thead>


  <tbody>

    <tr>

      <td class="subject">
        Language Arts
      </td>

      <td class="score">
        83
      </td>

      <td class="score">
        93
      </td>

      <td class="score overall">
        88
      </td>

      <td class="habit">
        EE
      </td>

      <td class="habit">
        ME
      </td>

      <td class="habit">
        EE
      </td>

      <td class="habit">
        EE
      </td>

      <td class="assessment">
        Alice is a highly motivated, patient, attentive,
        and capable learner. She demonstrates strong
        concentration and effective study habits.
      </td>

    </tr>

  </tbody>

</table>
```

---

# 15. Learning Habits Legend

表格下面我會放：

```html
<section class="habit-legend">

  <strong>
    LEARNING HABITS SCALE
    <small>學習習慣評量</small>
  </strong>

  <span>
    <b>EE</b>
    Exceeds Expectations
    <small>超越期待</small>
  </span>

  <span>
    <b>ME</b>
    Meets Expectations
    <small>符合期待</small>
  </span>

  <span>
    <b>AE</b>
    Approaching Expectations
    <small>接近期待</small>
  </span>

  <span>
    <b>BE</b>
    Below Expectations
    <small>尚待加強</small>
  </span>

</section>
```

視覺：

```css
.habit-legend {
  margin-top: 3mm;
  padding: 2.5mm 3mm;

  display: flex;
  align-items: center;
  gap: 5mm;

  background: var(--blue-soft);

  border-left: 2mm solid var(--blue);

  font-size: 6.5pt;
}

.habit-legend b {
  color: var(--navy);
  font-size: 7.5pt;
}
```

這一塊會很好看。

---

# 16. Signatures 我會這樣排

不要四個巨大方框。

做成正式文件的 signature line：

```text
──────────────────────    ──────────────────────    ──────────────────────
Homeroom Teacher          Academic Director          Parent / Guardian
導師                       教務主管                    家長／監護人
```

HTML：

```html
<footer class="report-signatures">

  <div class="signature">
    <div class="signature-line"></div>
    <strong>Homeroom Teacher</strong>
    <span>導師</span>
  </div>

  <div class="signature">
    <div class="signature-line"></div>
    <strong>Academic Director</strong>
    <span>教務主管</span>
  </div>

  <div class="signature">
    <div class="signature-line"></div>
    <strong>Parent / Guardian</strong>
    <span>家長／監護人</span>
  </div>

</footer>
```

```css
.report-signatures {
  margin-top: 5mm;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12mm;
}

.signature {
  text-align: center;

  font-size: 7pt;
  color: var(--text-muted);
}

.signature-line {
  height: 8mm;
  border-bottom: 1px solid #758399;
  margin-bottom: 1.5mm;
}

.signature strong {
  display: block;
  color: var(--ink);
  font-size: 7.3pt;
}

.signature span {
  display: block;
  margin-top: .5mm;
  font-size: 6.2pt;
}
```

---

# 17. 我甚至建議保留一個非常淡的校徽浮水印

你上傳那張現在的版面其實有這個概念，只是位置和比例沒處理好。

可以保留。

但是：

**Opacity 約 0.025–0.035。**

不是讓人真的看到大 logo。

```css
.report-sheet::before {
  content: "";

  position: absolute;

  width: 85mm;
  height: 85mm;

  right: 10mm;
  top: 42mm;

  background:
    url("/assets/wilson-mark.svg")
    center / contain
    no-repeat;

  opacity: .028;

  pointer-events: none;
}
```

這會非常像私立國際學校正式文件。

---

# 18. 多科目與兩頁問題

這裡不能只靠 CSS 碰運氣。

我建議系統直接有 **Print Pagination**。

### 最漂亮：

**1–8 科：1 Page**

Page 1：

Header
Student Information
Subjects
Legend
Signatures

### 9–16 科：2 Pages

Page 1：

Header
Student Information
Subjects 1–8
小頁尾

Page 2：

簡化 Header

```text
WILSON INTERNATIONAL ELEMENTARY SCHOOL
MIDTERM PROGRESS REPORT · Alice Lin · Grade 5B
```

然後：

Subjects 9–16

Learning Habits Legend

Signatures

---

甚至第二頁不要重新顯示巨大標題。

只顯示：

```text
WILSON INTERNATIONAL ELEMENTARY SCHOOL
MIDTERM PROGRESS REPORT — CONTINUED
```

右邊：

```text
Alice Lin · Grade 5B
```

會非常專業。

---

# 19. 建議 JS 分頁規則

其實可以很簡單：

```js
const ROWS_PER_PAGE = 8;

function paginateSubjects(subjects) {
  if (subjects.length <= ROWS_PER_PAGE) {
    return [subjects];
  }

  return [
    subjects.slice(0, ROWS_PER_PAGE),
    subjects.slice(ROWS_PER_PAGE, ROWS_PER_PAGE * 2)
  ];
}
```

然後 React：

```jsx
{pages.map((subjects, pageIndex) => (
  <ReportPage
    key={pageIndex}
    subjects={subjects}
    page={pageIndex + 1}
    totalPages={pages.length}
    fullHeader={pageIndex === 0}
    signatures={pageIndex === pages.length - 1}
  />
))}
```

這會比讓 browser 自己猜 page break 穩定很多。

---

# 20. 如果只有 3 科，也不要變成你現在那樣「下面空一大片」

這也是現在版型最容易出現的問題。

例如實際成績單只有：

* Language Arts
* Mathematics
* Western Social Studies

3 科。

不要讓表格三列完之後下面全部空白。

可以改成：

```text
[ 三科學習成果表 ]

──────────────────────────────────

LEARNING HABITS SCALE

──────────────────────────────────

GENERAL COMMENTS / 綜合評語

這學期整體學習狀況……

──────────────────────────────────

ATTENDANCE / 出缺席
Present       Late       Absent

──────────────────────────────────

簽章
```

這樣即使只有三科，整張 A4 仍然是完整設計。

而不是「有一張表被放在紙張最上方」。

---

# 我會怎麼改你現在的 Quiet Ledger

你現在畫面裡那種：

> Language Arts
> 83 | 93 | 88
> 😀 😀 😀
> 大 textarea

非常像「教師資料輸入後台」。

**後台其實可以繼續這樣。**

但：

### Teacher UI ≠ Printed Report

這兩個一定要拆。

老師輸入端可以：

```text
Language Arts

Midterm       Daily       Overall
83            93          88

Performance   Teamwork    Assignment    Behavior
[ EE ▼ ]      [ ME ▼ ]    [ EE ▼ ]      [ EE ▼ ]

Teacher Assessment
[ ................................ ]
```

沒問題。

但按：

# Print / PDF

之後才 render 我上面這種真正的：

**International School Report Document。**

這會是我覺得你現在最應該做的架構。

---

## 最終視覺比例

我會把整份成績單控制成大約：

**65% International Academy**
**20% Premium Private School**
**15% Child-friendly education**

而不是：

**50% 網頁後台
30% Excel
20% 兒童圖卡**

這個差異其實就是你現在覺得 Quiet Ledger「老師無法直視」的根本原因。

你這份實體 Wilson 成績單的**資訊架構本身其實不用大改**；真正需要重做的是 typography、hierarchy、color system、spacing 和 print layout。这样做完，仍然一眼看得出來是 Wilson 原本那份成績單的升級版，而不是突然換成一張 Canva 模板。
