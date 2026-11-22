document.addEventListener("DOMContentLoaded", async () => {
  const list = document.querySelector("#destination-list");
  if (list) {
    try {
      const data = await apiRequest("/destinations");
      list.innerHTML = data.destinations.map(d => `<article class="destination-card" data-name="${safe(d.name)}"><div class="destination-image">📍</div><div class="card-body"><h3>${safe(d.name)}</h3><p>${safe(d.region)} · ${safe(d.description)}</p></div></article>`).join("");
      if (window.addCardThumbnails) addCardThumbnails();
    } catch {
      list.innerHTML = `<div class="panel">Could not load destinations. Start the backend server and refresh.</div>`;
    }
  }
  for (const [id, endpoint] of [["login-form","/auth/login"],["register-form","/auth/register"]]) {
    const form = document.getElementById(id);
    if (!form) continue;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const msg = form.querySelector(".message");
      try {
        const result = await apiRequest(endpoint,{method:"POST",body:JSON.stringify(Object.fromEntries(new FormData(form)))});
        if (result.token) localStorage.setItem("travel_buddy_token",result.token);
        msg.textContent = result.message || "Success!";
      } catch(err) { msg.textContent = err.message; }
    });
  }
});
function safe(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
