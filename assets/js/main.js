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
