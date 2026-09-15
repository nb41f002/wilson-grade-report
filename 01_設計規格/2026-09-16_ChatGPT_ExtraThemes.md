可以，這 4 套我會刻意做成「同一份成績單、四種完全不同的品牌語言」，DOM 與欄位邏輯都不動，只切 `data-theme`。

共通資料結構維持：

**Wilson International Elementary School｜威爾森國際小學**
Student Information → 雙層成績表 → `EE / ME / AE / BE` → Teacher Assessment → Legend → Signatures。

---

# 1. 童趣 Playful

## A. 一句話風格定位

**像高質感國際小學教材與學習歷程冊：溫暖、明亮、有小學感，但家長拿到仍像正式學校文件。**

不使用卡通人物、emoji、火箭、彩虹；童趣主要靠 **圓角、柔和彩色小標籤、幾何點綴與較親切的字型**。

## B. 色票表

| 用途                | 名稱                | HEX         |
| ----------------- | ----------------- | ----------- |
| navy / primary    | School Blue       | **#315C8C** |
| accent            | Sunny Apricot     | **#F2B35D** |
| paper             | Warm Ivory        | **#FFFEFA** |
| ink               | Soft Navy Ink     | **#203047** |
| border            | Powder Border     | **#CFDDEA** |
| header-bg         | Friendly Blue     | **#315C8C** |
| subheader-bg      | Sky Wash          | **#EAF4FB** |
| overall-bg        | Vanilla Highlight | **#FFF3D8** |
| row-alt           | Cloud Blue        | **#F7FAFD** |
| optional accent 2 | Soft Mint         | **#8CBFAE** |

橘與薄荷只做小面積識別，總面積控制在約 5–8%。

## C. 字型建議

英文：

**Nunito Sans**

中文：

**Noto Sans TC**

```css
font-family:
  "Nunito Sans",
  "Noto Sans TC",
  "Microsoft JhengHei",
  sans-serif;
```

Nunito Sans 有一些圓潤感，但不像 Comic Sans 那種幼稚。

## D. 具體視覺差異

* **表頭**

  * 左側校徽 + 學校名。
  * `MIDTERM PROGRESS REPORT` 使用稍圓潤 Bold。
  * 標題下方加一條短短的杏橘色 accent line，不做整頁大色塊。
  * Student Information 做成一條淺藍圓角資訊帶。
  * 四個學生欄位之間不用粗線，改用留白與細 divider。

* **表格**

  * 第一層 `ACADEMIC PROGRESS / LEARNING HABITS` 深藍。
  * 第二層 header 用很淡的水藍。
  * 表格外框可有約 `5px` 的小圓角視覺，但列印時仍維持完整表格線。
  * Subject 名稱前可有 **3mm 的短色條**，不得使用 icon。
  * EE / ME / AE / BE 可置於極淡藍色小膠囊內，但都是純文字碼。

* **Overall**

  * 淡奶油黃底。
  * 數字比 Midterm / Daily 大約 `0.5–1pt`。
  * 可加一條極細杏橘左線強調。

* **簽名區**

  * 線條不要完全企業式筆直，可用「短線＋英文標籤＋中文副標」。
  * 每一格頂端可有一個非常小的藍／橘圓點作 section marker。
  * 不使用插圖。

## E. CSS custom properties

```css
:root[data-theme="playful"] {
  --navy: #315C8C;
  --primary: #315C8C;

  --accent: #F2B35D;
  --accent-secondary: #8CBFAE;

  --paper: #FFFEFA;
  --white: #FFFFFF;

  --ink: #203047;
  --ink-2: #43566E;
  --text-muted: #728196;

  --border: #CFDDEA;
  --border-light: #E8EFF5;

  --header-bg: #315C8C;
  --subheader-bg: #EAF4FB;
  --overall-bg: #FFF3D8;
  --row-alt: #F7FAFD;

  --box-radius: 7px;
  --table-radius: 6px;

  --font-en: "Nunito Sans";
  --font-zh: "Noto Sans TC";
  --font:
    var(--font-en),
    var(--font-zh),
    "Microsoft JhengHei",
    sans-serif;
}
```

## F. 與正式 MIA 的差異

**MIA 是「國際學院正式感」，Playful 則把正式骨架變得更溫暖、親切、像真正服務國小兒童的國際學校。**

---

# 2. 時尚 Fashionable

## A. 一句話風格定位

**像精品學校年度報告與現代設計雜誌：大量留白、強烈字級層次、高對比黑藍，加一點高級 accent。**

這套我會讓它明顯與 MIA 不同。

不是「藍色學校模板」，而是 **Editorial Design**。

---

## B. 色票表

