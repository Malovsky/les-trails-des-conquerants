const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = [data.get("prenom"), data.get("nom")].filter(Boolean).join(" ");
    const email = data.get("email") || "";
    const phone = data.get("telephone") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent(`Contact site - ${name || "Les Trails des Conquérants"}`);
    const body = encodeURIComponent(
      `Nom: ${name}\nE-mail: ${email}\nTéléphone: ${phone}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:les6heures@gmail.com?subject=${subject}&body=${body}`;

    const status = contactForm.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Votre message est prêt dans votre messagerie.";
    }
  });
}

const galleryLinks = [...document.querySelectorAll(".reportage-gallery a, .gallery a, .press-grid .press-item")];

if (galleryLinks.length) {
  const viewer = document.createElement("dialog");
  viewer.className = "image-viewer";
  viewer.setAttribute("aria-label", "Aperçu des images");
  viewer.innerHTML = `
    <div class="image-viewer-toolbar">
      <button type="button" data-viewer-previous aria-label="Image précédente" title="Image précédente">&#8592;</button>
      <span data-viewer-counter aria-live="polite"></span>
      <button type="button" data-viewer-next aria-label="Image suivante" title="Image suivante">&#8594;</button>
      <button type="button" data-viewer-zoom aria-label="Agrandir l’image" title="Agrandir l’image" aria-pressed="false">+</button>
      <button type="button" data-viewer-close aria-label="Fermer l’aperçu" title="Fermer l’aperçu">&#215;</button>
    </div>
    <div class="image-viewer-stage"><img class="image-viewer-image" alt=""></div>
  `;
  document.body.appendChild(viewer);
  const image = viewer.querySelector("img");
  const counter = viewer.querySelector("[data-viewer-counter]");
  const zoom = viewer.querySelector("[data-viewer-zoom]");
  let currentIndex = 0;
  let opener;

  const resetZoom = () => {
    viewer.classList.remove("is-zoomed");
    zoom.setAttribute("aria-pressed", "false");
    zoom.setAttribute("aria-label", "Agrandir l’image");
    zoom.title = "Agrandir l’image";
    zoom.textContent = "+";
  };

  const showImage = (index) => {
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentIndex];
    resetZoom();
    image.src = link.href;
    image.alt = link.querySelector("img")?.alt || "Image de la course";
    counter.textContent = `${currentIndex + 1} / ${galleryLinks.length}`;
    viewer.querySelector(".image-viewer-stage").scrollTo(0, 0);
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showImage(index);
      viewer.showModal();
      document.body.classList.add("image-viewer-open");
      viewer.querySelector("[data-viewer-close]").focus();
    });
  });

  viewer.querySelector("[data-viewer-previous]").addEventListener("click", () => showImage(currentIndex - 1));
  viewer.querySelector("[data-viewer-next]").addEventListener("click", () => showImage(currentIndex + 1));
  viewer.querySelector("[data-viewer-close]").addEventListener("click", () => viewer.close());
  zoom.addEventListener("click", () => {
    const zoomed = viewer.classList.toggle("is-zoomed");
    zoom.setAttribute("aria-pressed", String(zoomed));
    zoom.setAttribute("aria-label", zoomed ? "Réduire l’image" : "Agrandir l’image");
    zoom.title = zoom.getAttribute("aria-label");
    zoom.textContent = zoomed ? "−" : "+";
  });
  viewer.addEventListener("click", (event) => {
    if (!event.target.closest(".image-viewer-image, .image-viewer-toolbar")) viewer.close();
  });
  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  viewer.addEventListener("close", () => {
    document.body.classList.remove("image-viewer-open");
    resetZoom();
    opener?.focus({ preventScroll: true });
  });
}

const qrLinks = document.querySelectorAll(".qr-card, .footer-qr-card");

if (qrLinks.length) {
  const modal = document.createElement("div");
  modal.className = "qr-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="qr-modal-panel" role="document">
      <button class="qr-modal-close" type="button" aria-label="Fermer l’aperçu du QR code">×</button>
      <img class="qr-modal-image" alt="">
      <p class="qr-modal-label"></p>
    </div>
  `;
  document.body.appendChild(modal);

  const image = modal.querySelector(".qr-modal-image");
  const label = modal.querySelector(".qr-modal-label");
  const closeButton = modal.querySelector(".qr-modal-close");

  const closeQrModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("qr-modal-open");
  };

  const openQrModal = (link) => {
    const qrImage = link.querySelector("img");
    image.src = link.getAttribute("href");
    image.alt = qrImage?.alt || "QR code";
    label.textContent = link.textContent.trim() || image.alt;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("qr-modal-open");
    closeButton.focus();
  };

  qrLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openQrModal(link);
    });
  });

  closeButton.addEventListener("click", closeQrModal);

  modal.addEventListener("click", (event) => {
    if (
      !event.target.closest(".qr-modal-image") &&
      !event.target.closest(".qr-modal-close")
    ) {
      closeQrModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeQrModal();
    }
  });
}
