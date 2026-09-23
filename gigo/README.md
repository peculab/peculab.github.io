# PecuLab K–2 文化邏輯探索課

本地完成的課程提案，尚未發布、報名或確認 NKCC 合作。

- `index.html`：家長閱讀的中英文介紹、36 堂原創課程、6 堂試辦資訊。
- `planning.html`：官方價格比較、營運假設、可互動的損益與設備現金試算。
- `build_site.py`：雙語內容與每週教案的單一來源；編輯後執行以產生兩個 HTML。
- `styles.css`、`app.js`：獨立樣式、語言切換與試算邏輯，無前端套件依賴。
- `verify_site.py`：使用 Playwright 與已安裝的 Microsoft Edge 檢查互動與窄螢幕。
- `ref/`：使用者提供的參考資料；兩支示範影片已重新命名為 `coding-robotics-demo-01.mp4`、`coding-robotics-demo-02.mp4`，影片內容未變更。

## 預覽與更新

可直接用瀏覽器開啟 `index.html`。亦可在此目錄執行：

```sh
python -m http.server 8000
```

開啟 `http://localhost:8000/`。網址支援 `?lang=zh` 與 `?lang=en`，語言偏好保留在瀏覽器。沒有後端、付款、個資蒐集表單或自動傳送訊息。

修改內容後：

```sh
python build_site.py
```

Windows 本次環境的 Python 可用路徑為 `C:\Users\pecu6\.local\bin\python3.14.exe`。

瀏覽器驗證：

```sh
uv run --with playwright python verify_site.py
```

若環境使用企業憑證，可加上 `uv --system-certs`。驗證程式使用臨時本機伺服器，結束即關閉；預覽截圖存至作業系統暫存目錄。

## 決策摘要（2026-09-22）

建議：6 堂 US$180，每堂 50 分鐘；目標 10 人、主教與助教各一位。8 人是預設模型的極薄損益兩平門檻，12 人為建議試辦上限。師生配置是教學建議，不是法規判定。

預設每堂成本：主教 $80、助教 $30、行政 $10、設備攤提 $20，固定成本共 $140；每生耗材 $3。市府分潤 **30% 僅為假設**，並假設已含場地與報名。每堂學費 $30，故每生贡献為 $18；8 人餘額 $4、10 人 $40、12 人 $76。這已計入老師報酬，但實際稅費、退款與額外成本仍需確認。

設備預算 $1,000，以 50 次使用攤提，不是假設單一 36 堂年度可全數攤完。首梯 10 人營運餘額 $240，若同時購入全部設備，現金餘額是 **−$640**（以全額購置取代折舊，未重複扣除）。可先使用現有／借用教具，再決定採購。確認 10 套組供貨狀態。

NKCC 公開多功能室居民價 $125/小時，平日至少 2 小時。若自行租場加上 3% 金流假設，同樣 10 人每堂虧 $129，需 15 人損益兩平；超過建議試辦上限。優先洽談市府課程合作與合適教室；未假定已有合作或折扣。

全年為 30 堂學年＋6 堂暑期延伸，第一梯包含在內。課程季節是配置範例，沒有捏造已訂場的日期或固定下午起始時間；正式日期仍要核對學校行事曆與接送需求。

## 研究依據

- [2026 秋／2027 冬 Youth Guide](https://www.kirklandwa.gov/files/sharedassets/public/v/1/parks-amp-comm-services/recreation/rec-guide/2026-fall-2027-winter-recreation-guide_youth.pdf)：印刷頁 22 的 Little Coders，5–7 歲，9/21–11/9 共 8 次，每次 60 分鐘，居民 $234／非居民 $281。頁 23 的 Wilderness Medicine：10 次 60 分鐘，$380／$456。頁 25 的 Elementary Tumbling 1（24971）：6 次 45 分鐘，$72／$86。課次由日期區間與停課標示計算。
- [2026-05-26 Facility Rental Guide](https://www.kirklandwa.gov/files/sharedassets/public/v/1/parks-amp-comm-services/pdfs/finalized-rental-guide-5.26.26.pdf)：第 4 頁 NKCC 費率與 2 小時最低租期；第 6 頁 $300 可退押金。未將押金當作費用，但應列為額外現金需求。
- [官方教材 10 套組](https://thamesandkosmos.com/products/kids-first-coding-robotics-classroom-bundle-10-pack)：$999.95，查詢時顯示 backordered；採購時另確認稅運費。
- 使用者提供的 `ref/Facebook.pdf` 決定課程定位：故事、文化任務、不插電邏輯、修正與表達。
- `ref/Kids-First-Coding-_-Robotics-CTSA-Curriculum-Correlation.pdf` 與[原廠教育資源](https://thamesandkosmos.com/pages/educator-resources)是教材參考；本頁未宣稱新課程經 CSTA 認證，也未複製該 PDF 的疑似標準代碼誤植。

REC1 動態目錄自動讀取回傳 403。最新官方 Youth PDF 連結從市府 Recreation Activity Guide 頁以 Edge 取得，PDF 以 Playwright request + pypdf 讀取成功（HTTP 200）。比較資料是官方手冊刊載價，正式招生應重新確認即時目錄與合作合約。

## 已驗證

中英文切換與語言保留、36 堂／6 模組、1440／390／320 px 無頁面橫向溢出、兩種成本模式、設備現金、零邊際貢獻、無效輸入、重設，以及無 JavaScript 錯誤。表格在窄螢幕內可水平捲動。
