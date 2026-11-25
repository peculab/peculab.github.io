"use strict";

(() => {
  const config = EVENT_CONFIG;
  const all = (selector) => [...document.querySelectorAll(selector)];
  const one = (selector) => document.querySelector(selector);
  const write = (selector, value) => all(selector).forEach((node) => { node.textContent = value; });
  const show = (selector, visible) => all(selector).forEach((node) => { node.hidden = !visible; });
  const reveal = (selector, value) => {
    if (value) {
      write(selector, value);
      show(selector, true);
    }
  };
  const link = (node, url) => {
    if (url) node.href = url;
    else node.removeAttribute("href");
    node.hidden = !url;
  };
  const email = (address) => "mailto:" + address;
  const money = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: config.pricing.currency, maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);
  const date = new Date(config.date + "T12:00:00Z");
  const dateText = (options) => new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone, ...options
  }).format(date);
  const displayTime = (value) => {
    const [hours, minutes] = value.split(":").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC", hour: "numeric", minute: "2-digit"
    }).format(new Date(Date.UTC(2000, 0, 1, hours, minutes)));
  };

  all("[data-field]").forEach((node) => {
    const value = config[node.dataset.field];
    if (value) {
      node.textContent = value;
      node.hidden = false;
    }
  });
  const dateNode = one("[data-date]");
  dateNode.dateTime = config.date;
  dateNode.textContent = dateText({ dateStyle: "full" });
  write("[data-short-date]", dateText({ month: "long", day: "numeric" }));
  const venue = [config.venueName, config.venueAddress].filter(Boolean).join(", ");
  const zone = config.timezone === "America/Los_Angeles" ? "Pacific Time" : config.timezone;
  const time = config.time
    ? [displayTime(config.time), config.endTime && displayTime(config.endTime)].filter(Boolean).join("–") + " " + zone
    : "Time to be announced";
  write("[data-when]", config.time || venue ? time + " · " + (venue || "Venue to be announced") : "Time & Venue: To Be Announced");
  link(one("[data-map]"), config.venueMapUrl);

  const statuses = {
    "coming-soon": "Registration Opening Soon",
    "open": "Registration Open",
    "sold-out": "Event Sold Out",
    "closed": "Registration Closed",
    "completed": "Event Completed",
    "cancelled": "Event Cancelled"
  };
  const state = Object.hasOwn(statuses, config.registrationStatus) ? config.registrationStatus : "coming-soon";
  const status = state === "open" && !config.registrationEnabled ? "coming-soon" : state;
  const open = status === "open" && Boolean(config.urls.eventRegistration);
  const membership = config.membership;
  const enroll = config.membershipEnrollmentEnabled && Boolean(config.urls.membershipApplication && config.urls.membershipRegistration);
  const eligible = [
    membership.annualMemberComplimentaryAdmission, membership.studentMemberComplimentaryAdmission,
    membership.lifetimeMemberComplimentaryAdmission, membership.existingMemberComplimentaryAdmission
  ].some((policy) => policy === true);
  const claim = open && config.memberTicketVerified && eligible;
  const annualBenefit = claim && membership.annualMemberComplimentaryAdmission === true;
  const pending = "Complimentary event admission arrangements are being finalized.";
  const terminal = ["sold-out", "closed", "completed", "cancelled"].includes(status);
  const statusLabel = open ? statuses.open : status === "open" ? statuses["coming-soon"] : statuses[status];

  write("[data-status]", statusLabel);
  show("[data-status]", !open);
  write("[data-mobile-status]", open ? "Register Now" : statusLabel);
  write("[data-desktop-status]", terminal ? statusLabel : "Register Now");
  show("[data-purchase-status]", !open);
  write("[data-year]", membership.year);
  all("[data-price]").forEach((node) => { node.textContent = money(config.pricing[node.dataset.price]); });
  show("[data-member-flow]", enroll);
  all("[data-application]").forEach((node) => link(node, enroll ? config.urls.membershipApplication : null));
  all("[data-enroll]").forEach((node) => {
    link(node, enroll ? config.urls.membershipRegistration : null);
    if (node.dataset.track === "annual_membership_click") {
      node.textContent = node.textContent.replace(/\b2027\b/g, membership.year);
    }
  });
  all("[data-ticket]").forEach((node) => {
    const member = node.dataset.ticket === "member";
    link(node, (member ? claim : open) ? config.urls.eventRegistration : null);
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    node.dataset.track = `${node.dataset.ticket}_ticket_click`;
  });

  const annualNote = annualBenefit
    ? "Includes a free forum ticket when you redeem your member discount code."
    : terminal ? statusLabel + ". Membership enrollment does not guarantee admission."
    : membership.annualMemberComplimentaryAdmission === false ? "Annual membership is available separately from forum admission."
    : pending;
  show("[data-benefit]", annualBenefit);
  show(".claim [data-claim]", !annualBenefit);
  write("[data-annual-note]", annualNote);
  write("[data-claim]", claim
    ? "Request a code on your membership form. The organizer verifies your payment and emails your code. Use it at Zeffy event checkout."
    : terminal ? statusLabel + ". Complimentary tickets are unavailable."
    : "Complimentary member ticket registration will open once the registration arrangements are finalized.");
  if (status === "completed" && config.recap) {
    write("[data-recap-text]", config.recap);
    show("[data-recap]", true);
    all('a[href="#registration"].button').forEach((anchor) => {
      anchor.href = "#event-recap";
      anchor.textContent = "View Event Recap";
    });
  }

  if (config.organizerContactEmail) {
    all("[data-contact]").forEach((node) => link(node, email(config.organizerContactEmail)));
  }
  link(one("[data-accessibility]"), config.accessibilityContact ? email(config.accessibilityContact) : null);
  if (config.refundPolicy) {
    write("[data-refund]", config.refundPolicy);
    show("[data-refund-section]", true);
  }

  all("[data-speaker]").forEach((node) => {
    const value = config.speaker[node.dataset.speaker];
    if (value) {
      node.textContent = value;
      node.hidden = false;
    }
  });
  if (config.speaker.photo) {
    all("[data-portrait]").forEach((node) => {
      node.src = config.speaker.photo;
      node.alt = config.speaker.name;
      node.hidden = false;
      node.parentElement.classList.add("has-portrait");
    });
  }
  one("[data-agenda]").replaceChildren(...AGENDA.map((item) => {
    const row = document.createElement("li");
    row.append(item.title);
    if (item.confirmed && item.startTime) {
      const start = document.createElement("time");
      start.dateTime = item.startTime;
      start.textContent = displayTime(item.startTime) + " " + zone;
      row.prepend(start);
    }
    return row;
  }));

  const organizations = ORGANIZATIONS.filter((org) => org.confirmed)
    .sort((left, right) => left.displayOrder - right.displayOrder);
  const addLogo = (slot, org, lazy) => {
    if (!org.logoApproved || !org.logo) {
      slot.replaceChildren();
      return;
    }
    if (slot.firstElementChild?.getAttribute("src") === org.logo) return;
    const logo = document.createElement("img");
    logo.src = org.logo;
    logo.alt = "";
    logo.width = org.logoWidth || 56;
    logo.height = org.logoHeight || 40;
    if (lazy) logo.loading = "lazy";
    logo.addEventListener("error", () => logo.remove(), { once: true });
    slot.replaceChildren(logo);
  };
  const organizer = organizations.find((org) => org.id === "natea");
  if (organizer) addLogo(one("[data-header-logo]"), organizer, false);
  all("[data-org-list]").forEach((list) => {
    const cards = new Map([...list.children].map((card) => [card.dataset.org, card]));
    const detailed = list.dataset.orgList === "partners";
    list.replaceChildren(...organizations.map((org) => {
      const card = cards.get(org.id) || document.createElement("article");
      card.className = "org";
      card.dataset.org = org.id;
      let brand = card.firstElementChild || document.createElement("span");
      const name = brand.querySelector("strong") || document.createElement("strong");
      const slot = brand.querySelector("[data-logo]") || document.createElement("span");
      if (!brand.firstElementChild) {
        slot.dataset.logo = "";
        brand.append(slot, name);
      }
      const tag = org.website ? "A" : "SPAN";
      if (brand.tagName !== tag) {
        brand = document.createElement(tag.toLowerCase());
        brand.append(slot, name);
      }
      brand.dataset.orgBrand = "";
      if (org.website) {
        brand.href = org.website;
        brand.dataset.orgLink = org.id;
      }
      name.textContent = org.name;
      addLogo(slot, org, list.dataset.orgList !== "credits");
      const role = document.createElement("p");
      role.textContent = org.role;
      card.replaceChildren(brand, role);
      if (detailed) {
        const description = document.createElement("p");
        description.dataset.description = "";
        description.textContent = org.description || "";
        if (org.description) card.append(description);
      }
      return card;
    }));
  });
  all("[data-org-link]").forEach((node) => {
    const org = organizations.find((entry) => entry.id === node.dataset.orgLink);
    link(node, org?.website);
    node.dataset.track = "organization_website_click";
  });

  const url = config.canonicalUrl;
  const encoded = encodeURIComponent(url);
  const shareLinks = {
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + encoded,
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + encoded,
    line: "https://social-plugins.line.me/lineit/share?url=" + encoded,
    email: "mailto:?subject=" + encodeURIComponent(config.title) + "&body=" + encodeURIComponent(config.shareDescription + "\n\n" + url)
  };
  const feedback = one(".feedback");
  link(one("[data-share-url]"), url);
  write("[data-share-url]", url);
  all("[data-share]").forEach((node) => {
    node.href = shareLinks[node.dataset.share];
    node.dataset.track = "social_share_click";
  });
  const copy = one("[data-copy]");
  copy.hidden = !navigator.clipboard?.writeText;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      feedback.textContent = "Event link copied.";
      track("copy_event_link");
    } catch {
      feedback.textContent = "Copy was unavailable. Select the event link above to copy it.";
    }
  });
  const nativeShare = one("[data-native-share]");
  nativeShare.hidden = !navigator.share;
  nativeShare.addEventListener("click", async () => {
    track("social_share_click", { channel: "native" });
    try {
      await navigator.share({ title: config.title, text: config.shareDescription, url });
    } catch (error) {
      if (error.name !== "AbortError") feedback.textContent = "Sharing was unavailable. Use another sharing option.";
    }
  });

  // An optional first-party adapter can subscribe to this event before app.js runs.
  const analytics = config.analytics;
  const query = new URLSearchParams(location.search);
  const allowed = (key, values) => values.includes(query.get(key)) ? query.get(key) : undefined;
  const campaign = Object.fromEntries(Object.entries({
    utm_source: allowed("utm_source", analytics.allowedSources),
    utm_medium: allowed("utm_medium", analytics.allowedMedia),
    utm_campaign: allowed("utm_campaign", [analytics.campaign]),
    utm_content: allowed("utm_content", analytics.allowedContent)
  }).filter(([, value]) => value !== undefined));
  function track(name, properties = {}) {
    if (!analytics.enabled || analytics.provider !== "custom-event") return;
    document.dispatchEvent(new CustomEvent("forum:analytics", {
      detail: { name, measurementId: analytics.measurementId, slug: config.slug, ...campaign, ...properties }
    }));
  }
  if (analytics.enabled && analytics.provider === "custom-event") {
    show("[data-analytics-privacy]", true);
    track("page_view");
    all("[data-track]").forEach((node) => node.addEventListener("click", () => {
      const properties = node.dataset.share ? { channel: node.dataset.share }
        : node.dataset.orgLink ? { organization: node.dataset.orgLink } : {};
      track(node.dataset.track, properties);
    }));
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          track(entry.target.id + "_section_view");
          observer.unobserve(entry.target);
        }
      }));
      ["registration", "speaker"].forEach((id) => observer.observe(one("#" + id)));
    }
  }
})();