| 用途              | 名稱              | HEX         |
| --------------- | --------------- | ----------- |
| navy / primary  | Midnight Ink    | **#172033** |
| accent          | Electric Cobalt | **#3559C7** |
| paper           | Gallery White   | **#FEFEFD** |
| ink             | Editorial Black | **#171A21** |
| border          | Cool Silver     | **#D7DAE0** |
| header-bg       | Midnight Ink    | **#172033** |
| subheader-bg    | Mist Grey       | **#F0F2F5** |
| overall-bg      | Cobalt Mist     | **#E9EEFF** |
| row-alt         | Editorial White | **#FAFAFB** |
| optional accent | Muted Coral     | **#D9786B** |

我建議正式版本只用 Cobalt。

Coral 最多做季節性或校慶版本。

---

## C. 字型建議

英文：

**DM Sans**

標題可搭：

**Libre Baskerville**

中文：

**Noto Sans TC**

組合：

```css
body {
  font-family:
    "DM Sans",
    "Noto Sans TC",
    sans-serif;
}

.report-title {
  font-family:
    "Libre Baskerville",
    "Noto Serif TC",
    serif;
}
```

也可以全部 DM Sans，比較乾淨。

---

## D. 具體視覺差異

* **表頭**

  * 不做完整色帶。
  * 白底＋左側一條約 `2.5mm` 的深藍直線。
  * 校名小而克制。
  * `MIDTERM` 與 `PROGRESS REPORT` 可拆兩行：

    ```text
    MIDTERM
    PROGRESS REPORT
    ```
  * Title 使用 21–24pt，比其他主題更大。
  * 學年與 Semester 放右上角，像雜誌 issue metadata。
  * 中文「期中學習成績報告」小字放標題下方。

* **學生資訊帶**

  * 不做框。
  * 四欄像 editorial metadata：

    ```text
    STUDENT
    Alice Lin
    ```
  * label 全大寫 6pt、字距放寬。
  * value 9pt。

* **表格**

  * 垂直線大幅減少。
  * 主要靠水平分隔線。
  * 第一層表頭深黑藍。
  * 第二層灰白。
  * `Teacher Assessment` 保持大片留白感。
  * row alternate 幾乎看不出來，只是 `#FAFAFB`。

* **Overall**

  * 淡藍紫底。
  * 數字可使用 `11pt / 800`。
  * 上方加 `1.5px` cobalt line。
  * 不用黃色，時尚感會更乾淨。

* **簽名區**

  * 非常極簡。
  * 三條長細線。
  * 英文放在線下，中譯再小一級。
  * 線距與對齊要像雜誌 footer。

## E. CSS custom properties

```css
:root[data-theme="fashion"] {
  --navy: #172033;
  --primary: #172033;

  --accent: #3559C7;
  --accent-secondary: #D9786B;

  --paper: #FEFEFD;
  --white: #FFFFFF;

  --ink: #171A21;
  --ink-2: #343945;
  --text-muted: #737987;

  --border: #D7DAE0;
  --border-light: #ECEEF1;

  --header-bg: #172033;
  --subheader-bg: #F0F2F5;
  --overall-bg: #E9EEFF;
  --row-alt: #FAFAFB;

  --box-radius: 1px;
  --table-radius: 0;

  --font-en: "DM Sans";
  --font-zh: "Noto Sans TC";
  --font-display: "Libre Baskerville";

  --font:
    var(--font-en),
    var(--font-zh),
    sans-serif;
}
```

## F. 與正式 MIA 的差異

**MIA 是典型高品質 International School；Fashion 則更像學校品牌設計部做出的精品 Editorial Report。**

---

# 3. 專業 Professional

## A. 一句話風格定位

**像教育顧問、企業稽核或國際認證機構的正式報告：理性、資訊導向、極簡，幾乎沒有裝飾。**

如果 Wilson 未來有高年級、國中部、對外評鑑資料，我覺得這套會非常好用。

---

## B. 色票表

| 用途             | 名稱             | HEX         |
| -------------- | -------------- | ----------- |
| navy / primary | Slate Navy     | **#31465A** |
| accent         | Steel Blue     | **#6486A3** |
| paper          | Clean White    | **#FFFFFF** |
| ink            | Graphite       | **#202A33** |
| border         | Technical Grey | **#C9D0D6** |
| header-bg      | Graphite Blue  | **#31465A** |
| subheader-bg   | Cool Grey      | **#EEF1F3** |
| overall-bg     | Pale Steel     | **#E8EFF4** |
| row-alt        | Light Grey     | **#F8F9FA** |
| secondary      | Charcoal       | **#58636D** |

---

## C. 字型建議

英文：

**IBM Plex Sans**

中文：

**Noto Sans TC**

```css
font-family:
  "IBM Plex Sans",
  "Noto Sans TC",
  "Microsoft JhengHei",
  sans-serif;
```

