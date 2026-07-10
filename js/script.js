/* ===========================================================
   NIMBUS — shared interactivity
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a.top-link:not(.has-dropdown > .top-link)").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
    navLinks.querySelectorAll(".dropdown a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Dropdown (Services) ---------- */
  var dropdownParents = document.querySelectorAll(".has-dropdown");
  dropdownParents.forEach(function (li) {
    var trigger = li.querySelector(".top-link");
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    li.setAttribute("data-open", "false");

    trigger.addEventListener("click", function (e) {
      var isSmallScreen = window.matchMedia("(max-width: 860px)").matches;
      if (isSmallScreen) {
        e.preventDefault();
        var willOpen = li.getAttribute("data-open") !== "true";
        dropdownParents.forEach(function (other) {
          if (other !== li) {
            other.setAttribute("data-open", "false");
            other.querySelector(".top-link").setAttribute("aria-expanded", "false");
          }
        });
        li.setAttribute("data-open", willOpen ? "true" : "false");
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      }
    });

    li.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        li.setAttribute("data-open", "false");
        trigger.setAttribute("aria-expanded", "false");
        trigger.blur();
      }
    });
  });

  document.addEventListener("click", function (e) {
    dropdownParents.forEach(function (li) {
      if (!li.contains(e.target)) {
        li.setAttribute("data-open", "false");
        li.querySelector(".top-link").setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------- Active nav link highlighting ---------- */
  var currentPage = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var hrefPage = href.split("#")[0];
    if (hrefPage === currentPage || (currentPage === "" && hrefPage === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(".card, .service-block, .timeline-item, .team-card, .split, .hero-card");
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 700ms ease, transform 700ms ease";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Pricing toggle (services page) ---------- */
  var pricingBtns = document.querySelectorAll(".pricing-toggle button");
  var monthlyEls = document.querySelectorAll("[data-price-monthly]");
  var yearlyEls = document.querySelectorAll("[data-price-yearly]");
  if (pricingBtns.length) {
    pricingBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        pricingBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var isYearly = btn.dataset.period === "yearly";
        monthlyEls.forEach(function (el) { el.style.display = isYearly ? "none" : "block"; });
        yearlyEls.forEach(function (el) { el.style.display = isYearly ? "block" : "none"; });
      });
    });
  }

  /* ---------- Contact form (static — client-side validation only) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      var mobile = form.querySelector("#mobile");
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var mobilePattern = /^[6-9]\d{9}$/;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim() || (mobile && !mobile.value.trim())) {
        status.textContent = "Please fill in your name, email, mobile number, and message before sending.";
        status.className = "form-status err";
        return;
      }
      if (!emailPattern.test(email.value.trim())) {
        status.textContent = "That email address doesn't look right — please check it.";
        status.className = "form-status err";
        return;
      }
      if (mobile && !mobilePattern.test(mobile.value.trim().replace(/\D/g, "").slice(-10))) {
        status.textContent = "Please enter a valid 10-digit mobile number.";
        status.className = "form-status err";
        return;
      }

      // No backend is wired up in this template — replace this block with a
      // fetch() call to your form endpoint (e.g. Formspree, Netlify Forms, your API).
      status.textContent = "Thanks, " + name.value.trim().split(" ")[0] + " — your message is ready to send. Connect a form endpoint to complete delivery.";
      status.className = "form-status ok";
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
