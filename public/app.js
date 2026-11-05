const sessionKey = "eventsphere_session";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(sessionKey);
}

function money(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function listingCard(item) {
  const badges = [
    item.featured ? `<span class="badge featured">Featured</span>` : "",
    item.verified ? `<span class="badge verified">Verified</span>` : ""
  ]
    .filter(Boolean)
    .join("");

  const extras = item.type === "venue" && item.capacity ? `<span class="chip">${item.capacity} guests</span>` : "";
  return `
    <article class="listing-card">
      <a href="/vendors/${item.slug}">
        <img src="${item.image}" alt="${item.businessName}" />
      </a>
      <div class="listing-copy">
        <div class="badge-row">${badges}</div>
        <div class="listing-title">
          <div>
            <h3><a href="/vendors/${item.slug}">${item.businessName}</a></h3>
            <p class="meta">${item.category} · ${item.city}, ${item.province}</p>
          </div>
          <span class="price">From ${money(item.priceFrom)}</span>
        </div>
        <p>${item.description}</p>
        <div class="chips">
          <span class="chip">${item.rating || "New"} stars</span>
          <span class="chip">${item.reviews || 0} reviews</span>
          ${extras}
        </div>
      </div>
    </article>
  `;
}

function applySessionUI() {
  const session = getSession();
  document.querySelectorAll("[data-session-name]").forEach((node) => {
    node.textContent = session ? session.name.split(" ")[0] : "Account";
  });

  document.querySelectorAll("[data-guest-only]").forEach((node) => {
    node.classList.toggle("hidden", Boolean(session));
  });
  document.querySelectorAll("[data-auth-only]").forEach((node) => {
    node.classList.toggle("hidden", !session);
  });

  const dashboardLinks = document.querySelectorAll("[data-dashboard-link]");
  dashboardLinks.forEach((node) => {
    if (!session) {
      node.setAttribute("href", "/login");
      node.textContent = "Dashboard";
      return;
    }
    node.setAttribute("href", session.role === "admin" ? "/dashboard/admin" : "/dashboard/vendor");
    node.textContent = session.role === "admin" ? "Admin" : "Dashboard";
  });

  document.querySelectorAll("[data-logout]").forEach((node) => {
    node.addEventListener("click", () => {
      clearSession();
      window.location.href = "/";
    });
  });
}

async function initHome() {
  const data = await api("/api/bootstrap");
  document.querySelector("[data-stat-vendors]").textContent = data.stats.vendors;
  document.querySelector("[data-stat-venues]").textContent = data.stats.venues;
  document.querySelector("[data-stat-cities]").textContent = data.stats.cities;
  document.querySelector("[data-stat-categories]").textContent = data.stats.categories;

  const categories = document.querySelector("[data-categories]");
  categories.innerHTML = data.categories
    .map(
      (category) => `
        <a class="card" href="/vendors?type=vendor&category=${encodeURIComponent(category.name)}">
          <h3>${category.name}</h3>
          <p>${category.count} live vendors</p>
        </a>
      `
    )
    .join("");

  const featured = document.querySelector("[data-featured-vendors]");
  featured.innerHTML = data.featuredVendors.map(listingCard).join("");

  const venues = document.querySelector("[data-featured-venues]");
  venues.innerHTML = data.featuredVenues.map(listingCard).join("");

  const citySelect = document.querySelector("[name='city']");
  const categorySelect = document.querySelector("[name='category']");
  const typeSelect = document.querySelector("[name='type']");
  for (const city of data.cities) {
    citySelect.insertAdjacentHTML("beforeend", `<option value="${city}">${city}</option>`);
  }
  for (const category of data.categories) {
    categorySelect.insertAdjacentHTML("beforeend", `<option value="${category.name}">${category.name}</option>`);
  }

  document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (value) {
        params.set(key, value);
      }
    }
    if (!params.get("type")) {
      params.set("type", typeSelect.value || "all");
    }
    window.location.href = `/vendors?${params.toString()}`;
  });
}