IBM Plex 的優點是：

* 數字漂亮
* 表格可讀性很好
* 很像正式研究／企業文件
* 不會像 Arial 那麼普通

---

## D. 具體視覺差異

* **表頭**

  * 校徽縮小。
  * 學校名稱不做巨大 branding。
  * 版面：

    ```text
    Wilson International Elementary School
    威爾森國際小學

    MIDTERM PROGRESS REPORT
    ```
  * 最下方一條 `1px` 深灰藍線。
  * 沒有色塊裝飾。

* **學生資訊帶**

  * 淺灰底。
  * 方角。
  * Label 用 `#64727E`。
  * Student Name / Grade / Teacher / Date 像企業表單。
  * 不做 card。

* **表格**

  * 完整 grid 最清楚。
  * 第一層深灰藍。
  * 第二層淺灰。
  * border 比 MIA 更明確但仍細。
  * Subject 與 Teacher Assessment 左對齊。
  * 所有 score 採 `tabular-nums`。
  * EE / ME / AE / BE 完全不做 pill，只是粗體文字。

* **Overall**

  * 淡 steel blue。
  * 不使用黃色、橘色。
  * 只有背景與 Bold 區分。

* **簽名區**

  * 最像正式行政文件。
  * 三欄等寬。
  * 一條直線＋簽署身份＋日期區。
  * 可加：

    ```text
    Signature / Date
    簽名／日期
    ```

## E. CSS custom properties

```css
:root[data-theme="pro"] {
  --navy: #31465A;
  --primary: #31465A;

  --accent: #6486A3;
  --accent-secondary: #58636D;

  --paper: #FFFFFF;
  --white: #FFFFFF;

  --ink: #202A33;
  --ink-2: #3D4852;
  --text-muted: #697782;

  --border: #C9D0D6;
  --border-light: #E1E5E8;

  --header-bg: #31465A;
  --subheader-bg: #EEF1F3;
  --overall-bg: #E8EFF4;
  --row-alt: #F8F9FA;

  --box-radius: 0;
  --table-radius: 0;

  --font-en: "IBM Plex Sans";
  --font-zh: "Noto Sans TC";

  --font:
    var(--font-en),
    var(--font-zh),
    "Microsoft JhengHei",
    sans-serif;
}
```

## F. 與正式 MIA 的差異

**MIA 仍有私立國際學校的品牌感；Professional 則刻意去品牌化，偏向顧問報告與正式行政文件。**

---

# 4. 古典歐洲花紋 Classical European Ornate

## A. 一句話風格定位

**像歐洲私立學院、古典音樂學院或歷史悠久寄宿學校的正式成績冊：紋章、象牙紙、雙線框與極細花飾。**

這套要特別注意：

**不能真的變成婚禮邀請函。**

所以花飾只出現在：

* 四角
* Title divider
* 校徽周圍
* 外框

而不是整張紙鋪滿。

---

## B. 色票表

| 用途              | 名稱                | HEX         |
| --------------- | ----------------- | ----------- |
| navy / primary  | Oxford Navy       | **#26364A** |
| accent          | Antique Gold      | **#A98745** |
| paper           | Ivory Paper       | **#FBF8F0** |
| ink             | Deep Sepia        | **#2D2A26** |
| border          | Antique Taupe     | **#B9AE98** |
| header-bg       | Oxford Navy       | **#26364A** |
| subheader-bg    | Parchment         | **#EEE8DA** |
| overall-bg      | Pale Antique Gold | **#F4EBD7** |
| row-alt         | Warm Ivory        | **#F8F4EA** |
| ornamental line | Bronze Grey       | **#8E8068** |

Gold 千萬不要用 `#FFD700`。

要用偏灰、偏舊金的：

**#A98745**

才會高級。

---

## C. 字型建議

英文標題：

**Cormorant Garamond**

英文正文：

**Source Sans 3**

中文：

**Noto Serif TC**

可以這樣：

```css
.report-title,
.school-name {
  font-family:
    "Cormorant Garamond",
    "Noto Serif TC",
    serif;
}

.report-body,
.report-table {
  font-family:
    "Source Sans 3",
    "Noto Sans TC",
    sans-serif;
}
```

或者全份中文都使用 Noto Serif TC，也會更古典。

---

## D. 具體視覺差異

* **表頭**

  * 校徽置中或左側皆可，但我更推：

    ```text
                [CREST]
    WILSON INTERNATIONAL ELEMENTARY SCHOOL
              威爾森國際小學

           MIDTERM PROGRESS REPORT
    ```
  * 左右加非常細的 ornament divider。
  * 英文校名使用 small caps / letter spacing。
  * 標題上下各一條：

    ```text
    ─────── ◇ ───────
    ```
  * 不能出現大面積深色背景。

