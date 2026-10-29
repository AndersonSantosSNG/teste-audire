const fs = require("fs");
const path = require("path");
const root = __dirname;
const broken = "M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z";
const correct = "M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z";
let changed = 0;
for (const page of fs.readdirSync(root).filter((file) => file.endsWith(".html"))) {
  const file = path.join(root, page);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes(broken)) {
    html = html.replaceAll(broken, correct);
    fs.writeFileSync(file, html, "utf8");
    changed++;
  }
}
console.log(`Globo corrigido em ${changed} páginas.`);
