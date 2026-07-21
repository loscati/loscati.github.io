// Renders assets/cv.json (JSON Resume schema, see jsonresume.org)
// into the #cv-root element. Plain fetch + DOM, no templating library.
// Sections are only rendered if present in the data, so the schema's
// optional fields are all safe to omit.
(function () {
  var root = document.getElementById("cv-root");
  if (!root) return;

  function el(tag, opts) {
    opts = opts || {};
    var node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text) node.textContent = opts.text;
    if (opts.html) node.innerHTML = opts.html;
    if (opts.href) {
      node.href = opts.href;
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    return node;
  }

  function formatDate(d) {
    if (!d) return "Present";
    var parts = d.split("-");
    return parts.length >= 2 ? parts[0] + "-" + parts[1] : parts[0];
  }

  function dateRange(start, end) {
    if (!start && !end) return "";
    return formatDate(start) + " – " + formatDate(end);
  }

  function section(title) {
    var s = el("section", { className: "cv-section" });
    s.appendChild(el("h2", { text: title }));
    return s;
  }

  function renderBasics(data) {
    var basics = data.basics;
    if (!basics) return null;

    var header = el("header", { className: "cv-header" });
    header.appendChild(el("h1", { text: "Curriculum Vitae" || "" }));
    if (basics.label) header.appendChild(el("p", { className: "cv-label", text: basics.label }));

    var meta = el("p", { className: "post-meta cv-meta" });
    var bits = [];
    if (basics.location && (basics.location.city || basics.location.countryCode)) {
      bits.push([basics.location.city, basics.location.countryCode].filter(Boolean).join(", "));
    }
    if (basics.email) bits.push(basics.email);
    meta.textContent = bits.join(" · ");
    if (bits.length) header.appendChild(meta);

    if (Array.isArray(basics.profiles) && basics.profiles.length) {
      var links = el("p", { className: "cv-links" });
      basics.profiles.forEach(function (p, i) {
        if (i > 0) links.appendChild(document.createTextNode(" · "));
        links.appendChild(el("a", { href: p.url, text: p.network || p.url }));
      });
      if (basics.url) {
        links.appendChild(document.createTextNode(" · "));
        links.appendChild(el("a", { href: basics.url, text: "Website" }));
      }
      header.appendChild(links);
    }

    if (basics.summary) header.appendChild(el("p", { text: basics.summary }));

    // PDF download link
    var pdfLink = el("a", { href: "/assets/pdf/cv-latest.pdf", text: "PDF version" });
    pdfLink.setAttribute("download", "");
    var pdfContainer = el("p", { className: "cv-pdf" });
    pdfContainer.appendChild(pdfLink);
    header.appendChild(pdfContainer);

    return header;
  }

  function renderWork(work) {
    if (!Array.isArray(work) || !work.length) return null;
    var s = section("Work Experience");
    work.forEach(function (job, index) {
      var item = el("article", { className: "cv-item" });
      var h3 = el("h3", { text: job.position || "" });
      if (job.name) {
        var org = job.url ? el("a", { href: job.url, text: job.name }) : el("span", { text: job.name });
        h3.appendChild(document.createTextNode(" · "));
        h3.appendChild(org);
      }
      item.appendChild(h3);
      item.appendChild(el("p", { className: "post-meta", text: dateRange(job.startDate, job.endDate) }));
      if (job.summary) item.appendChild(el("p", { text: job.summary }));
      if (Array.isArray(job.highlights) && job.highlights.length) {
        var ul = el("ul", { className: "cv-highlights" });
        job.highlights.forEach(function (h) {
          ul.appendChild(el("li", { text: h }));
        });
        item.appendChild(ul);
      }
      s.appendChild(item);
      // Add divider between items (not after the last one)
      if (index < work.length - 1) {
        s.appendChild(el("hr", { className: "cv-divider" }));
      }
    });
    return s;
  }

  function renderEducation(education) {
    if (!Array.isArray(education) || !education.length) return null;
    var s = section("Education");
    education.forEach(function (ed, index) {
      var item = el("article", { className: "cv-item" });
      var title = [ed.studyType, ed.area].filter(Boolean).join(", ");
      item.appendChild(el("h3", { text: title }));
      item.appendChild(el("p", { className: "post-meta", text: [ed.institution, dateRange(ed.startDate, ed.endDate)].filter(Boolean).join(" · ") }));
      if (ed.score) {
        item.appendChild(el("p", { className: "cv-score", text: "Grade: " + ed.score }));
      }
      // Render courses if present
      if (Array.isArray(ed.courses) && ed.courses.length) {
        var courseList = el("ul", { className: "cv-courses" });
        ed.courses.forEach(function (course) {
          courseList.appendChild(el("li", { text: course }));
        });
        item.appendChild(courseList);
      }
      s.appendChild(item);
      // Add divider between items (not after the last one)
      if (index < education.length - 1) {
        s.appendChild(el("hr", { className: "cv-divider" }));
      }
    });
    return s;
  }

  function renderSkills(skills) {
    if (!Array.isArray(skills) || !skills.length) return null;
    var s = section("Skills");
    skills.forEach(function (group) {
      var item = el("div", { className: "cv-item" });
      if (group.name) item.appendChild(el("h3", { text: group.name }));
      if (Array.isArray(group.keywords)) {
        var tags = el("p", { className: "cv-tags" });
        group.keywords.forEach(function (k) {
          tags.appendChild(el("span", { className: "tag", text: k }));
          tags.appendChild(document.createTextNode(" "));
        });
        item.appendChild(tags);
      }
      s.appendChild(item);
    });
    return s;
  }

  function renderLanguages(languages) {
    if (!Array.isArray(languages) || !languages.length) return null;
    var s = section("Languages");
    var p = el("p");
    p.textContent = languages.map(function (l) {
      return l.fluency ? l.language + " (" + l.fluency + ")" : l.language;
    }).join(" · ");
    s.appendChild(p);
    return s;
  }

  function renderProjects(projects) {
    if (!Array.isArray(projects) || !projects.length) return null;
    var s = section("Projects");
    projects.forEach(function (proj) {
      var item = el("article", { className: "cv-item" });
      var h3 = proj.url ? el("a", { href: proj.url, text: proj.name }) : el("span", { text: proj.name });
      var h3wrap = el("h3");
      h3wrap.appendChild(h3);
      item.appendChild(h3wrap);
      if (proj.startDate || proj.endDate) {
        item.appendChild(el("p", { className: "post-meta", text: dateRange(proj.startDate, proj.endDate) }));
      }
      if (proj.description) item.appendChild(el("p", { text: proj.description }));
      s.appendChild(item);
    });
    return s;
  }

  fetch(root.getAttribute("data-src") || "/assets/cv.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load CV data (" + res.status + ")");
      return res.json();
    })
    .then(function (data) {
      root.innerHTML = "";
      [
        renderBasics(data),
        renderWork(data.work),
        renderEducation(data.education),
        renderSkills(data.skills),
        renderLanguages(data.languages),
        renderProjects(data.projects)
      ]
        .filter(Boolean)
        .forEach(function (node) {
          root.appendChild(node);
        });
    })
    .catch(function (err) {
      root.innerHTML = "";
      root.appendChild(el("p", { className: "post-meta", text: err.message }));
    });
})();
