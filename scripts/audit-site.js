const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];
const forbiddenPatterns = [
  { pattern: /hk-bau\.org/i, label: "old hk-bau.org domain" },
  { pattern: /hkbau\.de/i, label: "old hkbau.de domain" },
  { pattern: /assets\/logo\.svg/i, label: "missing legacy logo asset" },
  { pattern: /assets\/header-image\.jpg/i, label: "missing legacy header asset" },
  { pattern: /kontakt-image\.png/i, label: "missing kontakt-image.png asset" }
];
const badTextPatterns = [
  /\\u[0-9a-fA-F]{4}/,
  /Ã./,
  /Â./,
  /â€./,
  /�/,
  /&amp;amp;/,
  /u0026/
];
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico"]);
const largeImageThreshold = 2 * 1024 * 1024;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "components") return [];
      return walk(filePath);
    }
    return entry.isFile() ? [filePath] : [];
  });
}

function lineFor(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function report(list, file, line, message) {
  list.push(`${path.relative(root, file)}:${line} ${message}`);
}

function stripIgnoredHtml(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function auditHtml(file) {
  const text = fs.readFileSync(file, "utf8");
  const searchable = stripIgnoredHtml(text);

  forbiddenPatterns.forEach(({ pattern, label }) => {
    const match = pattern.exec(searchable);
    if (match) report(errors, file, lineFor(searchable, match.index), `contains ${label}`);
  });

  badTextPatterns.forEach((pattern) => {
    const match = pattern.exec(searchable);
    if (match) report(errors, file, lineFor(searchable, match.index), `contains suspicious text "${match[0]}"`);
  });

  const ids = [...text.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => ({
    id: match[1],
    line: lineFor(text, match.index)
  }));
  const duplicateIds = [...new Set(ids.map((entry) => entry.id).filter((id, index, all) => all.indexOf(id) !== index))];
  duplicateIds.forEach((id) => {
    const lines = ids.filter((entry) => entry.id === id).map((entry) => entry.line).join(", ");
    report(errors, file, ids.find((entry) => entry.id === id).line, `duplicates id="${id}" on lines ${lines}`);
  });

  const refRegex = /(?:href|src)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/g;
  let match;
  while ((match = refRegex.exec(searchable))) {
    const ref = match[1] || match[2];
    if (!ref || /^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(ref) || ref.startsWith("/")) continue;
    const cleanRef = ref.split("#")[0].split("?")[0];
    if (!cleanRef) continue;
    const target = path.resolve(path.dirname(file), cleanRef);
    if (!fs.existsSync(target)) {
      report(errors, file, lineFor(searchable, match.index), `missing local reference "${ref}"`);
    }
  }
}

function auditImage(file) {
  const stats = fs.statSync(file);
  if (stats.size > largeImageThreshold) {
    warnings.push(`${path.relative(root, file)} is ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
  }
}

const files = walk(root);
const oldDump = path.join(root, "old-datenschutz.html");
if (fs.existsSync(oldDump)) {
  report(errors, oldDump, 1, "old Datenschutz dump is still in the publish root");
}

files.forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".html" && path.basename(file) !== "old-datenschutz.html") auditHtml(file);
  if (imageExtensions.has(ext)) auditImage(file);
});

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error("Errors:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Site audit passed.");
