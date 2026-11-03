/* Small enhancements. Every page still works if this file fails to load. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");

  /* Dark / light toggle — remembers the visitor's choice */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Mobile menu */
  var menuBtn = document.querySelector("[data-menu]");
  var links = document.querySelector(".nav-links");
  if (menuBtn && links) menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  /* Header border once you scroll */
  var header = document.querySelector(".site-header");
  var onScroll = function () { if (header) header.classList.toggle("scrolled", scrollY > 8); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Fade sections in as they enter the screen */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  /* Copy buttons */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = document.querySelector(b.getAttribute("data-copy"));
      if (!t || !navigator.clipboard) return;
      navigator.clipboard.writeText(t.innerText.trim()).then(function () {
        var old = b.textContent; b.textContent = "Copied ✓";
        setTimeout(function () { b.textContent = old; }, 1600);
      });
    });
  });

  /* Articles: heading anchors, table of contents, reading progress */
  var prose = document.querySelector(".article .prose");
  if (prose) {
    var heads = Array.prototype.slice.call(prose.querySelectorAll("h2[id], h3[id]"));
    heads.forEach(function (h) {
      var a = document.createElement("a");
      a.className = "h-anchor"; a.href = "#" + h.id; a.textContent = "#";
      a.setAttribute("aria-label", "Link to this section");
      h.appendChild(a);
    });
    var tocNav = document.querySelector(".toc nav");
    if (tocNav && heads.length > 2) {
      var ol = document.createElement("ol"), sub = null, pairs = [];
      heads.forEach(function (h) {
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = "#" + h.id; a.textContent = h.firstChild.textContent.trim();
        li.appendChild(a); pairs.push([a, h]);
        if (h.tagName === "H2" || !ol.lastElementChild) { ol.appendChild(li); sub = null; }
        else { if (!sub) { sub = document.createElement("ol"); ol.lastElementChild.appendChild(sub); } sub.appendChild(li); }
      });
      tocNav.appendChild(ol);
      if ("IntersectionObserver" in window) {
        var tio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) pairs.forEach(function (p) { p[0].classList.toggle("on", p[1] === e.target); });
          });
        }, { rootMargin: "-90px 0px -70% 0px" });
        pairs.forEach(function (p) { tio.observe(p[1]); });
      }
    }
    var bar = document.querySelector(".progress span");
    if (bar) {
      var upd = function () {
        var r = prose.getBoundingClientRect(), total = prose.offsetHeight - innerHeight;
        bar.style.width = (total > 0 ? Math.min(100, Math.max(0, -r.top / total * 100)) : 0) + "%";
      };
      addEventListener("scroll", upd, { passive: true }); upd();
    }
  }
})();
