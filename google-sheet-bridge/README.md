# Google Sheet 即時登記

先前由連接器建立的 Sheet 在使用者瀏覽器顯示「unable to open the file」，不能當作可部署的表格。請在你自己的瀏覽器以要管理登記的 Google 帳號建立一份**空白 Google Sheet**。程式會自行建立 `意願登記` 與 `人數總覽`，並從 2、1、6、3 的起點開始累計。逐筆資料只留在私人表格；網站只讀四個加總。

這個 Sheet 本身不能接收公開網站 POST；需要它的 Google Apps Script Web App。**不需 FormSubmit API key。**

1. 打開你新建的空白 Sheet，選 **擴充功能 → Apps Script**，將 `Code.gs` 的全部內容貼進編輯器並儲存。必須從此 Sheet 開啟綁定式腳本。
2. 在編輯器上方選 `setupBridge` 並按 **執行**，依畫面授權。回到 Sheet，確認出現 `意願登記` 與 `人數總覽` 兩個分頁，後者的總數為 12。
3. 選 **部署 → 新增部署 → 網頁應用程式**，設為「以我身分執行」與「任何人都可以存取」。複製部署產生的 `/exec` 網址。
4. 將 `/exec` 網址填進網站根目錄的 `sheets-config.js`，commit、PUSH。網址留空時，網站仍沿用 FormSubmit 寄信與 `interest-counts.json`。
5. 從正式 `https://` 官網用 `TEST` 送出一次。Sheet 應增加一筆測試資料、管理信箱收到通知，但總數維持 12。再用另一個 Email 送出正式意願，總數應增加為 13，官網重新整理後讀到 13。

來源：[Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)、[Content Service](https://developers.google.com/apps-script/guides/content)、[Lock Service](https://developers.google.com/apps-script/reference/lock)。
