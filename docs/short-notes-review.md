# 官網短文的本機編輯與檢視流程

使用者已明確要求將第一批 20 篇文章的 40 個中英文版本推送到 GitHub 並公開。核准稿加入正式 `_shorts/`；Facebook 原始資料、私人選文清單、未選入稿件與本機 HTML 預覽仍留在 `.facebook-import/`，受 Git 忽略並由 Jekyll 排除。不要把這個私人資料夾加入 Git 或部署。

## 本輪內容

- 20 篇編輯稿：AI 教學 8 篇、家庭與青少年 6 篇、AI 專案 6 篇。
- 每篇保留原文正文與原始日期；編輯標題、摘要、閱讀問題與歷史情境註記另外提供。
- 20 篇均有英文全文翻譯，包含英文標題、摘要、閱讀問題與情境註記。英文版明示翻譯身分，中文原文不改寫。
- 翻譯檔位於私人目錄 `.facebook-import/curated/translations/`，以原始 import ID 對應。中英文原始日期相同，逐篇保留來源網址；這些自動檢查不保證語義翻譯完美，公開前仍可進行編輯審校。
- 中英文版各有獨立網址、自指 canonical、互相對應的 hreflang 與頁面切換；中英文索引與主題頁只列出對應語言。
- 三個主題各有中英文入口，共 6 頁；每個語言分別顯示 8、6、6 篇文章。RSS 分為 `/shorts/feed.xml`（中文）與 `/shorts/feed-en.xml`（英文），避免重複計入翻譯版。
- 主題入口每頁提供三組問題與回答，串接文章、現有服務頁及合作詢問頁。
- 索引可依全文關鍵字、主題、年份與來源組合篩選；未啟用 JavaScript 時仍能閱讀完整列表。

## 更新本機預覽

本機預覽使用官網的實際 Liquid 版型和樣式，由 LiquidJS 輔助渲染。它不等同完整 Jekyll 建置，也沒有取代 GitHub Pages workflow。

預覽依賴安裝在被忽略的目錄，首次需要：

```powershell
npm.cmd --prefix .local-artifacts/shorts-preview-runtime install --no-audit --no-fund liquidjs@10.21.1 markdown-it@14.1.0 yaml@2.8.1
```

若工作環境使用系統信任的憑證鏈，可依環境設定 `NODE_USE_SYSTEM_CA=1`，不要停用 HTTPS 憑證驗證。

```powershell
node scripts/prepare-short-review.mjs
node scripts/build-short-review.mjs
node scripts/check-short-review.mjs
node --test scripts/import-facebook.test.mjs scripts/facebook-html.test.mjs scripts/shorts-filters.test.mjs
```

開啟 `.facebook-import/website-preview/index.html` 即可檢視本機 HTML，不需要架設公開網站。預覽頁有明顯本機標示、noindex、nofollow、no-referrer，且預覽 robots.txt 禁止爬取。這些標記不是存取控制；保護依據是檔案只在本機，未上傳公開主機。

`prepare-short-review.mjs` 只把編輯稿寫入 `.facebook-import/curated/_shorts/`，且保留 `published: false`。`build-short-review.mjs` 只在記憶體中將它們放入預覽資料集，以測試實際列表與文章頁；不會將資料寫入正式 `_shorts/`。

檢查包含：中英文索引與三個主題文章數、內部連結、JSON-LD、未處理 Liquid、原文正文逐字相同、逐篇雙語配對、翻譯保留來源網址、每個語言 RSS 數量，以及未核准文章沒有進入公開原始碼。這些結構檢查無法取代人工翻譯審校。此環境沒有完成瀏覽器視覺檢查或完整 Jekyll 建置。

## 公開前

首批的公開授權已在對話中取得，執行 `node scripts/publish-reviewed-shorts.mjs --publish` 準備正式原始檔。後續新文章仍需依當次授權範圍處理，不能把這次授權推及未選入的 652 篇或未來匯出資料。

1. 由使用者確認哪些編輯稿可公開；本輪並未公開。
2. 把核准文章從私人編輯稿目錄加入正式 `_shorts/`，將核准文章的 `published` 設為 `true`，其他文章保持私人。
3. 使用真正的 Jekyll 建置，檢查正文、主題頁、RSS、sitemap 與雙語入口。
4. 經授權後部署；再驗證公開網址與站長工具收錄情形。來源媒體附件未搬移時，文章必須保留相應註記。
