# Google Sheet 即時登記

私有登記表已建立：[PECULAB｜台美學生共創意願登記](https://docs.google.com/spreadsheets/d/1YmxclrZO1zCZH2TyIhbqFHmnOqGDSD-1ZE6dos43TyQ/edit)。`意願登記` 保存逐筆提交；`人數總覽` 的推估起點為 2、1、6、3，新的正式登記會加在上面。官網只讀四個總數，不公開逐筆資料。

這個 Sheet 本身不能接收公開網站 POST；需要它的 Google Apps Script Web App。**不需 FormSubmit API key。**

1. 在 Sheet 裡選 **擴充功能 → Apps Script**，將 `Code.gs` 的內容貼進編輯器並儲存。這必須是從此 Sheet 開啟的「綁定式」腳本，程式才能用 `getActiveSpreadsheet()` 讀到此表。
2. 選 **部署 → 新增部署 → 網頁應用程式**，設為「以我身分執行」與「任何人都可以存取」。第一次部署要由表格擁有者授權 Sheets 與寄信權限。複製部署完成的 `/exec` 網址。
3. 將網址填進網站根目錄的 `sheets-config.js`，commit、PUSH。網址留空時，官網維持既有 FormSubmit 寄信與 COUNT 檔讀取，不會把表單寫到 Google Sheet。
4. 從正式 `https://` 官網送出 `TEST`。Sheet 的 `意願登記` 應出現一行，管理信箱應收到 Apps Script 通知，而 `人數總覽` 的累計仍為 12。接著用另一個 Email 送出正式意願，累計應增為 13，官網重新整理後讀到 13。

來源：[Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)、[Content Service](https://developers.google.com/apps-script/guides/content)、[Lock Service](https://developers.google.com/apps-script/reference/lock)。
