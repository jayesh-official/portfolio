/* ============================================================
   Jayesh — PHP / Laravel Backend Developer Portfolio
   Interactions: preloader, nav, particles, scroll reveal,
   counters, skill bars, typing, project tabs, contact demo
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Preloader ---------------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    setTimeout(function () {
      pre.classList.add("hidden");
      document.body.style.overflow = "";
    }, 350);
  });

  /* ---------------- Navbar state + active link ---------------- */
  var nav = document.getElementById("mainNav");
  var links = [].slice.call(nav.querySelectorAll(".nav-link"));

  function setNav() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", setNav, { passive: true });
  setNav();

  var sections = [].slice.call(document.querySelectorAll("section[id], header[id]"));
  var spyMap = {};
  sections.forEach(function (s) {
    var link = links.filter(function (l) {
      return l.getAttribute("href") === "#" + s.id;
    })[0];
    if (link) spyMap[s.id] = link;
  });

  var spyTimer = null;
  function spy() {
    if (spyTimer) return;
    spyTimer = requestAnimationFrame(function () {
      spyTimer = null;
      var pos = window.scrollY + 120;
      var current = sections[0] ? sections[0].id : "";
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) current = s.id;
      });
      links.forEach(function (l) { l.classList.remove("active"); });
      if (spyMap[current]) spyMap[current].classList.add("active");
    });
  }
  window.addEventListener("scroll", spy, { passive: true });
  window.addEventListener("resize", spy, { passive: true });
  spy();

  /* Collapse mobile menu on link click */
  var collapseEl = document.getElementById("navMenu");
  var navCollapse = bootstrap.Collapse.getOrCreateInstance
    ? bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false })
    : new bootstrap.Collapse(collapseEl, { toggle: false });
  links.forEach(function (l) {
    l.addEventListener("click", function () {
      if (collapseEl.classList.contains("show")) navCollapse.hide();
    });
  });

  /* ---------------- Back to top ---------------- */
  var backTop = document.getElementById("backTop");
  function toggleBackTop() {
    backTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ---------------- Counters ---------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = "";
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(target % 1 === 0 ? 0 : 1);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counterObs = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          counterObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    [].slice.call(document.querySelectorAll(".stat-num")).forEach(function (s) {
      counterObs.observe(s);
    });
  } else {
    [].slice.call(document.querySelectorAll(".stat-num")).forEach(function (s) {
      s.textContent = s.getAttribute("data-count");
    });
  }

  /* ---------------- Skill bars ---------------- */
  var barObs = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var bar = en.target;
          bar.style.width = bar.getAttribute("data-width") + "%";
          barObs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });
    [].slice.call(document.querySelectorAll(".skill-fill")).forEach(function (b) {
      barObs.observe(b);
    });
  } else {
    [].slice.call(document.querySelectorAll(".skill-fill")).forEach(function (b) {
      b.style.width = b.getAttribute("data-width") + "%";
    });
  }

  /* Animate percent numbers next to bars */
  var pctObs = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    pctObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var target = parseInt(el.getAttribute("data-pct"), 10);
          var start = null;
          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 1400, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + "%";
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          pctObs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    [].slice.call(document.querySelectorAll(".skill-pct")).forEach(function (el) {
      pctObs.observe(el);
    });
  }

  /* ---------------- Typing effect ---------------- */
  var typedEl = document.getElementById("typed");
  var typedWrap = typedEl ? typedEl.closest(".typed-wrap") : null;
  var heroTitle = typedWrap ? typedWrap.closest(".hero-title") : null;
  var roles = ["Backend Developer", "Laravel Specialist", "API Architect", "Database Designer", "Full-Stack Engineer"];
  var ri = 0, ci = 0, deleting = false;
  function typeLoop() {
    if (!typedEl) return;
    var word = roles[ri];
    typedEl.textContent = word.slice(0, ci);
    if (!deleting) {
      if (ci < word.length) { ci++; setTimeout(typeLoop, 60 + Math.random() * 60); }
      else { deleting = true; setTimeout(typeLoop, 1500); }
    } else {
      if (ci > 0) { ci--; setTimeout(typeLoop, 32); }
      else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 350); }
    }
  }

  /* Keep the typed line on a single line across every screen size: scale the
     hero title font down just enough for the longest role (plus cursor) to
     fit its column, then reserve that one-line height so nothing ever jumps. */
  function fitTypedLayout() {
    if (!typedEl || !typedWrap || !heroTitle) return;
    var prev = typedEl.textContent;

    heroTitle.style.fontSize = "";
    typedWrap.style.minHeight = "0";
    typedWrap.style.whiteSpace = "nowrap";

    for (var pass = 0; pass < 4; pass++) {
      var need = 0;
      for (var i = 0; i < roles.length; i++) {
        typedEl.textContent = roles[i];
        if (typedWrap.scrollWidth > need) need = typedWrap.scrollWidth;
      }
      var avail = heroTitle.clientWidth;
      if (!need || !avail || need <= avail) break;
      var cur = parseFloat(window.getComputedStyle(heroTitle).fontSize);
      heroTitle.style.fontSize = (cur * (avail / need) * 0.99).toFixed(2) + "px";
    }

    typedWrap.style.whiteSpace = "";

    var maxH = 0;
    for (var j = 0; j < roles.length; j++) {
      typedEl.textContent = roles[j];
      if (typedWrap.offsetHeight > maxH) maxH = typedWrap.offsetHeight;
    }
    typedEl.textContent = prev;
    typedWrap.style.minHeight = maxH ? maxH + "px" : "";
  }

  var typingStarted = false;
  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    fitTypedLayout();
    setTimeout(typeLoop, 900);
  }

  if (typedEl && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { startTyping(); fitTypedLayout(); });
    setTimeout(startTyping, 2000);
  } else {
    startTyping();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitTypedLayout, 150);
  });

  /* ---------------- Canvas particles ---------------- */
  (function () {
    var canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W, H, dots = [], count = 62, rafId = null;
    var colors = ["43,230,167", "62,230,255", "122,255,204"];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      count = reduceMotion ? 18 : Math.min(90, Math.floor((W * H) / 20000));
    }
    function mkDot(ini) {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        c: colors[(Math.random() * colors.length) | 0],
        a: Math.random() * 0.5 + 0.2
      };
    }
    function build() {
      dots = [];
      for (var i = 0; i < count; i++) dots.push(mkDot());
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, j;

      for (i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -12) d.x = W + 12; else if (d.x > W + 12) d.x = -12;
        if (d.y < -12) d.y = H + 12; else if (d.y > H + 12) d.y = -12;

        for (j = i + 1; j < dots.length; j++) {
          var e = dots[j];
          var dx = d.x - e.x, dy = d.y - e.y;
          var dist = dx * dx + dy * dy;
          if (dist < 16900) {
            var alpha = (1 - dist / 16900) * 0.16;
            ctx.strokeStyle = "rgba(" + d.c + "," + alpha + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + d.c + "," + d.a + ")";
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
    function start() { if (!rafId) rafId = requestAnimationFrame(draw); }

    resize();
    build();
    if (!reduceMotion) start();
    else { ctx.clearRect(0, 0, W, H); }

    var onResize = null;
    window.addEventListener("resize", function () {
      clearTimeout(onResize);
      onResize = setTimeout(function () { resize(); build(); }, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (!reduceMotion) start();
    });

    var touch = window.matchMedia("(hover: none)").matches;
    if (touch) {
      canvas.addEventListener(
        "touchmove",
        function (e) {
          var t = e.touches[0];
          for (var k = 0; k < dots.length; k++) {
            var dxf = dots[k].x - t.clientX, dyf = dots[k].y - t.clientY;
            var dd = Math.sqrt(dxf * dxf + dyf * dyf);
            if (dd < 120) {
              dots[k].x += dxf * 0.02;
              dots[k].y += dyf * 0.02;
            }
          }
        },
        { passive: true }
      );
    }
  })();

  /* ---------------- Contact form (Formspree) ---------------- */
  var form = document.getElementById("contactForm");
  var formSuccessTimer = null;
  if (form) {
    var fields = {
      cName: {
        validate: function (v) {
          if (!v) return "Please enter your name.";
          if (v.length < 3) return "Name must be at least 3 characters.";
          if (!/^[a-zA-Z\s.'-]+$/.test(v)) return "Name can only contain letters.";
          return "";
        }
      },
      cEmail: {
        validate: function (v) {
          if (!v) return "Please enter your email.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
          return "";
        }
      },
      cSubject: {
        validate: function (v) {
          if (!v) return "Please enter a subject.";
          if (v.length < 4) return "Subject must be at least 4 characters.";
          return "";
        }
      },
      cMsg: {
        validate: function (v) {
          if (!v) return "Please enter a message.";
          if (v.length < 10) return "Message must be at least 10 characters.";
          if (v.length > 2000) return "Message must be under 2000 characters.";
          return "";
        }
      }
    };

    function validateField(key) {
      var input = document.getElementById(key);
      var feedback = document.getElementById(key + "Feedback");
      var msg = fields[key].validate(input.value.trim());
      if (msg) {
        input.classList.add("is-invalid");
        if (feedback) { feedback.textContent = msg; }
        return false;
      }
      input.classList.remove("is-invalid");
      if (feedback) { feedback.textContent = ""; }
      return true;
    }

    function validateAll() {
      var valid = true;
      Object.keys(fields).forEach(function (k) {
        if (!validateField(k)) { valid = false; }
      });
      return valid;
    }

    Object.keys(fields).forEach(function (k) {
      var input = document.getElementById(k);
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid") || input.value.trim() !== "") {
          validateField(k);
        }
      });
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "") { validateField(k); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateAll()) {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      var name = document.getElementById("cName").value.trim();
      var email = document.getElementById("cEmail").value.trim();
      var subject = document.getElementById("cSubject").value.trim();
      var message = document.getElementById("cMsg").value.trim();

      var btn = form.querySelector("button");
      var old = btn.innerHTML;
      var note = document.getElementById("formNote");
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Sending...';
      btn.disabled = true;
      if (note) { note.textContent = ""; }

      var data = new URLSearchParams();
      data.append("name", name);
      data.append("email", email);
      data.append("subject", subject);
      data.append("message", message);

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: false, errors: [{ message: "Unexpected server response." }] }; });
        })
        .then(function (res) {
          if (res.ok) {
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Message sent!';
            form.reset();
            Object.keys(fields).forEach(function (k) {
              document.getElementById(k).classList.remove("is-invalid");
              var fb = document.getElementById(k + "Feedback");
              if (fb) { fb.textContent = ""; }
            });
            if (note) { note.className = "form-note form-note-success"; note.textContent = "Thanks! I will get back to you soon."; }
            clearTimeout(formSuccessTimer);
            formSuccessTimer = setTimeout(function () {
              btn.innerHTML = old;
              btn.disabled = false;
            }, 2600);
          } else {
            btn.innerHTML = old;
            btn.disabled = false;
            var err = (res.errors && res.errors[0]) ? res.errors[0].message : "Something went wrong. Please try again.";
            if (note) { note.className = "form-note form-note-error"; note.textContent = err; }
          }
        })
        .catch(function () {
          btn.innerHTML = old;
          btn.disabled = false;
          if (note) { note.className = "form-note form-note-error"; note.textContent = "Network error. Please check your connection and try again."; }
        });
    });
  }
})();

