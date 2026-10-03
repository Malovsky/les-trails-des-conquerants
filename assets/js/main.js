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