async function initHomeAlt() {
  const bootstrap = await api("/api/bootstrap");
  const vendorsPayload = await api("/api/vendors?type=all");
  const categories = document.querySelector("[data-alt-categories]");
  const cityRail = document.querySelector("[data-alt-cities]");
  const topListings = document.querySelector("[data-alt-top]");
  const latestListings = document.querySelector("[data-alt-latest]");
  const form = document.querySelector("[data-alt-search-form]");
  const citySelect = document.querySelector("[name='city']");
  const categorySelect = document.querySelector("[name='category']");
  const typeSelect = document.querySelector("[name='type']");

  categories.innerHTML = bootstrap.categories
    .map((category) => `<a class="chip" href="/vendors?type=vendor&category=${encodeURIComponent(category.name)}">${category.name}</a>`)
    .join("");

  cityRail.innerHTML = bootstrap.cities
    .map((city) => `<a class="chip" href="/vendors?city=${encodeURIComponent(city)}">${city}</a>`)
    .join("");

  topListings.innerHTML = vendorsPayload.results
    .filter((item) => item.featured)
    .slice(0, 3)
    .map(listingCard)
    .join("");

  latestListings.innerHTML = vendorsPayload.results.slice(0, 6).map(listingCard).join("");

  bootstrap.cities.forEach((city) => {
    citySelect.insertAdjacentHTML("beforeend", `<option value="${city}">${city}</option>`);
  });
  vendorsPayload.categories.forEach((category) => {
    categorySelect.insertAdjacentHTML("beforeend", `<option value="${category}">${category}</option>`);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) {
        params.set(key, value);
      }
    }
    params.set("type", typeSelect.value || "all");
    window.location.href = `/vendors?${params.toString()}`;
  });
}

async function initVendors() {
  const params = new URLSearchParams(window.location.search);
  const payload = await api(`/api/vendors?${params.toString()}`);
  const resultCount = document.querySelector("[data-result-count]");
  const results = document.querySelector("[data-results]");
  const categorySelect = document.querySelector("[name='category']");
  const citySelect = document.querySelector("[name='city']");
  const typeSelect = document.querySelector("[name='type']");
  const searchInput = document.querySelector("[name='q']");

  payload.categories.forEach((category) => {
    categorySelect.insertAdjacentHTML("beforeend", `<option value="${category}">${category}</option>`);
  });
  payload.cities.forEach((city) => {
    citySelect.insertAdjacentHTML("beforeend", `<option value="${city}">${city}</option>`);
  });

  categorySelect.value = payload.filters.category;
  citySelect.value = payload.filters.city;
  typeSelect.value = payload.filters.type;
  searchInput.value = payload.filters.q;

  resultCount.textContent = `${payload.results.length} results`;
  if (!payload.results.length) {
    results.innerHTML = `<div class="empty-state"><h3>No listings matched that search.</h3><p>Try a broader city, category, or keyword.</p></div>`;
  } else {
    results.innerHTML = payload.results.map(listingCard).join("");
  }

  document.querySelector("[data-filter-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (value) {
        nextParams.set(key, value);
      }
    }
    window.location.search = nextParams.toString();
  });
}

