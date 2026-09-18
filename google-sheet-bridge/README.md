# Google Sheet 即時登記與授權恢復

網站統計唯一來源是既有 Google Sheet 的 `人數總覽!A2:E5`，由 Apps Script 每次讀取 E 欄累計，只回傳四類加總。網站每分鐘更新；失敗顯示「—」與錯誤訊息，不讀取 interest-counts.json，也不顯示預填數字。私人登記資料不需公開。

- Sheet：https://docs.google.com/spreadsheets/d/1YmxclrZO1zCZH2TyIhbqFHmnOqGDSD-1ZE6dos43TyQ/edit
- Apps Script：https://script.google.com/u/0/home/projects/14MWDihJKaGtEaPcDVkcO5z7Ap-GIavr-VO74vJgCB5NPbAa47DT_A1TN/edit

## 恢復既有專案

1. 使用原部署者的 Google 帳號開啟上述 Apps Script，把本目錄 `Code.gs` 貼入並儲存。程式已明確指定上述 Sheet ID。
2. 選取 `setupBridge` → 執行，依 Google 畫面重新授權。這個函式保留既有分頁與數據，只在分頁不存在時建立。Google Drive 連接器授權與 Apps Script 授權是兩件不同的事。
3. 選「部署 → 管理部署」，編輯既有網頁應用程式，版本選「新版本」，設定「以我身分執行」和「任何人」，再部署。更新既有部署可以沿用 sheets-config.js 的 /exec 網址；若建立新部署，必須同步更新該設定檔。
4. 在無痕視窗開啟部署 /exec 網址並加上 `?view=counts`，應看到 `window.bridgeCount({...});`，且四類數值與 Sheet E2:E5 一致。若顯示登入、授權或錯誤頁，需先修復 Google 端部署與授權。
5. 將網站變更發布到 GitHub Pages，確認中英文頁面都顯示 Sheet 的現有總數。Sheet 更新後，頁面最遲於下一次成功輪詢更新（每分鐘）。讀取失敗時不使用本機備援。

不必新建 Sheet、不必把含個資的登記表公開，也不必重設統計。`Code.gs` 的初始值只用於建立不存在的「人數總覽」。

參考：[Web Apps](https://developers.google.com/apps-script/guides/web)、[授權](https://developers.google.com/apps-script/guides/services/authorization)。