* **頁框**

  * 外層 `1px`。
  * 內層再一條 `0.5–1px`。
  * 形成古典證書式雙框。
  * 兩條線之間約 2mm。
  * 四角可放小 SVG flourish。

* **SVG 角飾建議**

  * 單色。
  * stroke only。
  * `stroke: #A98745`
  * `stroke-width: 0.7–1`
  * `fill: none`
  * 每個角控制在 `12–18mm`。
  * opacity 約 `.65`。
  * 不要 JPG / PNG 重背景。

例如 CSS：

```css
.classical-frame::before {
  background-image: url("/ornaments/corner-flourish.svg");
}
```

最好 SVG 做成純向量，列印更清楚。

* **表格**

  * 第一層 Oxford Navy。
  * 第二層羊皮紙米色。
  * 行間白／暖象牙交錯。
  * 盡量不用大量藍色填滿。
  * Column separator 可比 MIA 細。
  * Subject 可以用 slightly serif/bold。

* **Overall**

  * 淡舊金米色。
  * 左右各一條極細 gold border。
  * 不做現代 pill / badge。

* **簽名區**

  * 最適合做傳統三欄。
  * 簽名線使用深棕灰。
  * 職稱用小型大寫英文：

    ```text
    HOMEROOM TEACHER
    導師
    ```
  * 上方可以有非常小的 `◆` ornamental divider。

## E. CSS custom properties

```css
:root[data-theme="classical"] {
  --navy: #26364A;
  --primary: #26364A;

  --accent: #A98745;
  --accent-secondary: #8E8068;

  --paper: #FBF8F0;
  --white: #FFFEFA;

  --ink: #2D2A26;
  --ink-2: #514B43;
  --text-muted: #7A7063;

  --border: #B9AE98;
  --border-light: #DDD5C6;

  --header-bg: #26364A;
  --subheader-bg: #EEE8DA;
  --overall-bg: #F4EBD7;
  --row-alt: #F8F4EA;

  --box-radius: 0;
  --table-radius: 0;

  --ornament: #A98745;
  --frame-outer: #8E8068;
  --frame-inner: #C6B99E;

  --font-display: "Cormorant Garamond";
  --font-en: "Source Sans 3";
  --font-zh: "Noto Serif TC";

  --font:
    var(--font-en),
    "Noto Sans TC",
    sans-serif;
}
```

## F. 與正式 MIA 的差異

**MIA 是現代國際學院；Classical 則像有百年校史的歐洲私立學校正式學籍文件。**

---

# 我會怎麼讓五套共用同一個 HTML

這其實是最值得你現在就做好的地方。

HTML 完全不要寫：

```html
<div class="blue-header">
```

這種會綁死主題的名稱。

全部只用語意 class：

```html
<body data-theme="formal">

<article class="report-sheet">

  <header class="report-header">
    <div class="school-brand"></div>
    <div class="report-heading"></div>
    <div class="term-info"></div>
  </header>

  <section class="student-meta"></section>

  <table class="report-table">
    ...
  </table>

  <section class="habit-legend"></section>

  <footer class="report-signatures"></footer>

</article>
```

切換時只改：

```js
document.documentElement.dataset.theme = "playful";
```

或 React：

```jsx
<div
  className="report-app"
  data-theme={theme}
>
```

Theme type：

```ts
type ReportTheme =
  | "formal"
  | "playful"
  | "fashion"
  | "pro"
  | "classical";
```

這樣你的使用者之後直接選：

```text
Report Style

● Modern International Academy
○ Playful
○ Fashionable
○ Professional
○ Classical European
```

所有：

* 分數
* Subjects
* Teacher Assessment
* EE / ME / AE / BE
* pagination
* 中英文欄位
* 簽名

**全部不用重新寫。**

只換 CSS。

---

## 五套放在一起，我會這樣定位

| ID          | 主題                           | 最適合的感覺      |
| ----------- | ---------------------------- | ----------- |
| `formal`    | Modern International Academy | **預設款／最均衡** |
| `playful`   | Playful                      | 國小、低中年級、親切  |
| `fashion`   | Fashionable                  | 品牌感最強、最吸睛   |
| `pro`       | Professional                 | 高年級、行政、正式   |
| `classical` | Classical European           | 私校、典禮、精品感   |

如果以 **「老師第一次看到就覺得漂亮」** 排名，我會放：

**Fashion ≈ Formal > Classical > Playful > Professional**

但如果以 **實際長期使用、不容易看膩**：

**Formal > Professional > Fashion > Playful > Classical**

所以你現在把 **MIA `formal` 當預設** 是對的；另外四個比較適合當真正具有個性的「可選皮膚」，而不是互相只改一點顏色。
