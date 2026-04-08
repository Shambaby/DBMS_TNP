const API_BASE = "/api";

const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async post(path, data) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async put(path, data) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async delete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container") || (() => {
    const el = document.createElement("div");
    el.id = "toast-container";
    el.style.cssText = "position:fixed;top:1rem;right:1rem;z-index:9999;";
    document.body.appendChild(el);
    return el;
  })();
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type === "success" ? "success" : "danger"} border-0 show`;
  toast.role = "alert";
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCTC(ctc) {
  if (!ctc) return "—";
  return "₹" + Number(ctc).toLocaleString("en-IN");
}
