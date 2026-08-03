const siteOrigin = "https://pixelstand.pet";

interface OpenInCodexPet {
  nameEn: string;
  packagePath: string;
}

export const packageUrlFor = (packagePath: string) => `${siteOrigin}${packagePath}`;

export const installCommandsFor = (petId: string) => ({
  bash: `curl -fsSL ${siteOrigin}/install.sh | bash -s -- ${petId}`,
  powershell: `& ([scriptblock]::Create((irm ${siteOrigin}/install.ps1))) ${petId}`,
  npx: `npx --yes --package=github:geoqiao/jojo-codex-pet jojo-codex-pet ${petId}`
});

export const openInCodexUrlFor = ({ nameEn, packagePath }: OpenInCodexPet) => {
  const packageUrl = packageUrlFor(packagePath);
  return `codex://pets/install?${new URLSearchParams({
    name: nameEn,
    imageUrl: `${packageUrl}/spritesheet.webp`,
    description: `Unofficial JoJo-themed Codex pet: ${nameEn}`,
    spriteVersionNumber: "2"
  }).toString()}`;
};
