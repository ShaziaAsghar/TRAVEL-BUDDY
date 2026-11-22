// Planner page: choose restaurants (with photos), then generate the itinerary.
// Photos come from fetchDestinationImages() in js/destination-images.js (Wikimedia Commons, no key).

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#planner-form");
  if (!form) return;

  const destinationInput = form.querySelector('[name="destination"]');
  const list = document.querySelector("#restaurant-list");
  const cuisineFilter = document.querySelector("#cuisine-filter");
  const countLabel = document.querySelector("#selected-count");
  const message = document.querySelector("#form-message");
  const result = document.querySelector("#plan-result");

  const selected = new Set();      // ids of restaurants the user ticked
  let restaurantsLoadedFor = null; // avoids reloading the same destination

  // ---- photos -------------------------------------------------------------
  async function putPhoto(box, query, altText) {
    if (typeof fetchDestinationImages !== "function") return;
    try {
      const [img] = await fetchDestinationImages(query, 1);
      if (!img) return;
      const tag = document.createElement("img");
      tag.alt = altText;
      tag.addEventListener("load", () => { box.textContent = ""; box.classList.add("has-photo"); box.append(tag); });
      tag.src = img.url;
    } catch { /* keep the emoji */ }
  }

  // ---- restaurant picker --------------------------------------------------
  function updateCount() {
    countLabel.textContent = selected.size
      ? `${selected.size} restaurant${selected.size > 1 ? "s" : ""} selected`
      : "";
  }

  function applyCuisineFilter() {
    const wanted = cuisineFilter.value;
    list.querySelectorAll(".restaurant-card").forEach(card => {
      card.classList.toggle("hidden", Boolean(wanted) && card.dataset.cuisine !== wanted);
    });
  }

  async function loadRestaurants() {
    const destination = destinationInput.value.trim() || "Northern Pakistan";
    if (destination === restaurantsLoadedFor) return;
    restaurantsLoadedFor = destination;
    list.innerHTML = `<p class="hint">Loading restaurants...</p>`;
    try {
      const data = await apiRequest(`/restaurants?destination=${encodeURIComponent(destination)}`);
      const valid = new Set(data.restaurants.map(r => r.id));
      [...selected].forEach(id => { if (!valid.has(id)) selected.delete(id); });

      cuisineFilter.innerHTML = `<option value="">All cuisines</option>` +
        data.cuisines.map(c => `<option>${escapeHTML(c)}</option>`).join("");

      if (!data.restaurants.length) {
        list.innerHTML = `<p class="hint">No restaurant list for "${escapeHTML(destination)}" yet. We will add general meal stops to your plan.</p>`;
        updateCount();
        return;
      }
      list.innerHTML = data.restaurants.map(r => `
        <label class="restaurant-card" data-cuisine="${escapeHTML(r.cuisine)}">
          <div class="restaurant-photo" data-query="${escapeHTML(r.image_query)}" data-name="${escapeHTML(r.name)}">🍽️</div>
          <input type="checkbox" value="${escapeHTML(r.id)}" ${selected.has(r.id) ? "checked" : ""}>
          <span class="restaurant-info">
            <strong>${escapeHTML(r.name)}</strong>
            <small>${escapeHTML(r.area)} · ${escapeHTML(r.cuisine)}</small>
            <small>${escapeHTML(r.speciality)}</small>
            <em>~PKR ${Number(r.price).toLocaleString()} per person</em>
          </span>
        </label>`).join("");
      list.querySelectorAll(".restaurant-photo").forEach(box => putPhoto(box, box.dataset.query, box.dataset.name));
      applyCuisineFilter();
      updateCount();
    } catch {
      restaurantsLoadedFor = null;
      list.innerHTML = `<p class="hint">Could not load restaurants. Make sure the Flask backend is running.</p>`;
    }
  }

  list.addEventListener("change", event => {
    if (event.target.type !== "checkbox") return;
    event.target.checked ? selected.add(event.target.value) : selected.delete(event.target.value);
    event.target.closest(".restaurant-card").classList.toggle("is-selected", event.target.checked);
    updateCount();
  });
  cuisineFilter.addEventListener("change", applyCuisineFilter);

  // ---- 4 photos of the destination --------------------------------------
  const photoStrip = document.querySelector("#destination-photos");
  let photosFor = null;
  async function loadDestinationPhotos() {
    if (!photoStrip || typeof fetchDestinationImages !== "function") return;
    const name = destinationInput.value.trim();
    if (name.length < 3) { photoStrip.classList.add("hidden"); photosFor = null; return; }
    if (name === photosFor) return;
    photosFor = name;
    photoStrip.classList.remove("hidden");
    photoStrip.innerHTML = `<p class="hint">Loading photos of ${escapeHTML(name)}...</p>`;
    try {
      const images = await fetchDestinationImages(name, 4);
      if (name !== photosFor) return; // user kept typing
      if (!images.length) { photoStrip.classList.add("hidden"); return; }
      photoStrip.innerHTML = images.map(img =>
        `<a href="${escapeHTML(img.source)}" target="_blank" rel="noopener"><figure><img src="${escapeHTML(img.url)}" alt="${escapeHTML(img.caption)}"><figcaption>${escapeHTML(img.caption)}</figcaption></figure></a>`
      ).join("");
    } catch { photoStrip.classList.add("hidden"); }
  }

  let timer;
  function onDestinationChange() { loadRestaurants(); loadDestinationPhotos(); }
  destinationInput.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(onDestinationChange, 600); });
  destinationInput.addEventListener("change", onDestinationChange);
  loadRestaurants();
  loadDestinationPhotos();

  // ---- generate itinerary -------------------------------------------------
  function renderMeals(day) {
    if (!day.meals || !day.meals.length) return "";
    return `<div class="meal-list">${day.meals.map(m => `
      <div class="meal-row">
        <div class="meal-photo" data-query="${escapeHTML(m.restaurant.image_query)}" data-name="${escapeHTML(m.restaurant.name)}">🍽️</div>
        <div><strong>${escapeHTML(m.meal)}: ${escapeHTML(m.restaurant.name)}</strong>
        <small>${escapeHTML(m.restaurant.area)} · ${escapeHTML(m.restaurant.cuisine)} · ~PKR ${Number(m.restaurant.price).toLocaleString()} per person</small></div>
      </div>`).join("")}</div>`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    values.duration = Number(values.duration);
    values.budget = Number(values.budget);
    values.restaurants = [...selected];
    message.textContent = "Generating your travel plan...";
    try {
      const data = await apiRequest("/itinerary/generate", { method: "POST", body: JSON.stringify(values) });
      result.classList.remove("hidden");
      result.innerHTML = `<h2>${escapeHTML(data.destination)} trip plan</h2>
        <p>Estimated budget: PKR ${Number(data.estimated_cost).toLocaleString()}</p>
        ${data.estimated_food_cost_per_person ? `<p>Food for the trip: about PKR ${Number(data.estimated_food_cost_per_person).toLocaleString()} per person${data.over_budget_food ? " <strong>(more than your budget, try cheaper restaurants)</strong>" : ""}</p>` : ""}
        ${data.days.map(day => `<div class="plan-day day-c${(day.day - 1) % 6}">
          <div class="day-head"><span class="day-badge">Day ${day.day}</span><h3>${escapeHTML(day.title)}</h3><span class="day-cost">~PKR ${Number(day.estimated_cost).toLocaleString()}</span></div>
          <div class="chips">${day.activities.map(a => `<span class="chip">${escapeHTML(a)}</span>`).join("")}</div>${renderMeals(day)}</div>`).join("")}
        <p class="hint">${escapeHTML(data.budget_note)}</p>`;
      result.querySelectorAll(".meal-photo").forEach(box => putPhoto(box, box.dataset.query, box.dataset.name));
      message.textContent = "Your plan is ready.";
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      message.textContent = `${error.message}. Make sure the Flask backend is running.`;
    }
  });
});

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}