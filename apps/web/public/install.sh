#!/usr/bin/env bash
set -euo pipefail

pet_id="${1:-}"
if [[ ! "$pet_id" =~ ^part-[0-9]{2}-[a-z0-9-]+$ ]]; then
  echo "Usage: install.sh part-XX-pet-id" >&2
  exit 2
fi

base_url="${JOJO_CODEX_PET_BASE_URL:-https://jojo-preview.easytry.shop/packages}"
codex_home="${CODEX_HOME:-${HOME}/.codex}"
package_url="${base_url%/}/${pet_id}"
temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/jojo-codex-pet.XXXXXX")"
trap 'rm -rf "$temp_dir"' EXIT

curl -fsSL "$package_url/checksums.sha256" -o "$temp_dir/checksums.sha256"
curl -fsSL "$package_url/pet.json" -o "$temp_dir/pet.json"
curl -fsSL "$package_url/spritesheet.webp" -o "$temp_dir/spritesheet.webp"

if command -v sha256sum >/dev/null 2>&1; then
  (cd "$temp_dir" && sha256sum -c checksums.sha256)
elif command -v shasum >/dev/null 2>&1; then
  (cd "$temp_dir" && shasum -a 256 -c checksums.sha256)
else
  echo "A SHA-256 tool (sha256sum or shasum) is required." >&2
  exit 1
fi

grep -Eq '"id"[[:space:]]*:[[:space:]]*"'"$pet_id"'"' "$temp_dir/pet.json"
grep -Eq '"spriteVersionNumber"[[:space:]]*:[[:space:]]*2' "$temp_dir/pet.json"
grep -Eq '"spritesheetPath"[[:space:]]*:[[:space:]]*"spritesheet.webp"' "$temp_dir/pet.json"

target="$codex_home/pets/$pet_id"
mkdir -p "$target"
install -m 0644 "$temp_dir/pet.json" "$target/pet.json"
install -m 0644 "$temp_dir/spritesheet.webp" "$target/spritesheet.webp"

echo "Installed $pet_id to $target"
echo "Open Codex Settings > Pets, select Refresh, then choose the pet."
