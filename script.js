(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header elevation on scroll
  const header = qs("[data-elevate]");
  const setHeader = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 6);
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // Mobile nav
  const nav = qs("#site-nav");
  const navToggle = qs("[data-nav-toggle]");
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  };
  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });
  qsa("#site-nav a").forEach((a) => a.addEventListener("click", closeNav));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Modals
  const newsletterModal = qs("#newsletter-modal");
  const donateModal = qs("#donate-modal");
  const a11yModal = qs("#accessibility-modal");

  const safeShowModal = (dlg) => {
    if (!dlg) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
  };

  qs("[data-open-newsletter]")?.addEventListener("click", () => safeShowModal(newsletterModal));
  qsa("[data-open-donate]").forEach((b) => b.addEventListener("click", () => safeShowModal(donateModal)));
  qs("[data-open-accessibility]")?.addEventListener("click", () => safeShowModal(a11yModal));

  // Updates data (can be replaced with real campaign posts)
  const UPDATES = [
    {
      id: "u1",
      type: "events",
      title: "Town-hall forum with youth & first-time voters",
      date: "2026-02-14",
      location: "Kericho Town",
      summary: "A listening session focused on jobs, skills, and entrepreneurship opportunities.",
    },
    {
      id: "u2",
      type: "field",
      title: "Tea farmers’ roundtable on fair pricing and deductions",
      date: "2026-02-18",
      location: "Ainamoi",
      summary: "Commitment to push for transparency, timely payments, and farmer-first reforms.",
    },
    {
      id: "u3",
      type: "press",
      title: "Statement: Integrity and accountability in public service",
      date: "2026-02-20",
      location: "Kericho County",
      summary: "A pledge for clean leadership, transparent reporting, and measurable results.",
    },
    {
      id: "u4",
      type: "field",
      title: "Women groups engagement: financial inclusion & market access",
      date: "2026-02-23",
      location: "Buret",
      summary: "Partnership approach to training, linkages, and support for women-led enterprises.",
    },
    {
      id: "u5",
      type: "events",
      title: "Community baraza: health services and education support",
      date: "2026-02-28",
      location: "Belgut",
      summary: "Discussing service delivery, bursary transparency, and local health priorities.",
    },
    {
      id: "u6",
      type: "press",
      title: "Press brief: Unity across wards, dignity of work, and inclusion",
      date: "2026-03-02",
      location: "Kipkelion East",
      summary: "A call for respectful politics and development that reaches every household.",
    },
  ];

  const formatDate = (iso) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const updatesList = qs("#updates-list");
  const renderUpdates = (filter) => {
    if (!updatesList) return;
    const items = filter === "all" ? UPDATES : UPDATES.filter((u) => u.type === filter);
    updatesList.innerHTML = "";

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `<h3>No updates yet</h3><p class="muted">Check back soon for campaign news and events.</p>`;
      updatesList.appendChild(empty);
      return;
    }

    items.forEach((u) => {
      const el = document.createElement("article");
      el.className = "update";
      el.setAttribute("data-type", u.type);
      el.innerHTML = `
        <span class="badge ${u.type}">${u.type.toUpperCase()}</span>
        <h3>${escapeHtml(u.title)}</h3>
        <div class="update-meta">
          <span>${escapeHtml(formatDate(u.date))}</span>
          <span>•</span>
          <span>${escapeHtml(u.location)}</span>
        </div>
        <p>${escapeHtml(u.summary)}</p>
        <a href="#contact" aria-label="Contact the team about ${escapeHtml(u.title)}">Learn more</a>
      `;
      updatesList.appendChild(el);
    });
  };

  const chips = qsa("[data-filter]");
  const setActiveChip = (filter) => {
    chips.forEach((c) => {
      const isActive = c.getAttribute("data-filter") === filter;
      c.classList.toggle("is-active", isActive);
      c.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter") || "all";
      setActiveChip(filter);
      renderUpdates(filter);
    });
  });
  renderUpdates("all");

  // Forms (front-end validation + mailto fallback)
  const setFieldError = (input, msg) => {
    const hint = qs(`[data-error-for="${input.id}"]`);
    if (hint) hint.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const required = (input, label) => {
    const v = String(input.value || "").trim();
    if (!v) {
      setFieldError(input, `${label} is required.`);
      return false;
    }
    setFieldError(input, "");
    return true;
  };

  const emailOk = (input) => {
    const v = String(input.value || "").trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) {
      setFieldError(input, "Please enter a valid email.");
      return false;
    }
    setFieldError(input, "");
    return true;
  };

  const phoneOk = (input) => {
    const v = String(input.value || "").trim();
    // Accept Kenyan formats and general international digits
    const ok = /^[+()0-9\s-]{7,}$/.test(v);
    if (!ok) {
      setFieldError(input, "Please enter a valid phone number.");
      return false;
    }
    setFieldError(input, "");
    return true;
  };

  const volunteerForm = qs("#volunteer-form");
  const volunteerResult = qs("#volunteer-result");
  volunteerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!volunteerResult) return;

    const name = qs("#v-name");
    const phone = qs("#v-phone");
    const location = qs("#v-location");
    const interest = qs("#v-interests");
    const message = qs("#v-message");
    if (!name || !phone || !location || !interest || !message) return;

    const ok =
      required(name, "Full name") &
      required(phone, "Phone number") &
      phoneOk(phone) &
      required(location, "Ward / Location") &
      required(interest, "Interest");

    if (!ok) {
      volunteerResult.textContent = "Please review the highlighted fields.";
      return;
    }

    const body = [
      "Volunteer sign-up (Campaign Website)",
      "",
      `Name: ${name.value}`,
      `Phone: ${phone.value}`,
      `Ward/Location: ${location.value}`,
      `Interest: ${interest.value}`,
      `Message: ${message.value || "-"}`,
    ].join("\n");

    // mailto fallback (static site friendly)
    const mailto = `mailto:team@senatorcheptoo.ke?subject=${encodeURIComponent("Volunteer Sign-up")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    volunteerResult.textContent = "Opening your email app to complete submission…";
    volunteerForm.reset();
  });

  const contactForm = qs("#contact-form");
  const contactResult = qs("#contact-result");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactResult) return;

    const name = qs("#c-name");
    const email = qs("#c-email");
    const message = qs("#c-message");
    if (!name || !email || !message) return;

    const ok = required(name, "Full name") & required(email, "Email") & emailOk(email) & required(message, "Message");
    if (!ok) {
      contactResult.textContent = "Please review the highlighted fields.";
      return;
    }

    const body = [
      "Message from Campaign Website",
      "",
      `Name: ${name.value}`,
      `Email: ${email.value}`,
      "",
      message.value,
    ].join("\n");

    const mailto = `mailto:team@senatorcheptoo.ke?subject=${encodeURIComponent("Website message")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    contactResult.textContent = "Opening your email app to send the message…";
    contactForm.reset();
  });

  // Newsletter demo storage
  const nContact = qs("#n-contact");
  const nSubmit = qs("#n-submit");
  nSubmit?.addEventListener("click", (e) => {
    if (!nContact) return;
    const v = String(nContact.value || "").trim();
    if (!v) {
      nContact.focus();
      e.preventDefault();
      return;
    }
    try {
      const list = JSON.parse(localStorage.getItem("sc_updates_list") || "[]");
      const next = Array.isArray(list) ? list : [];
      next.push({ contact: v, ts: Date.now() });
      localStorage.setItem("sc_updates_list", JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  });

  // Helpers
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();

