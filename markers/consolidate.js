const fs = require("fs");

const helsingin = require("./helsingin_jäätelötehdas.json");
const pingviini = require("./pingviini.json");

// start with helsingin jäätelötehdas
const kioskit = helsingin;

// pingviini
pingviini.forEach((item) => {
  const desc = item.details
    .replace(/\n/g, "")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "")
    .replace(/<br \/>/g, "\n");
  const out = {
    title: "Pingviini",
    description: `${item.title}\n${desc}`,
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
  };
  kioskit.push(out);
});

// create IDs and consolidate list
kioskit.forEach((item, i) => {
  item.id = i + 1;
});

const kioskitString = JSON.stringify(kioskit);

fs.writeFileSync("kioskit.json", kioskitString);
