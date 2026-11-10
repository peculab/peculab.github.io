# Facebook 短文匯入

短文與既有 `_posts/` 雙語長文分開，存放於 `_shorts/`。網站建置時輸出完整 HTML，每篇擁有 `/shorts/檔名.html` 獨立網址。中英文索引各列出對應語言；精選官網短文提供中文原文與英文全文翻譯，以相同 `translation_key` 及 `alternate_zh`、`alternate_en` 配對。中文 RSS 位於 `/shorts/feed.xml`，英文 RSS 位於 `/shorts/feed-en.xml`，網站地圖由 `jekyll-sitemap` 產生。公開與可檢索不保證任何 AI 會收錄或引用。

## 取得資料

1. 在 Facebook 設定中開啟「帳號管理中心 → 你的資訊和權限」，尋找「匯出資訊／下載你的資訊」。選取個人帳號，只匯出「貼文」，格式選 **JSON**，日期選 **2023-11-09 至 2026-11-09**。下載後解壓縮。
2. 切換到 **PecuLab LLC 粉專**，在粉專設定尋找「下載你的資訊／匯出資訊」，另行匯出粉專貼文 JSON。介面名稱與位置可能依帳號、權限而異；請確認下載結果包含粉專自己的貼文。
3. 將兩份解壓縮資料分別存於專案外的資料夾，或已忽略的 `.facebook-import/exports/` 下。不要把 Facebook 原始 ZIP 或 JSON 放在公開網站目錄中。

Meta 的功能說明：https://about.fb.com/news/2023/10/manage-your-information-across-apps/

## 本機整理

需要 Node.js 18 以上。從專案根目錄執行：

```powershell
node scripts/import-facebook.mjs --input 'D:\Facebook\personal' --source profile --since 2023-11-09 --until 2026-11-09
node scripts/import-facebook.mjs --input 'D:\Facebook\peculab-page' --source page --since 2023-11-09 --until 2026-11-09
```

可傳入單一 JSON 檔，或解壓縮資料夾。資料夾模式只找已知貼文檔名，不讀取訊息、朋友名單等其他分類。未知檔名請直接指定該 JSON。遇到未知結構或 JSON 錯誤會停止，不猜測內容。

亦支援已驗證的 Meta 中文 **HTML** 匯出（`your_posts__check_ins__photos_and_videos_1.html`）。可傳入該 HTML 或所在資料夾，不需要重新下載 JSON。HTML 轉換只讀取 `_2pin` 中的獨立正文，排除相片預覽、動態回顧中的舊文、標註名單、系統標題與更新時間。日期使用匯出頁首明示的時區偏移，再以洛杉磯日期篩選；HTML 日期沒有逐筆機器時間戳記，若要核實歷史時區精度，應以 JSON 匯出的時間戳記比對。無法識別的日期或格式會中止匯入。

HTML 的 `facebook.com/dyi/l/` 是匯出檔專用連結，不作為公開文章來源網址。HTML 匯入會額外生成本機 `review.json`，保留逐筆狀態和附件數量；未確認公開範圍前，不將全文清單放進公開網站。

預設產生 `.facebook-import/profile/` 與 `.facebook-import/page/` 下的 Markdown 整理稿和 `report.json`。這些資料被 Git 忽略、Jekyll 排除，尚未上線。先確認日期、文字、來源及公開範圍，再將選定的 `.md` 複製到 `_shorts/`。若確認該份 JSON 所有文字貼文均可公開，可用同一命令加 `--publish` 直接寫入 `_shorts/`；這只準備網站原始檔，部署仍經既有 GitHub Pages 工作流程。

## 匯入規則與限制

- 保留原始發文時間，以洛杉磯日期判定範圍；不修改原文，只以首行產生標題。
- 個人頁和粉專各自標示來源。若匯出檔提供有效貼文網址，會保留原始連結；否則只連到帳號／粉專，不捏造貼文網址。
- 僅匯入 `data[].post` 或 `post` 的明確文字欄位。不把活動紀錄標題、留言或照片描述冒充貼文。
- 相同來源、時間、文字會得到相同檔名。重跑不覆寫已存在的文章。原文若修改，會產生新 ID，需人工合併；跨帳號的同文也保留為不同來源，必要時人工整併。
- 純照片、影片、限時動態或沒有貼文文字的項目會列為 `no_post_text`，不宣稱已全部搬完。附件尚未複製，完整搬遷需在取得真實匯出檔後補足各種實際格式並核對統計。
- Facebook 匯出未必提供每篇的公開範圍；整理稿須確認哪些私人貼文適合搬到公開網站。
- 原文中的 HTML 與 Liquid 字元會被轉義，避免被當成網站程式。
- 之後可定期匯出新貼文再增量匯入；目前沒有自動連線 Facebook 或背景同步。

## 直接發表

複製 `_templates/short-template.md` 建立中文稿，再準備對應的 `-en.md` 英文全文版本。兩份稿件設定 `lang: zh-Hant`／`lang: en`、共同的 `translation_key`，以及兩份稿件的 `alternate_zh`、`alternate_en` 網址。英文稿另以 `translation_of` 指向中文稿，並提供英文 `translation_note`。依使用者目前偏好，精選官網短文以中英文配對準備。文章網址取決於檔名，公開後請保持穩定；尚待檢視的稿件仍應保存在被忽略的私人目錄，不能因準備翻譯就自動公開。

## 驗證

```powershell
node --test scripts/import-facebook.test.mjs
node --test scripts/facebook-html.test.mjs
```

GitHub Pages 使用既有 Jekyll workflow 建置。發布後確認中英文索引、單篇、`/shorts/feed.xml`、`/sitemap.xml` 和 `/robots.txt` 可正常讀取，再將網站地圖提交搜尋引擎的站長工具。