/* ---------------- Image carousels (certifications / laracon) ---------------- */
(function () {
  var sliders = document.querySelectorAll(".img-slider");

  function initSlider(el) {
    var track = el.querySelector(".img-slider-track");
    var slides = el.querySelectorAll(".img-slide");
    var dotsWrap = el.querySelector(".img-dots");
    var prevBtn = el.querySelector(".img-prev");
    var nextBtn = el.querySelector(".img-next");
    var autoplay = parseInt(el.getAttribute("data-autoplay")) || 3000;
    var idx = 0;
    var timer = null;
    var isPaused = false;
    var total = slides.length;

    if (!track || total < 2) { return; }

    /* bullet dots */
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "img-dot";
      d.setAttribute("aria-label", "Slide " + (i + 1));
      d.addEventListener("click", function () { goTo(i); resetTimer(); });
      dotsWrap.appendChild(d);
    });

    function render() {
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      var dots = dotsWrap.querySelectorAll(".img-dot");
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }

    function goTo(i) { idx = (i + total) % total; render(); }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    function start() { stop(); timer = setInterval(function () { if (!isPaused) next(); }, autoplay); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stop(); start(); }

    prevBtn.addEventListener("click", function () { prev(); resetTimer(); });
    nextBtn.addEventListener("click", function () { next(); resetTimer(); });

    el.addEventListener("mouseenter", function () { isPaused = true; });
    el.addEventListener("mouseleave", function () { isPaused = false; });

    /* touch / drag swipe */
    var startX = 0;
    var isDragging = false;
    var baseX = 0;
    el.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; isDragging = true; baseX = idx; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        startX - e.changedTouches[0].clientX > 0 ? next() : prev();
        resetTimer();
      } else {
        goTo(baseX);
      }
    }, { passive: true });

    /* keyboard arrows when focused */
    el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { prev(); resetTimer(); }
      if (e.key === "ArrowRight") { next(); resetTimer(); }
    });

    render();
    start();
  }

  sliders.forEach(initSlider);

  window.addEventListener("resize", function () {
    sliders.forEach(function (el) {
      var track = el.querySelector(".img-slider-track");
      if (track) { /* slight re-render on resize keeps alignment */ }
    });
  });
})();

