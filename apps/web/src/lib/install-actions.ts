type InstallEventType = "install_command_copy_success" | "install_deeplink_click";
type InstallMethod = "bash" | "powershell" | "npx" | "codex";
type InstallLocale = "en" | "zh-CN";

interface InstallActionPayload {
  event_type: InstallEventType;
  pet_id: string;
  method: InstallMethod;
  locale: InstallLocale;
  landing_path: string;
}

const endpoint = "/api/actions.php";

const payloadFor = (element: HTMLElement, eventType: InstallEventType): InstallActionPayload | undefined => {
  const petId = element.dataset.actionPetId;
  const method = element.dataset.actionMethod as InstallMethod | undefined;
  const locale = element.dataset.actionLocale as InstallLocale | undefined;

  if (!petId || !method || !locale) return undefined;

  return {
    event_type: eventType,
    pet_id: petId,
    method,
    locale,
    landing_path: window.location.pathname
  };
};

const send = (payload: InstallActionPayload, preferBeacon = false) => {
  const body = JSON.stringify(payload);

  try {
    if (preferBeacon && typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (queued) return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: preferBeacon
    }).catch(() => undefined);
  } catch {
    // Action totals are optional; the install action must never wait or fail on tracking.
  }
};

const showTemporaryLabel = (button: HTMLButtonElement, label: string, restoreLabel: string) => {
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = restoreLabel;
  }, 1400);
};

const bindCopyButton = (button: HTMLButtonElement) => {
  if (button.dataset.installActionBound === "true") return;
  button.dataset.installActionBound = "true";

  button.addEventListener("click", async () => {
    const command = button.dataset.copyCommand;
    const payload = payloadFor(button, "install_command_copy_success");
    if (!command) return;

    try {
      await navigator.clipboard.writeText(command);
    } catch {
      showTemporaryLabel(button, button.dataset.copyFailedLabel ?? "Copy failed", button.dataset.copyLabel ?? "Copy");
      return;
    }

    showTemporaryLabel(button, button.dataset.copiedLabel ?? "Copied", button.dataset.copyLabel ?? "Copy");

    if (payload) send(payload);
  });
};

const bindPageLinkCopy = (button: HTMLButtonElement) => {
  if (button.dataset.installActionBound === "true") return;
  button.dataset.installActionBound = "true";

  button.addEventListener("click", async () => {
    const pagePath = button.dataset.copyPageLink;
    if (!pagePath) return;

    const pageLink = pagePath.startsWith("http")
      ? pagePath
      : `${window.location.origin ?? ""}${pagePath}`;

    try {
      await navigator.clipboard.writeText(pageLink);
    } catch {
      showTemporaryLabel(
        button,
        button.dataset.pageLinkCopyFailedLabel ?? "Copy failed",
        button.dataset.pageLinkCopyLabel ?? "Copy page link"
      );
      return;
    }

    showTemporaryLabel(
      button,
      button.dataset.pageLinkCopiedLabel ?? "Link copied",
      button.dataset.pageLinkCopyLabel ?? "Copy page link"
    );
  });
};

const bindDeepLink = (link: HTMLAnchorElement) => {
  if (link.dataset.installActionBound === "true") return;
  link.dataset.installActionBound = "true";

  link.addEventListener("click", () => {
    const payload = payloadFor(link, "install_deeplink_click");
    if (payload) send(payload, true);
  });
};

export const bindInstallActions = (root: ParentNode = document) => {
  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-command][data-action-method]")) {
    bindCopyButton(button);
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-page-link]")) {
    bindPageLinkCopy(button);
  }

  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-install-deeplink][data-action-method='codex']")) {
    bindDeepLink(link);
  }
};
