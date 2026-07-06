import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7NOUv7QV7VTWcuMMBXlioIxAQHB7noQM",
  authDomain: "peculab-site.firebaseapp.com",
  projectId: "peculab-site",
  storageBucket: "peculab-site.firebasestorage.app",
  messagingSenderId: "384790791561",
  appId: "1:384790791561:web:efb6e1ba51cddb4c94cd58",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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

const setLikeButton = (button, liked, count) => {
  button.classList.toggle("active", liked);
  button.setAttribute("aria-pressed", String(liked));
  button.textContent = liked ? `Liked (${count})` : `Like (${count})`;
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
  const articleId = root.dataset.articleId;
  const title = root.dataset.articleTitle || document.title;
  const shareUrl = normalizeUrl(root.dataset.articleUrl);
  const likeButton = root.querySelector("[data-like-button]");
  const signOutButton = root.querySelector("[data-sign-out-button]");
  const copyButton = root.querySelector("[data-copy-link]");
  const nativeShareButton = root.querySelector("[data-native-share]");
  const shareLinks = root.querySelectorAll("[data-share-network]");
  const meta = root.querySelector("[data-engagement-user]");

  if (!articleId || !likeButton) return;

  const summaryRef = doc(db, "articleLikes", articleId);
  let currentUser = null;
  let currentCount = 0;
  let likedByUser = false;
  let userLikeRef = null;
  let unsubscribeUserLike = null;

  const updateUserMeta = () => {
    if (!meta) return;
    meta.textContent = currentUser
      ? `Signed in with Google as ${currentUser.displayName || currentUser.email || "reader"}`
      : "Sign in with Google to leave one verified like.";
  };

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

  onSnapshot(summaryRef, (snapshot) => {
    currentCount = snapshot.exists() ? Number(snapshot.data().count || 0) : 0;
    setLikeButton(likeButton, likedByUser, currentCount);
  });

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    likedByUser = false;
    if (unsubscribeUserLike) unsubscribeUserLike();
    unsubscribeUserLike = null;
    userLikeRef = user ? doc(db, "articleLikes", articleId, "users", user.uid) : null;

    updateUserMeta();
    if (!userLikeRef) {
      setLikeButton(likeButton, false, currentCount);
      return;
    }

    unsubscribeUserLike = onSnapshot(userLikeRef, (snapshot) => {
      likedByUser = snapshot.exists();
      setLikeButton(likeButton, likedByUser, currentCount);
    });
  });

  likeButton.addEventListener("click", async () => {
    try {
      likeButton.disabled = true;
      if (!currentUser) {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        userLikeRef = doc(db, "articleLikes", articleId, "users", currentUser.uid);
        updateUserMeta();
      }

      await runTransaction(db, async (transaction) => {
        const likeSnapshot = await transaction.get(userLikeRef);
        const summarySnapshot = await transaction.get(summaryRef);

        if (likeSnapshot.exists()) {
          const nextCount = Math.max(0, Number(summarySnapshot.data()?.count || 0) - 1);
          transaction.delete(userLikeRef);
          transaction.set(
            summaryRef,
            {
              count: nextCount,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          const nextCount = Number(summarySnapshot.data()?.count || 0) + 1;
          transaction.set(userLikeRef, {
            uid: currentUser.uid,
            createdAt: serverTimestamp(),
          });
          transaction.set(
            summaryRef,
            {
              count: nextCount,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      });

      setStatus(root, likedByUser ? "Like removed." : "Thanks for the verified like.");
    } catch (error) {
      const detail = error?.code ? ` (${error.code})` : "";
      setStatus(root, `Google sign-in or like update did not complete${detail}. Please try again.`);
      console.error(error);
    } finally {
      likeButton.disabled = false;
    }
  });

  signOutButton?.addEventListener("click", async () => {
    await signOut(auth);
    setStatus(root, "Signed out.");
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
