require("dotenv").config();

const ingmanKioskiOsoitteet = require("./ingman_raw.json");
const ingmanKioskit = [];

const { Client, Status } = require("@googlemaps/google-maps-services-js");

const getCoordinates = async (address) => {
  const googleMaps = new Client({});
  try {
    const res = await googleMaps.geocode({
      params: {
        address: address,
        components: "country:FI",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    if (res.data.results[0]) {
      if (res.data.results[0].geometry) {
        return [
          res.data.results[0].geometry.location.lat,
          res.data.results[0].geometry.location.lng,
        ];
      } else {
        console.error(`erroneous result for ${address}`);
        console.error(JSON.stringify(res.data.results, null, 2));
        console.error("\n");
        return undefined;
      }
    } else {
      console.error(`can't find address ${address}`);
      console.error(JSON.stringify(res.data.results, null, 2));
      console.error("\n");
      return undefined;
    }
  } catch (e) {
    console.error(e);
  }
};

const isUpperCase = (str) => {
  return str === str.toUpperCase();
};

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const main = async () => {
  for (const item of ingmanKioskiOsoitteet) {
    const title = "Ingman";

    let name = item["Kioskipaikan nimi"];
    if (isUpperCase(name)) {
      name = toTitleCase(name);
    }
    name = name
      .replace(/n Jäätelökioski */, "")
      .replace(/Jäätelökioski */, "")
      .replace(/Glasskiosk /, "");

    let address = item["Kioskin osoite"];
    if (isUpperCase(address)) {
      address = toTitleCase(address);
    }

    const description = `${name}\n${address}\n${item["Postino."]} ${item["Kaupunki"]}`;

    const latLon = await getCoordinates(
      `${address}, ${item["Postino."]} ${item["Kaupunki"]}`
    );

    if (latLon !== undefined) {
      ingmanKioskit.push({
        title: title,
        description: description,
        latitude: latLon[0],
        longitude: latLon[1],
      });
    }
  }

  console.log(JSON.stringify(ingmanKioskit, null, 2));
};

main();
