// Home page: clicking a destination card opens the destinations page,
// and photos are loaded into the hero, collage, cards and gallery.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".destination-card").forEach(card => card.addEventListener("click", () => {
    window.location.href = "pages/destinations.html";
  }));

  // Needs js/destination-images.js (loaded before this file in index.html)
  if (typeof fetchDestinationImages !== "function") return;

  async function loadPhoto(target, searchText, altText) {
    try {
      const [img] = await fetchDestinationImages(searchText, 1);
      if (!img) return; // keep the emoji/gradient if no photo is found
      const tag = document.createElement("img");
      tag.alt = altText || searchText;
      tag.addEventListener("load", () => {
        if (target.classList.contains("destination-image")) {
          target.textContent = "";
          target.classList.add("has-photo");
        } else if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
          target.firstChild.textContent = ""; // remove the emoji, keep the name label
        }
        target.prepend(tag);
      });
      tag.src = img.url;
    } catch { /* offline or service busy: emoji stays */ }
  }

  document.querySelectorAll(".hero-bg, .collage-tile, .gallery-tile").forEach(el =>
    loadPhoto(el, el.dataset.search, el.dataset.name));

  document.querySelectorAll("#featured-destinations .destination-card").forEach(card => {
    const box = card.querySelector(".destination-image");
    loadPhoto(box, card.dataset.search, card.dataset.name);
  });
});