async function initVendorDetail() {
  const slug = window.location.pathname.split("/").filter(Boolean).pop();
  const payload = await api(`/api/vendors/${slug}`);
  const item = payload.listing;
  document.title = `${item.businessName} | EventSphere`;
  document.querySelector("[data-detail-hero]").innerHTML = `
    <div class="detail-card card">
      <img src="${item.image}" alt="${item.businessName}" />
      <div class="detail-copy">
        <div class="badge-row">
          ${item.featured ? '<span class="badge featured">Featured</span>' : ""}
          ${item.verified ? '<span class="badge verified">Verified</span>' : ""}
          <span class="chip">${item.category}</span>
        </div>
        <div class="listing-title">
          <div>
            <h1>${item.businessName}</h1>
            <p>${item.city}, ${item.province}${item.capacity ? ` · ${item.capacity} guests` : ""}</p>
          </div>
          <span class="price">${money(item.priceFrom)}</span>
        </div>
        <p>${item.longDescription}</p>
        <div class="chips">
          ${(item.tags || []).map((tag) => `<span class="chip">${tag}</span>`).join("")}
        </div>
      </div>
    </div>
    <aside class="contact-card">
      <div>
        <h3>Contact ${item.type === "venue" ? "venue team" : "vendor"}</h3>
        <p class="meta">Direct actions, no lead gate.</p>
      </div>
      <a class="button" href="mailto:${item.contact.email}">Email</a>
      <a class="button secondary" href="tel:${item.contact.phone}">Call ${item.contact.phone}</a>
      <a class="button secondary" target="_blank" rel="noreferrer" href="https://wa.me/${item.contact.whatsapp}">WhatsApp</a>
      <div class="chips">
        <span class="chip">${item.rating || "New"} stars</span>
        <span class="chip">${item.reviews || 0} reviews</span>
        ${item.verified ? '<span class="chip">Verified listing</span>' : ""}
      </div>
    </aside>
  `;

  document.querySelector("[data-gallery]").innerHTML = (item.gallery || [])
    .map((image) => `<img src="${image}" alt="${item.businessName} gallery image" />`)
    .join("");

  document.querySelector("[data-detail-meta]").innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h3>About</h3>
        <p>${item.description}</p>
      </div>
      <div class="panel">
        <h3>Best for</h3>
        <div class="chips">${(item.eventTypes || ["Weddings", "Birthdays"]).map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      </div>
    </div>
  `;

  const similar = document.querySelector("[data-similar]");
  if (!payload.similar.length) {
    similar.innerHTML = `<div class="empty-state"><h3>No similar listings yet.</h3><p>This category needs more supply.</p></div>`;
  } else {
    similar.innerHTML = payload.similar.map(listingCard).join("");
  }
}

async function initLogin() {
  const form = document.querySelector("[data-login-form]");
  const message = document.querySelector("[data-form-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    const formData = new FormData(form);
    try {
      const payload = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      setSession(payload.session);
      window.location.href = payload.session.role === "admin" ? "/dashboard/admin" : "/dashboard/vendor";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

async function initRegister() {
  const form = document.querySelector("[data-register-form]");
  const message = document.querySelector("[data-form-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    const formData = new FormData(form);
    try {
      const payload = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      setSession(payload.session);
      window.location.href = "/dashboard/vendor";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

async function initVendorDashboard() {
  const session = getSession();
  const guard = document.querySelector("[data-guard]");
  const app = document.querySelector("[data-vendor-app]");
  if (!session || session.role !== "vendor" || !session.vendorSlug) {
    guard.classList.remove("hidden");
    app.classList.add("hidden");
    return;
  }

  const payload = await api(`/api/dashboard/vendor/${session.vendorSlug}`);
  const vendor = payload.vendor;
  document.querySelector("[data-vendor-name]").textContent = vendor.businessName;
  const status = document.querySelector("[data-vendor-status]");
  status.textContent = vendor.status;
  status.className = `status ${vendor.status}`;
  document.querySelector("[data-kpi-views-today]").textContent = vendor.metrics.profileViewsToday;
  document.querySelector("[data-kpi-views-week]").textContent = vendor.metrics.profileViewsWeek;
  document.querySelector("[data-kpi-views-month]").textContent = vendor.metrics.profileViewsMonth;
  document.querySelector("[data-kpi-leads]").textContent = vendor.metrics.leadsOpen;
  document.querySelector("[data-view-public]").setAttribute("href", `/vendors/${vendor.slug}`);

  document.querySelector("[data-open-leads]").innerHTML = payload.openLeads
    .map(
      (lead) => `
        <div class="listing-row">
          <div class="message">
            <strong>${lead.name.slice(0, 1)}</strong>
          </div>
          <div>
            <div class="badge-row">
              <strong>${lead.name}</strong>
              <span class="chip">${lead.eventType}</span>
            </div>
            <p>${lead.city} · ${lead.guests} guests · ${lead.budget}</p>
            <p class="mini">${lead.date}</p>
          </div>
          <span class="chip">Due ${lead.due}</span>
        </div>
      `
    )
    .join("");
}

async function initVendorDashboardOps() {
  const session = getSession();
  const guard = document.querySelector("[data-guard]");
  const app = document.querySelector("[data-vendor-app]");
  if (!session || session.role !== "vendor" || !session.vendorSlug) {
    guard.classList.remove("hidden");
    app.classList.add("hidden");
    return;
  }

  const payload = await api(`/api/dashboard/vendor/${session.vendorSlug}`);
  const vendor = payload.vendor;
  document.querySelector("[data-vendor-name]").textContent = vendor.businessName;
  document.querySelector("[data-response-time]").textContent = vendor.metrics.responseTime;
  document.querySelector("[data-leads-open]").textContent = vendor.metrics.leadsOpen;
  document.querySelector("[data-bookings-month]").textContent = vendor.metrics.bookingsMonth;
  document.querySelector("[data-ops-public]").setAttribute("href", `/vendors/${vendor.slug}`);

  const form = document.querySelector("[data-vendor-form]");
  form.businessName.value = vendor.businessName;
  form.category.value = vendor.category;
  form.city.value = vendor.city;
  form.priceFrom.value = vendor.priceFrom;
  form.description.value = vendor.description;
  form.longDescription.value = vendor.longDescription;
  form.email.value = vendor.contact.email;
  form.phone.value = vendor.contact.phone;
  form.whatsapp.value = vendor.contact.whatsapp;
  form.tags.value = vendor.tags.join(", ");

  const queue = document.querySelector("[data-ops-queue]");
  const won = document.querySelector("[data-ops-won]");
  const followup = document.querySelector("[data-ops-followup]");
  const cards = payload.openLeads;

  queue.innerHTML = cards
    .slice(0, 2)
    .map(
      (lead) => `
      <div class="ops-item">
        <strong>${lead.eventType}</strong>
        <p>${lead.city} · ${lead.guests} guests · ${lead.budget}</p>
        <span class="chip">Due ${lead.due}</span>
      </div>
    `
    )
    .join("");

  followup.innerHTML = cards
    .slice(2)
    .map(
      (lead) => `
      <div class="ops-item">
        <strong>${lead.name}</strong>
        <p>${lead.eventType} · ${lead.city}</p>
        <span class="chip">Follow up</span>
      </div>
    `
    )
    .join("");

  won.innerHTML = `
    <div class="ops-item">
      <strong>Wedding reception · Mississauga</strong>
      <p>Booked last week · $5,200 package</p>
      <span class="chip">Won</span>
    </div>
    <div class="ops-item">
      <strong>Community gala · Toronto</strong>
      <p>Booked this week · $3,400 package</p>
      <span class="chip">Won</span>
    </div>
  `;

  const message = document.querySelector("[data-save-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    const formData = new FormData(form);
    try {
      await api(`/api/dashboard/vendor/${vendor.slug}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      message.textContent = "Profile updated.";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

async function initAdminDashboard() {
  const session = getSession();
  const guard = document.querySelector("[data-guard]");
  const app = document.querySelector("[data-admin-app]");
  if (!session || session.role !== "admin") {
    guard.classList.remove("hidden");
    app.classList.add("hidden");
    return;
  }

  const filterButtons = document.querySelectorAll("[data-filter-status]");
  let activeFilter = "all";

  async function render() {
    const payload = await api("/api/dashboard/admin");
    document.querySelector("[data-count-pending]").textContent = payload.counts.pending;
    document.querySelector("[data-count-approved]").textContent = payload.counts.approved;
    document.querySelector("[data-count-rejected]").textContent = payload.counts.rejected;
    document.querySelector("[data-count-featured]").textContent = payload.counts.featured;

    const rows = payload.vendors
      .filter((vendor) => (activeFilter === "all" ? true : vendor.status === activeFilter))
      .map(
        (vendor) => `
          <div class="listing-row">
            <img src="${vendor.image}" alt="${vendor.businessName}" />
            <div>
              <div class="badge-row">
                <strong>${vendor.businessName}</strong>
                <span class="status ${vendor.status}">${vendor.status}</span>
                ${vendor.featured ? '<span class="badge featured">Featured</span>' : ""}
              </div>
              <p>${vendor.category} · ${vendor.city}</p>
              <p class="mini">${vendor.description}</p>
            </div>
            <div class="inline-actions">
              <button class="button small secondary" data-admin-action="approved" data-id="${vendor.id}">Approve</button>
              <button class="button small secondary" data-admin-action="pending" data-id="${vendor.id}">Pending</button>
              <button class="button small secondary" data-admin-action="rejected" data-id="${vendor.id}">Reject</button>
              <button class="button small" data-admin-feature="${vendor.featured ? "false" : "true"}" data-id="${vendor.id}">
                ${vendor.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        `
      )
      .join("");
    document.querySelector("[data-admin-list]").innerHTML =
      rows || `<div class="empty-state"><h3>No listings in this state.</h3><p>Switch tabs or create more vendor data.</p></div>`;

    document.querySelectorAll("[data-admin-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        await api(`/api/admin/vendors/${button.dataset.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: button.dataset.adminAction })
        });
        render();
      });
    });

    document.querySelectorAll("[data-admin-feature]").forEach((button) => {
      button.addEventListener("click", async () => {
        await api(`/api/admin/vendors/${button.dataset.id}`, {
          method: "PATCH",
          body: JSON.stringify({ featured: button.dataset.adminFeature === "true" })
        });
        render();
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filterStatus;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  render();
}

async function initAdminGrowth() {
  const session = getSession();
  const guard = document.querySelector("[data-guard]");
  const app = document.querySelector("[data-admin-app]");
  if (!session || session.role !== "admin") {
    guard.classList.remove("hidden");
    app.classList.add("hidden");
    return;
  }

  const admin = await api("/api/dashboard/admin");
  const listings = await api("/api/vendors?type=all");
  const approved = admin.vendors.filter((item) => item.status === "approved");
  const cityCounts = {};
  for (const item of listings.results) {
    cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
  }
  const cityRows = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCount = cityRows[0] ? cityRows[0][1] : 1;

  document.querySelector("[data-growth-approved]").textContent = approved.length;
  document.querySelector("[data-growth-featured]").textContent = admin.counts.featured;
  document.querySelector("[data-growth-pending]").textContent = admin.counts.pending;
  document.querySelector("[data-growth-total]").textContent = listings.results.length;

  document.querySelector("[data-growth-cities]").innerHTML = cityRows
    .map(
      ([city, count]) => `
      <div class="bar-row">
        <div class="meta-row"><strong>${city}</strong><span>${count}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(12, (count / maxCount) * 100)}%"></div></div>
      </div>
    `
    )
    .join("");

  document.querySelector("[data-growth-featured-list]").innerHTML = approved
    .filter((item) => item.featured)
    .slice(0, 5)
    .map(
      (item) => `
      <div class="listing-row">
        <img src="${item.image}" alt="${item.businessName}" />
        <div>
          <strong>${item.businessName}</strong>
          <p>${item.category} · ${item.city}</p>
          <p class="mini">Featured placement is active for this listing.</p>
        </div>
        <span class="badge featured">Featured</span>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  applySessionUI();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "home-alt") initHomeAlt();
  if (page === "vendors") initVendors();
  if (page === "vendor-detail") initVendorDetail();
  if (page === "login") initLogin();
  if (page === "register") initRegister();
  if (page === "vendor-dashboard") initVendorDashboard();
  if (page === "vendor-dashboard-ops") initVendorDashboardOps();
  if (page === "admin-dashboard") initAdminDashboard();
  if (page === "admin-dashboard-growth") initAdminGrowth();
});
