// Frontend API helper. Flask runs at http://127.0.0.1:5000 by default.
const API_BASE_URL = window.location.port === "5500" ? "http://127.0.0.1:5000/api" : "/api";
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {"Content-Type":"application/json", ...(options.headers || {})},
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
