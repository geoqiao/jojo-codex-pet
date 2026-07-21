param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$PetId
)

$ErrorActionPreference = "Stop"
if ($PetId -notmatch '^part-[0-9]{2}-[a-z0-9-]+$') {
  throw "Expected a Part-scoped pet ID such as part-03-jotaro-kujo."
}

$BaseUrl = if ($env:JOJO_CODEX_PET_BASE_URL) { $env:JOJO_CODEX_PET_BASE_URL.TrimEnd('/') } else { "https://pixelstand.pet/packages" }
$CodexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$PackageUrl = "$BaseUrl/$PetId"
$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("jojo-codex-pet-" + [guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Path $TempDir | Out-Null
try {
  Invoke-WebRequest "$PackageUrl/checksums.sha256" -OutFile (Join-Path $TempDir "checksums.sha256")
  Invoke-WebRequest "$PackageUrl/pet.json" -OutFile (Join-Path $TempDir "pet.json")
  Invoke-WebRequest "$PackageUrl/spritesheet.webp" -OutFile (Join-Path $TempDir "spritesheet.webp")

  $Expected = @{}
  foreach ($Line in Get-Content (Join-Path $TempDir "checksums.sha256")) {
    if ($Line -notmatch '^([a-f0-9]{64})  ([^/\\]+)$') { throw "Package checksum file is malformed." }
    $Expected[$Matches[2]] = $Matches[1]
  }
  foreach ($FileName in @("pet.json", "spritesheet.webp")) {
    $Actual = (Get-FileHash -Algorithm SHA256 (Join-Path $TempDir $FileName)).Hash.ToLowerInvariant()
    if ($Actual -ne $Expected[$FileName]) { throw "$FileName failed SHA-256 verification." }
  }

  $Manifest = Get-Content (Join-Path $TempDir "pet.json") -Raw | ConvertFrom-Json
  if ($Manifest.id -ne $PetId) { throw "Manifest ID does not match the requested pet." }
  if ($Manifest.spriteVersionNumber -ne 2) { throw "Only Codex pet v2 packages are accepted." }
  if ($Manifest.spritesheetPath -ne "spritesheet.webp") { throw "Manifest spritesheetPath must be spritesheet.webp." }

  $Target = Join-Path (Join-Path $CodexHome "pets") $PetId
  New-Item -ItemType Directory -Force -Path $Target | Out-Null
  Copy-Item -Force (Join-Path $TempDir "pet.json") (Join-Path $Target "pet.json")
  Copy-Item -Force (Join-Path $TempDir "spritesheet.webp") (Join-Path $Target "spritesheet.webp")

  Write-Host "Installed $PetId to $Target"
  Write-Host "Open Codex Settings > Pets, select Refresh, then choose the pet."
}
finally {
  Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
}
