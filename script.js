(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const FORM_EMAIL = "brendazean18@gmail.com";
  const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

  const formNextUrl = (type) => {
    const path = window.location.pathname.replace(/index\.html$/i, "").replace(/\/?$/, "/");
    return `${window.location.origin}${path}?sent=${type}`;
  };

  // Update redirect URLs for current host (local or GitHub Pages)
  qsa('form[action*="formsubmit.co"] input[name="_next"]').forEach((input) => {
    const type = new URL(input.value).searchParams.get("sent");
    if (type) input.value = formNextUrl(type);
  });

  // Show success message after FormSubmit redirect
  const params = new URLSearchParams(window.location.search);
  const sent = params.get("sent");
  const sentMessages = {
    volunteer: "Thank you! Your volunteer sign-up was received.",
    contact: "Thank you! Your message was sent successfully.",
    newsletter: "You're on the list. Thank you for subscribing!",
  };
  if (sent && sentMessages[sent]) {
    const target =
      sent === "volunteer"
        ? qs("#volunteer-result")
        : sent === "contact"
          ? qs("#contact-result")
          : qs("#newsletter-result");
    if (target) target.textContent = sentMessages[sent];
    const section =
      sent === "volunteer" || sent === "newsletter" ? qs("#involved") : sent === "contact" ? qs("#contact") : null;
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState({}, "", window.location.pathname + window.location.hash);
  }

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

  // Scroll reveal
  const revealEls = qsa("[data-reveal]");
  const showReveal = (el) => el.classList.add("is-visible");

  const revealInView = () => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) showReveal(el);
    });
  };

  if (revealEls.length && "IntersectionObserver" in window) {
    revealInView();
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(showReveal);
  }

  // Active nav on scroll
  const sections = qsa("main section[id]");
  const navLinks = qsa("[data-nav-link]");
  const setActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    let current = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) current = section.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("is-active", href === current);
    });
  };
  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });

  // Back to top
  const backToTop = qs("[data-back-to-top]");
  const toggleBackToTop = () => {
    if (!backToTop) return;
    const show = window.scrollY > 500;
    backToTop.hidden = !show;
  };
  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Mobile nav
  const nav = qs("#site-nav");
  const navToggle = qs("[data-nav-toggle]");
  const navLabel = qs("[data-nav-label]");

  const setNavLabel = (open) => {
    if (navLabel) navLabel.textContent = open ? "Close menu" : "Open menu";
  };

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    setNavLabel(false);
  };

  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    setNavLabel(true);
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

  qsa("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      newsletterModal?.close();
      donateModal?.close();
      a11yModal?.close();
    });
  });

  // Updates data (edit this list to publish new campaign posts)
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

  const updatesList = qs("#updates-panel");
  let activeFilter = "all";

  const renderUpdates = (filter) => {
    if (!updatesList) return;
    activeFilter = filter;
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
        <span class="badge ${u.type}">${u.type}</span>
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
  const tabIds = { all: "tab-all", events: "tab-events", press: "tab-press", field: "tab-field" };

  const setActiveChip = (filter) => {
    chips.forEach((c) => {
      const isActive = c.getAttribute("data-filter") === filter;
      c.classList.toggle("is-active", isActive);
      c.setAttribute("aria-selected", isActive ? "true" : "false");
      c.setAttribute("tabindex", isActive ? "0" : "-1");
    });
    const tabId = tabIds[filter] || "tab-all";
    updatesList?.setAttribute("aria-labelledby", tabId);
  };

  const activateFilter = (filter) => {
    setActiveChip(filter);
    renderUpdates(filter);
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activateFilter(chip.getAttribute("data-filter") || "all");
    });
  });

  const tablist = qs('[role="tablist"]');
  tablist?.addEventListener("keydown", (e) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;

    const tabs = chips;
    const currentIndex = tabs.findIndex((t) => t.getAttribute("data-filter") === activeFilter);
    if (currentIndex < 0) return;

    e.preventDefault();
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    const filter = nextTab.getAttribute("data-filter") || "all";
    activateFilter(filter);
    nextTab.focus();
  });

  activateFilter("all");

  // Form helpers
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
    if (!v) return true;
    const ok = /^[+()0-9\s-]{7,}$/.test(v);
    if (!ok) {
      setFieldError(input, "Please enter a valid phone number.");
      return false;
    }
    setFieldError(input, "");
    return true;
  };

  const mailtoFallback = (subject, body) => {
    const mailto = `mailto:${FORM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const submitNativeForm = (form) => {
    form.setAttribute("action", `https://formsubmit.co/${FORM_EMAIL}`);
    form.setAttribute("method", "POST");
    form.submit();
  };

  const submitToFormEndpoint = async (payload) => {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _captcha: "false",
        _template: "table",
        ...payload,
      }),
    });

    if (!res.ok) throw new Error("Form submission failed");
    const data = await res.json().catch(() => ({}));
    if (data.success === "false" || data.success === false) throw new Error("Form submission rejected");
    return data;
  };

  const handleFormSubmit = async (
    e,
    { form, resultEl, validate, buildPayload, successMessage, nativeFallback = true }
  ) => {
    e.preventDefault();
    if (!validate()) {
      if (resultEl) resultEl.textContent = "Please review the highlighted fields.";
      return;
    }

    if (resultEl) resultEl.textContent = "Sending…";

    try {
      await submitToFormEndpoint(buildPayload());
      if (resultEl) resultEl.textContent = successMessage;
      form.reset();
    } catch {
      if (nativeFallback) {
        submitNativeForm(form);
        return;
      }
      if (resultEl) resultEl.textContent = "Opening your email app to complete submission…";
      form.reset();
    }
  };

  const volunteerForm = qs("#volunteer-form");
  const volunteerResult = qs("#volunteer-result");
  volunteerForm?.addEventListener("submit", (e) => {
    const name = qs("#v-name");
    const phone = qs("#v-phone");
    const location = qs("#v-location");
    const interest = qs("#v-interests");
    const message = qs("#v-message");
    if (!name || !phone || !location || !interest || !message) return;

    handleFormSubmit(e, {
      form: volunteerForm,
      resultEl: volunteerResult,
      validate: () =>
        required(name, "Full name") &&
        required(phone, "Phone number") &&
        phoneOk(phone) &&
        required(location, "Ward / Location") &&
        required(interest, "Interest"),
      buildPayload: () => ({
        _subject: "Volunteer Sign-up",
        _next: formNextUrl("volunteer"),
        name: name.value,
        phone: phone.value,
        location: location.value,
        interest: interest.value,
        message: message.value || "-",
      }),
      successMessage: "Thank you! Your sign-up was received.",
    });
  });

  const contactForm = qs("#contact-form");
  const contactResult = qs("#contact-result");
  contactForm?.addEventListener("submit", (e) => {
    const name = qs("#c-name");
    const email = qs("#c-email");
    const message = qs("#c-message");
    if (!name || !email || !message) return;

    handleFormSubmit(e, {
      form: contactForm,
      resultEl: contactResult,
      validate: () =>
        required(name, "Full name") && required(email, "Email") && emailOk(email) && required(message, "Message"),
      buildPayload: () => ({
        _subject: "Website message",
        _next: formNextUrl("contact"),
        name: name.value,
        email: email.value,
        message: message.value,
      }),
      successMessage: "Thank you! Your message was sent.",
    });
  });

  const newsletterForm = qs("#newsletter-form");
  const newsletterResult = qs("#newsletter-result");
  newsletterForm?.addEventListener("submit", async (e) => {
    const nContact = qs("#n-contact");
    if (!nContact) return;

    const v = String(nContact.value || "").trim();
    if (!v) {
      e.preventDefault();
      nContact.focus();
      return;
    }

    e.preventDefault();
    if (newsletterResult) newsletterResult.textContent = "Saving…";

    try {
      await submitToFormEndpoint({
        _subject: "Newsletter / SMS signup",
        _next: formNextUrl("newsletter"),
        contact: v,
      });
      if (newsletterResult) newsletterResult.textContent = "You're on the list. Thank you!";
      newsletterForm.reset();
      newsletterModal?.close();
    } catch {
      submitNativeForm(newsletterForm);
    }
  });

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