/* ---------------- PNG ↔ JPG extension fallback ---------------- */
(function () {
  var exts = ["png", "jpg", "jpeg"];
  document.querySelectorAll(".img-frame img").forEach(function (img) {
    var base = img.getAttribute("src").replace(/\.[a-z0-9]+$/i, "");
    var step = 0;
    img.addEventListener("error", function onError() {
      if (step >= exts.length) { img.removeEventListener("error", onError); return; }
      img.src = base + "." + exts[step];
      step++;
    });
  });
})();

/* ---------------- Force-download for CV (no PDF streaming) ---------------- */
(function () {
  var links = document.querySelectorAll('a[download]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var name = link.getAttribute("download") || "Jayesh_CV.pdf";
      link.classList.add("downloading");
      fetch(link.href, { credentials: "same-origin" })
        .then(function (r) { if (!r.ok) throw new Error("Download failed"); return r.blob(); })
        .then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        })
        .catch(function () { window.location.href = link.href; })
        .finally(function () { link.classList.remove("downloading"); });
    });
  });
})();

/* ---------------- Project tabs: staggered card-open animation ---------------- */
(function () {
  var panes = document.querySelectorAll("#projectTabContent .tab-pane");

  function animateCards(pane) {
    var cards = pane.querySelectorAll(".project-card");
    cards.forEach(function (card, i) {
      card.style.setProperty("--i", i);
      card.style.animation = "none";
      void card.offsetWidth;
      card.style.animation = "";
    });
  }

  /* stagger the cards already visible on load */
  panes.forEach(function (pane) {
    if (pane.classList.contains("show")) animateCards(pane);
  });

  /* re-run the animation every time a domain tab opens */
  document.querySelectorAll('#projectTabs .project-tab').forEach(function (btn) {
    btn.addEventListener("shown.bs.tab", function (e) {
      var target = document.querySelector(e.target.getAttribute("data-bs-target"));
      if (target) setTimeout(function () { animateCards(target); }, 40);
    });
  });
})();