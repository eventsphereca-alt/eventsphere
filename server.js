const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 3000);
const { handleApi } = require("./backend/router");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

async function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const content = await fs.readFile(filePath);
  res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
  res.end(content);
}

async function handlePage(res, pathname) {
  const pages = {
    "/": "index.html",
    "/vendor": "index.html",
    "/admin": "index.html",
    "/listings": "index.html",
    "/list-your-business": "index.html",
    "/vendors": "index.html",
    "/venues": "index.html",
    "/front/concept-2": "home-alt.html",
    "/vendors": "vendors.html",
    "/login": "login.html",
    "/register": "register.html",
    "/dashboard/vendor": "vendor-dashboard.html",
    "/dashboard/vendor-ops": "vendor-dashboard-ops.html",
    "/dashboard/admin": "admin-growth.html",
    "/dashboard/admin-growth": "admin-growth.html"
  };
  if (pages[pathname]) {
    return serveStaticFile(res, path.join(PUBLIC_DIR, pages[pathname]));
  }
  if (pathname.startsWith("/vendor/")) {
    return serveStaticFile(res, path.join(PUBLIC_DIR, "index.html"));
  }
  if (pathname.startsWith("/vendors/")) {
    return serveStaticFile(res, path.join(PUBLIC_DIR, "vendor.html"));
  }
  if (pathname.startsWith("/listing/")) {
    return serveStaticFile(res, path.join(PUBLIC_DIR, "index.html"));
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      return await handleApi(req, res, url);
    }

    const pageServed = await handlePage(res, pathname);
    if (pageServed !== null) {
      return pageServed;
    }

    const relativePath = pathname === "/" ? "/index.html" : pathname;
    const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(PUBLIC_DIR, safePath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Forbidden" }));
      return;
    }
    await serveStaticFile(res, filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Event Sphere demo running at http://127.0.0.1:${PORT}`);
});
