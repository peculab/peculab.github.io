param([Parameter(Mandatory=$true)][string]$SourceDirectory)
$ErrorActionPreference = 'Stop'
# Read private inputs locally. Only allowlisted aggregate fields enter the website.
[xml]$graph = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $SourceDirectory 'LinkedIn_Affiliation_Network.graphml')
$rows = @(Import-Csv -Encoding UTF8 -LiteralPath (Join-Path $SourceDirectory 'LinkedIn_Connections_Enriched.csv'))
$nodes = @($graph.graphml.graph.node | ForEach-Object {
    $fields = @{}; foreach ($item in $_.data) { $fields[$item.key] = $item.InnerText }
    [ordered]@{id=$_.id; label=$fields.label; category=$fields.category; frequency=[int]$fields.frequency; strength=[double]::Parse($fields.strength,[cultureinfo]::InvariantCulture); betweenness=[double]::Parse($fields.betweenness,[cultureinfo]::InvariantCulture)}
})
$edges = @($graph.graphml.graph.edge | ForEach-Object {
    $fields = @{}; foreach ($item in $_.data) { $fields[$item.key] = $item.InnerText }
    [ordered]@{source=$_.source; target=$_.target; support=[int]$fields.support; pmi=[double]::Parse($fields.pmi,[cultureinfo]::InvariantCulture); weight=[double]::Parse($fields.weight,[cultureinfo]::InvariantCulture)}
})
$known = @($rows | Where-Object { $_.'Inferred Organization Country' -and $_.'Inferred Organization Country' -ne 'Not reliably inferred' }).Count
$data = [ordered]@{snapshot='2026-09-22'; total=$rows.Count; countryKnown=$known; companyMinimum=3; supportMinimum=4; nodes=$nodes; edges=$edges}
$json = ConvertTo-Json -InputObject $data -Depth 8
$target = Join-Path $PSScriptRoot '../assets/network-data.js'
[IO.File]::WriteAllText($target, "window.PECU_NETWORK = $json;`n", [Text.UTF8Encoding]::new($false))
Write-Output "Exported $($rows.Count) records as $($nodes.Count) aggregate nodes / $($edges.Count) edges. Country inference: $known records."
