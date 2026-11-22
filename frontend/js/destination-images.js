// Destination images: type a destination name, press Enter, get 4 photos.
// Photos come from Wikimedia Commons (free, no API key, no credit card needed).

const IMAGE_COUNT = 4;
const imageCache = {};

async function fetchDestinationImages(name, count = IMAGE_COUNT) {
  const key = `${name.toLowerCase()}|${count}`;
  if (imageCache[key]) return imageCache[key];

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${name} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "30",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "700",
    format: "json",
    origin: "*"
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error("Image service not available");
  const data = await response.json();
  const pages = Object.values((data.query && data.query.pages) || {})
    .sort((a, b) => a.index - b.index);

  const skip = /map|flag|logo|coat of arms|diagram|chart|poster|stamp|signature|icon|locator/i;
  const images = pages
    .map(p => ({ title: p.title || "", info: (p.imageinfo || [])[0] }))
    .filter(p => p.info && /^image\/(jpeg|png)$/.test(p.info.mime))
    .filter(p => p.info.width >= 800 && p.info.width >= p.info.height)
    .filter(p => !skip.test(p.title))
    .slice(0, count)
    .map(p => ({
      url: p.info.thumburl || p.info.url,
      caption: p.title.replace(/^File:/, "").replace(/\.\w+$/, "").replace(/_/g, " "),
      source: p.info.descriptionurl
    }));

  imageCache[key] = images;
  return images;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#destination-search");
  const gallery = document.querySelector("#destination-gallery");
  if (!input || !gallery) return;

  async function showGallery(name) {
    gallery.classList.remove("hidden");
    gallery.innerHTML = `<p class="message">Loading photos of ${safe(name)}...</p>`;
    try {
      const images = await fetchDestinationImages(name);
      if (!images.length) {
        gallery.innerHTML = `<h2>${safe(name)}</h2><p>No photos found. Try another spelling, for example "Hunza Valley" or "Lahore Fort".</p>`;
        return;
      }
      gallery.innerHTML = `<h2>${safe(name)}</h2>
        <div class="gallery-grid">${images.map(img =>
          `<a href="${safe(img.source)}" target="_blank" rel="noopener"><figure><img src="${safe(img.url)}" alt="${safe(img.caption)}" loading="lazy"><figcaption>${safe(img.caption)}</figcaption></figure></a>`
        ).join("")}</div>
        <p class="credit">Photos: Wikimedia Commons (click a photo for author and license).</p>`;
    } catch {
      gallery.innerHTML = `<p>Could not load photos. Check your internet connection and try again.</p>`;
    }
  }

  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const name = input.value.trim();
    if (!name) {
      gallery.classList.add("hidden");
      return;
    }
    showGallery(name);
  });

  // Typing also filters the destination cards below.
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll("#destination-list .destination-card").forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
    if (!q) gallery.classList.add("hidden");
    // Show the 4 photos automatically once the user pauses typing (Enter also works)
    clearTimeout(input._photoTimer);
    if (q.length >= 3) input._photoTimer = setTimeout(() => showGallery(input.value.trim()), 700);
  });

  // Clicking a card shows that destination's photos.
  document.querySelector("#destination-list").addEventListener("click", event => {
    const card = event.target.closest(".destination-card");
    if (!card) return;
    const name = card.dataset.name;
    input.value = name;
    showGallery(name);
    gallery.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Put one photo on top of every destination card (emoji stays if no photo is found).
async function addCardThumbnails() {
  const cards = document.querySelectorAll("#destination-list .destination-card");
  for (const card of cards) {
    try {
      const [img] = await fetchDestinationImages(card.dataset.name, 1);
      if (img) {
        const box = card.querySelector(".destination-image");
        box.innerHTML = `<img src="${safe(img.url)}" alt="${safe(card.dataset.name)}" loading="lazy">`;
        box.classList.add("has-photo");
      }
    } catch { /* keep the emoji */ }
  }
}
window.addCardThumbnails = addCardThumbnails;