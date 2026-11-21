const announceCopyStatus = (button: HTMLButtonElement, message: string) => {
  const scope = typeof button.closest === "function" ? button.closest("section, main, body") : null;
  const status = scope?.querySelector<HTMLElement>("[data-copy-status]")
    ?? (typeof document !== "undefined" ? document.querySelector<HTMLElement>("[data-copy-status]") : null);
  if (!status) return;
  status.textContent = "";
  window.setTimeout(() => {
    status.textContent = message;
  }, 20);
};

const showTemporaryLabel = (button: HTMLButtonElement, label: string, restoreLabel: string) => {
  button.textContent = label;
  announceCopyStatus(button, label);
  window.setTimeout(() => {
    button.textContent = restoreLabel;
  }, 1400);
};

const bindCopyButton = (button: HTMLButtonElement) => {
  if (button.dataset.installActionBound === "true") return;
  button.dataset.installActionBound = "true";

  button.addEventListener("click", async () => {
    const command = button.dataset.copyCommand;
    if (!command) return;

    try {
      await navigator.clipboard.writeText(command);
    } catch {
      showTemporaryLabel(button, button.dataset.copyFailedLabel ?? "Copy failed", button.dataset.copyLabel ?? "Copy");
      return;
    }

    showTemporaryLabel(button, button.dataset.copiedLabel ?? "Copied", button.dataset.copyLabel ?? "Copy");
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

export const bindInstallActions = (root: ParentNode = document) => {
  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-command][data-action-method]")) {
    bindCopyButton(button);
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-page-link]")) {
    bindPageLinkCopy(button);
  }
};
