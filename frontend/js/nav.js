// Shared navigation and auth guard

function requireAuth() {
  const admin = JSON.parse(localStorage.getItem("tnp_admin") || "null");
  if (!admin) { window.location.href = "index.html"; return null; }
  return admin;
}

function renderNav(activePage) {
  const admin = requireAuth();
  if (!admin) return;

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill", href: "dashboard.html" },
    { id: "companies", label: "Companies", icon: "bi-building-fill", href: "companies.html" },
    { id: "jobs", label: "Job Openings", icon: "bi-briefcase-fill", href: "jobs.html" },
    { id: "students", label: "Students", icon: "bi-people-fill", href: "students.html" },
    { id: "applications", label: "Applications", icon: "bi-file-earmark-text-fill", href: "applications.html" },
    { id: "placements", label: "Placements", icon: "bi-trophy-fill", href: "placements.html" },
  ];

  const navHtml = `
    <nav class="navbar navbar-expand-lg tnp-navbar">
      <div class="container-fluid px-4">
        <a class="navbar-brand d-flex align-items-center gap-2" href="dashboard.html">
          <span class="nav-logo"><i class="bi bi-mortarboard-fill"></i></span>
          <span class="fw-semibold">TNP Portal</span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <i class="bi bi-list text-white fs-4"></i>
        </button>
        <div class="collapse navbar-collapse" id="navContent">
          <ul class="navbar-nav me-auto gap-1">
            ${navLinks.map(l => `
              <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-1 ${activePage === l.id ? "active" : ""}" href="${l.href}">
                  <i class="bi ${l.icon}"></i> ${l.label}
                </a>
              </li>`).join("")}
          </ul>
          <div class="d-flex align-items-center gap-3">
            <span class="text-white-50 small"><i class="bi bi-person-circle me-1"></i>${admin.email}</span>
            <button class="btn btn-sm btn-outline-light" onclick="doLogout()"><i class="bi bi-box-arrow-right me-1"></i>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `;

  document.getElementById("nav-placeholder").innerHTML = navHtml;
}

function doLogout() {
  localStorage.removeItem("tnp_admin");
  window.location.href = "index.html";
}
