const canonicalBase = "https://peculab.github.io";

const normalizeUrl = (value) => {
  if (value && value.startsWith("http")) return value;
  const path = value || window.location.pathname;
  return `${canonicalBase}${path.startsWith("/") ? path : `/${path}`}`;
};

const setStatus = (root, message) => {
  const status = root.querySelector("[data-engagement-status]");
  if (status) status.textContent = message;
};

const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

document.querySelectorAll("[data-article-engagement]").forEach((root) => {
  const title = root.dataset.articleTitle || document.title;
  const shareUrl = normalizeUrl(root.dataset.articleUrl);
  const copyButton = root.querySelector("[data-copy-link]");
  const nativeShareButton = root.querySelector("[data-native-share]");
  const shareLinks = root.querySelectorAll("[data-share-network]");

  shareLinks.forEach((link) => {
    const network = link.dataset.shareNetwork;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    if (network === "x") {
      link.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    } else if (network === "facebook") {
      link.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (network === "linkedin") {
      link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await copyToClipboard(shareUrl);
      setStatus(root, "Share URL copied.");
    } catch (error) {
      setStatus(root, shareUrl);
    }
  });

  if (!navigator.share && nativeShareButton) {
    nativeShareButton.hidden = true;
  }

  nativeShareButton?.addEventListener("click", async () => {
    try {
      await navigator.share({ title, url: shareUrl });
      setStatus(root, "Share sheet opened.");
    } catch (error) {
      if (error.name !== "AbortError") setStatus(root, "Share sheet could not open.");
    }
  });
});
