const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4174);
const routes = new Map([
  ["/", "index.html"],
  ["/about-us", "website-redesign-pages/about-us/index.html"],
  ["/products", "website-redesign-pages/products/index.html"],
  ["/contact", "website-redesign-pages/contact/index.html"],
  ["/shipping-policy", "website-redesign-pages/shipping-policy/index.html"],
  ["/refund-policy", "website-redesign-pages/refund-policy/index.html"],
  ["/privacy-policy", "website-redesign-pages/privacy-policy/index.html"],
  ["/terms-of-service", "website-redesign-pages/terms-of-service/index.html"],
  ["/intellectual-property-rights", "website-redesign-pages/intellectual-property-rights/index.html"],
]);
const slugs = [...routes.keys()].filter((route) => route !== "/");
const legacyRoutes = new Map([
  ["/website-redesign-pages/homepage", "/"],
  ...slugs.map((slug) => [`/website-redesign-pages${slug}`, slug]),
]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function sendFile(request, response, filename) {
  fs.stat(filename, (error, stat) => {
    if (error || !stat.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const type = contentTypes[path.extname(filename).toLowerCase()] || "application/octet-stream";
    const range = request.headers.range;
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Content-Type", type);

    if (range && type === "video/mp4") {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        response.end();
        return;
      }
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start > end || start >= stat.size) {
        response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        response.end();
        return;
      }
      response.writeHead(206, {
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      });
      fs.createReadStream(filename, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, { "Content-Length": stat.size });
    if (request.method === "HEAD") response.end();
    else fs.createReadStream(filename).pipe(response);
  });
}

http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  if (pathname.endsWith("/index.html")) {
    const cleanPath = pathname.slice(0, -"/index.html".length) || "/";
    response.writeHead(308, { Location: `${cleanPath}${new URL(request.url, "http://localhost").search}` });
    response.end();
    return;
  }

  const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (legacyRoutes.has(cleanPath)) {
    response.writeHead(308, { Location: `${legacyRoutes.get(cleanPath)}${new URL(request.url, "http://localhost").search}` });
    response.end();
    return;
  }
  if (pathname !== "/" && pathname.endsWith("/") && routes.has(cleanPath)) {
    response.writeHead(308, { Location: `${cleanPath}${new URL(request.url, "http://localhost").search}` });
    response.end();
    return;
  }

  const relative = routes.get(cleanPath) || `.${pathname}`;
  const filename = path.resolve(root, relative);
  if (filename !== root && !filename.startsWith(root + path.sep)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.stat(filename, (error, stat) => {
    if (!error && stat.isDirectory()) sendFile(request, response, path.join(filename, "index.html"));
    else sendFile(request, response, filename);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Shevelia preview running at http://127.0.0.1:${port}/`);
});
