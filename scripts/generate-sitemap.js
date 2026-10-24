const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const siteUrl = (process.env.SITE_URL || "https://rivodaexhaust.id").replace(/\/$/, "");
if (!/^https:\/\//i.test(siteUrl)) throw new Error("SITE_URL harus berupa URL HTTPS.");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path.relative(root, full).split(path.sep).join("/"));
  }
}
walk(root);
files.sort();
const urls = files.map(file => siteUrl + "/" + (file === "index.html" ? "" : file));
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(url => `  <url><loc>${url.replace(/&/g, "&amp;")}</loc></url>`).join("\n") +
  '\n</urlset>\n';
fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");
console.log(`Sitemap dibuat: ${urls.length} URL untuk ${siteUrl}`);
