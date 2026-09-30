# Regenerate the same primary links on every HTML page with a header.
# Run from any directory: powershell -File scripts/update-navigation.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$items = @(
  @('index.html', 'Home', '首頁'),
  @('programs.html', 'Courses &amp; Camps', '課程與營隊'),
  @('taiwan-seattle-bridge.html', 'Student Bridge', '台美學生共創'),
  @('services-pricing.html', 'Enterprise POC', '企業 POC'),
  @('case-studies.html', 'Applied Work', '實戰案例'),
  @('workshop/index.html', 'Events', '活動紀錄'),
  @('field-notes/index.html', 'Field Notes', '文章札記'),
  @('about.html', 'About Pecu', '關於 Pecu'),
  @('media.html', 'Media', '媒體報導'),
  @('resources.html', 'Resources', '資源'),
  @('network.html', 'Network', '關係網絡'),
  @('book.html', 'Inquire', '合作詢問')
)
$icon = '<span class="site-menu-icon" aria-hidden="true"><i></i><i></i><i></i></span>'
$count = 0
Get-ChildItem -LiteralPath $root -Filter '*.html' -Recurse | Where-Object {
  $_.FullName.Substring($root.Length) -notmatch '[\\/](\.[^\\/]+|node_modules|_site)[\\/]'
} | ForEach-Object {
  $file = $_
  $s = [IO.File]::ReadAllText($file.FullName)
  $isGigo = $file.Directory.Name -eq 'gigo'
  if (-not $s.Contains('class="site-header"') -and -not $isGigo) { return }
  $isLayout = $file.Directory.Name -eq '_layouts'
  $relative = $file.FullName.Substring($root.Length + 1).Replace('\','/')
  $depth = ($relative.Split('/').Count - 1)
  $up = '../' * $depth
  $isZh = $s -match '<html lang="zh(?:-Hant)?"'
  $languageLink = [regex]::Match($s,'<a class="language-switch"[^>]*>.*?</a>').Value
  $header = [regex]::Match($s,'(?s)<header\b.*?</header>').Value
  if (-not $header) { throw "Missing header: $relative" }
  $links = ''
  if ($isLayout) {
    $links = '{% if page.lang == "zh" or page.lang == "zh-Hant" %}'
    foreach ($item in $items) { $links += '<a href="{{ ''/zh/' + $item[0] + ''' | relative_url }}">' + $item[2] + '</a>' }
    $links += '{% else %}'
    foreach ($item in $items) { $links += '<a href="{{ ''/' + $item[0] + ''' | relative_url }}">' + $item[1] + '</a>' }
    $links += '{% endif %}'
    $translation = [regex]::Match($header,'(?s){% if page.translation_key %}.*?(?=</nav>)').Value
    $links += $translation
    $label = '{% if page.lang == "zh" or page.lang == "zh-Hant" %}開啟或關閉選單{% else %}Toggle navigation{% endif %}'
    $css = "{{ '/site-navigation.css?v=20260929' | relative_url }}"
    $js = "{{ '/site-navigation.js?v=20260929' | relative_url }}"
  } else {
    foreach ($item in $items) {
      if ($isGigo) {
        $links += '<a lang="zh-Hant" href="' + $up + 'zh/' + $item[0] + '">' + $item[2] + '</a>'
        $links += '<a lang="en" href="' + $up + $item[0] + '">' + $item[1] + '</a>'
      } else {
        $target = $item[0]
        $labelIndex = 1
        if ($isZh) { $target = 'zh/' + $target; $labelIndex = 2 }
        $current = ''
        if ($relative -eq $target) { $current = ' aria-current="page"' }
        $links += '<a href="' + $up + $target + '"' + $current + '>' + $item[$labelIndex] + '</a>'
      }
    }
    if ($isGigo) {
      $extra = [regex]::Match($header,'(?s)<div class="site-nav-local">(.*?)</div><!-- /site-nav-local -->')
      if ($extra.Success) { $extra = $extra.Groups[1].Value } else {
        $extra = [regex]::Match($header,'(?s)<nav[^>]*>(.*?)</nav>').Groups[1].Value
      }
      $links += '<hr><div class="site-nav-local">' + $extra + '</div><!-- /site-nav-local -->'
      $label = '<span lang="zh-Hant">開啟或關閉選單</span><span lang="en">Toggle navigation</span>'
    } else {
      $links += $languageLink
      $label = 'Toggle navigation'
      if ($isZh) { $label = '開啟或關閉選單' }
    }
    $css = $up + 'site-navigation.css?v=20260929'
    $js = $up + 'site-navigation.js?v=20260929'
  }
  $menu = '<details class="site-navigation"><summary>' + $icon + '<span class="site-menu-label">' + $label + '</span></summary><nav class="site-nav-links" aria-label="' + $(if ($isZh) { '主要導覽' } else { 'Primary navigation' }) + '">' + $links + '</nav></details>'
  if ($header.Contains('<details class="site-navigation">')) {
    $newHeader = [regex]::Replace($header,'(?s)<details class="site-navigation">.*?</details>',[System.Text.RegularExpressions.MatchEvaluator]{ param($m) $menu })
  } else {
    $newHeader = [regex]::Replace($header,'(?s)<nav\b.*?</nav>',[System.Text.RegularExpressions.MatchEvaluator]{ param($m) $menu })
    $newHeader = [regex]::Replace($newHeader,'(?s)\s*<button class="menu-toggle".*?</button>','')
  }
  $s = $s.Replace($header,$newHeader)
  if (-not $s.Contains('site-navigation.css')) { $s = $s.Replace('</head>','<link rel="stylesheet" href="' + $css + '"></head>') }
  if (-not $s.Contains('site-navigation.js')) { $s = $s.Replace('</body>','<script src="' + $js + '"></script></body>') }
  [IO.File]::WriteAllText($file.FullName,$s,$utf8)
  $count++
}
Write-Output "Updated navigation in $count HTML files."
