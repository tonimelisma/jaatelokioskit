const fs = require("fs");

const helsingin = require("./helsingin_jäätelötehdas.json");
const pingviini = require("./pingviini.json");
const hgin_kioskit = require("./hki_kioskit_cooked.json");
const ingman = require("./ingman_cooked.json");

// start with helsingin jäätelötehdas
const kioskit = helsingin;

// Helsingin kaupungin kioskiluvat
hgin_kioskit.forEach((item) => {
  const out = {
    title: item.nimi,
    description: `${item.tyyppi}\n${item.osoite}`,
    latitude: item.geometria[1],
    longitude: item.geometria[0],
  };
  kioskit.push(out);
});

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

// ingman
ingman.forEach((item) => {
  kioskit.push(item);
});

// create IDs and consolidate list, filter duplicates
const kioskitFiltered = [];
kioskit.forEach((item, i) => {
  item.id = i + 1;

  if (
    !kioskitFiltered.find((element) => {
      return (
        element.latitude - item.latitude < 0.00002 &&
        element.longitude - item.longitude < 0.00002 &&
        element.title === item.title
      );
    })
  ) {
    kioskitFiltered.push(item);
  } else {
    console.error("duplicate:");
    console.error(item);
  }
});

const kioskitString = JSON.stringify(kioskitFiltered);

fs.writeFileSync("kioskit.json", kioskitString);
