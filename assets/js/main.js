// Minimal, dependency-free mobile nav toggle.
(function () {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when a link is clicked (nice on mobile navigation)
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

// Minimal photo lightbox, built on the native <dialog> element.
// Works with any number of .gallery-item buttons on the page.
(function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxCounter = document.getElementById("lightbox-counter");
  var lightboxThumbs = document.getElementById("lightbox-thumbs");
  var closeBtn = document.getElementById("lightbox-close");
  var prevBtn = document.getElementById("lightbox-prev");
  var nextBtn = document.getElementById("lightbox-next");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  if (!lightbox || typeof lightbox.showModal !== "function" || !items.length) return;

  var currentIndex = 0;

  function createThumbs() {
    if (!lightboxThumbs) return;

    lightboxThumbs.innerHTML = "";
    items.forEach(function (item, index) {
      var thumbButton = document.createElement("button");
      thumbButton.type = "button";
      thumbButton.className = "lightbox-thumb";
      thumbButton.setAttribute("aria-label", "Show photo " + (index + 1));
      thumbButton.setAttribute("data-index", index);

      var thumbImg = document.createElement("img");
      var sourceImg = item.querySelector("img");
      thumbImg.src = sourceImg ? sourceImg.getAttribute("src") : "";
      thumbImg.alt = sourceImg ? sourceImg.getAttribute("alt") || "" : "";
      thumbButton.appendChild(thumbImg);

      thumbButton.addEventListener("click", function () {
        updateViewer(index);
      });

      lightboxThumbs.appendChild(thumbButton);
    });
  }

  function updateThumbs() {
    if (!lightboxThumbs) return;

    var buttons = lightboxThumbs.querySelectorAll(".lightbox-thumb");
    buttons.forEach(function (button, index) {
      button.classList.toggle("is-active", index === currentIndex);
    });
  }

  function updateViewer(index) {
    if (!items.length) return;

    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    if (!item) return;

    var sourceImg = item.querySelector("img");
    lightboxImg.src = item.getAttribute("data-full");
    lightboxImg.alt = sourceImg ? sourceImg.getAttribute("alt") || "" : "";
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";

    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + " / " + items.length;
    }

    updateThumbs();
  }

  function openViewer(index) {
    updateViewer(index);
    if (closeBtn) closeBtn.focus();
    lightbox.showModal();
  }

  function closeViewer() {
    if (lightbox.open) {
      lightbox.close();
    }
  }

  items.forEach(function (item, index) {
    item.addEventListener("click", function () {
      openViewer(index);
    });
  });

  createThumbs();

  if (closeBtn) {
    closeBtn.addEventListener("click", closeViewer);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      updateViewer(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      updateViewer(currentIndex + 1);
    });
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeViewer();
  });

  document.addEventListener("keydown", function (event) {
    if (!lightbox.open) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateViewer(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      updateViewer(currentIndex + 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeViewer();
    }
  });
})();
