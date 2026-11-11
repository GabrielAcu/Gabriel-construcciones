/**
 * Gabriel Construcciones - Animaciones, interactividad y galería (main.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Configuración de enlaces dinámicos de WhatsApp y año automático
  const WHATSAPP_NUMBER = "5491136083260";
  const defaultMsg = "Hola Gabriel, vi su página web y quisiera consultar por un presupuesto. ¿Podemos hablar?";
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;

  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
      link.href = waUrl;
    }
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Animación de Scroll con IntersectionObserver (Fade In Up / Stagger)
  const animElements = document.querySelectorAll(
    ".hero-content, .section-heading, .service-card, .step, .split > div, .split-image, .work-card, .contact-intro, .contact-card, .faq-item, .cta-inner"
  );

  animElements.forEach((el) => {
    el.classList.add("reveal-on-scroll");
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.12,
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach((el) => {
    const parentGrid = el.closest(".services, .services-grid-full, .works-grid, .steps, .faq-list");
    if (parentGrid) {
      const siblings = Array.from(parentGrid.children);
      const childIndex = siblings.indexOf(el);
      if (childIndex !== -1) {
        el.style.transitionDelay = `${(childIndex % 4) * 0.1}s`;
      }
    }
    scrollObserver.observe(el);
  });

  // 3. Efecto dinámico en el Header al scrollear
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          header.classList.add("header-scrolled");
        } else {
          header.classList.remove("header-scrolled");
        }
      },
      { passive: true }
    );
  }

  // 4. Suave interactividad en tarjetas (tilt sutil en dispositivos con mouse)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const interactiveCards = document.querySelectorAll(".service-card, .work-card, .step");
    interactiveCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${(-y / rect.height) * 4}deg) rotateY(${(x / rect.width) * 4}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // 5. Galería / Lightbox para Trabajos Realizados
  const galleryModal = document.getElementById("galleryModal");
  if (galleryModal) {
    const modalImg = document.getElementById("galleryModalImg");
    const captionEl = document.getElementById("galleryCaption");
    const counterEl = document.getElementById("galleryCounter");
    const thumbsEl = document.getElementById("galleryThumbs");
    const closeBtn = document.getElementById("galleryCloseBtn");
    const prevBtn = document.getElementById("galleryPrevBtn");
    const nextBtn = document.getElementById("galleryNextBtn");

    let currentImages = [];
    let currentIndex = 0;
    let currentTitle = "";

    function updateGalleryView() {
      if (currentImages.length === 0) return;
      modalImg.style.opacity = "0.3";
      modalImg.style.transform = "scale(0.97)";

      setTimeout(() => {
        modalImg.src = currentImages[currentIndex];
        modalImg.style.opacity = "1";
        modalImg.style.transform = "scale(1)";
      }, 120);

      captionEl.textContent = currentTitle;
      counterEl.textContent = `Foto ${currentIndex + 1} de ${currentImages.length}`;

      const allThumbs = thumbsEl.querySelectorAll(".gallery-thumb");
      allThumbs.forEach((thumb, i) => {
        thumb.classList.toggle("is-active", i === currentIndex);
      });
    }

    function openGallery(title, images) {
      currentTitle = title;
      currentImages = images;
      currentIndex = 0;

      thumbsEl.innerHTML = "";
      currentImages.forEach((imgSrc, i) => {
        const thumb = document.createElement("img");
        thumb.src = imgSrc;
        thumb.alt = `Miniatura ${i + 1}`;
        thumb.className = "gallery-thumb";
        if (i === 0) thumb.classList.add("is-active");
        thumb.addEventListener("click", (e) => {
          e.stopPropagation();
          currentIndex = i;
          updateGalleryView();
        });
        thumbsEl.appendChild(thumb);
      });

      updateGalleryView();
      galleryModal.classList.add("is-open");
      galleryModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeGallery() {
      galleryModal.classList.remove("is-open");
      galleryModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateGalleryView();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateGalleryView();
    }

    document.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => {
        const rawImages = card.getAttribute("data-images");
        const title = card.getAttribute("data-title") || "Proyecto";
        if (rawImages) {
          try {
            const images = JSON.parse(rawImages);
            openGallery(title, images);
          } catch (e) {
            console.error("Error al leer data-images:", e);
          }
        }
      });
    });

    closeBtn.addEventListener("click", closeGallery);
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextImage();
    });
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevImage();
    });

    galleryModal.addEventListener("click", (e) => {
      if (e.target === galleryModal) {
        closeGallery();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (!galleryModal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });
  }
});
