/* Small, dependency-free enhancements. The site works fine without this file. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Dark / light toggle (remembers the choice) ---- */
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---- Mobile menu ---- */
  var navBtn = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-links");
  if (navBtn && navList) {
    navBtn.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- Copy-to-clipboard buttons ---- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.querySelector(btn.getAttribute("data-copy"));
      if (!el || !navigator.clipboard) return;
      navigator.clipboard.writeText(el.innerText.trim()).then(function () {
        var label = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(function () { btn.textContent = label; }, 1600);
      });
    });
  });

  /* ---- Post page: anchors, table of contents, reading progress ---- */
  var content = document.querySelector(".post-content");
  if (content) {
    var heads = content.querySelectorAll("h2[id], h3[id]");
    heads.forEach(function (h) {
      var a = document.createElement("a");
      a.className = "anchor"; a.href = "#" + h.id; a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";
      h.appendChild(a);
    });

    var tocNav = document.getElementById("toc");
    if (tocNav && heads.length > 1) {
      var list = document.createElement("ol"), sub = null, links = [];
      heads.forEach(function (h) {
        if (h.id === "cite-this-note") return;
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.childNodes[0].textContent.trim();
        li.appendChild(a); links.push({ a: a, h: h });
        if (h.tagName === "H2") { list.appendChild(li); sub = null; }
        else {
          var parent = list.lastElementChild;
          if (!parent) { list.appendChild(li); return; }
          if (!sub) { sub = document.createElement("ol"); parent.appendChild(sub); }
          sub.appendChild(li);
        }
      });
      tocNav.appendChild(list);

      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              links.forEach(function (l) { l.a.classList.toggle("active", l.h === e.target); });
            }
          });
        }, { rootMargin: "-80px 0px -70% 0px" });
        links.forEach(function (l) { obs.observe(l.h); });
      }
    } else if (tocNav) {
      var aside = tocNav.closest(".toc"); if (aside) aside.remove();
    }

    var bar = document.querySelector(".progress span");
    if (bar) {
      var update = function () {
        var rect = content.getBoundingClientRect();
        var total = content.offsetHeight - window.innerHeight;
        var pct = total > 0 ? Math.min(100, Math.max(0, (-rect.top / total) * 100)) : 0;
        bar.style.width = pct + "%";
      };
      window.addEventListener("scroll", update, { passive: true });
      update();
    }
  }

  /* ---- Notes page: filter by tag (?tag=gba1 in the URL works too) ---- */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var cards = document.querySelectorAll(".notes-list .post-card");
    var empty = document.querySelector(".empty-note");
    var slug = function (s) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
    var apply = function (tag) {
      var shown = 0;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.tag === tag ? "true" : "false");
      });
      cards.forEach(function (c) {
        var tags = (c.dataset.tags || "").split("|").map(slug);
        var show = tag === "all" || tags.indexOf(tag) !== -1;
        c.hidden = !show; if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    };
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      apply(b.dataset.tag);
      var url = new URL(window.location);
      if (b.dataset.tag === "all") url.searchParams.delete("tag"); else url.searchParams.set("tag", b.dataset.tag);
      history.replaceState(null, "", url);
    });
    var initial = new URLSearchParams(window.location.search).get("tag");
    apply(initial || "all");
  }
})();
