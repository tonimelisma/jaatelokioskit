const axios = require("axios").default;
const xmlparser = require("fast-xml-parser");
const moment = require("moment");
const proj4 = require("proj4");

proj4.defs(
  "EPSG:3879",
  "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);

const transformGeometry = (geometry) => {
  const array = geometry.split(" ");
  const xs = [],
    ys = [];
  array.forEach((item, index) => {
    if (!(index % 2)) {
      ys.push(parseFloat(item));
    } else {
      xs.push(parseFloat(item));
    }
  });

  xs.pop();
  ys.pop();

  const xsum = xs.reduce((acc, c) => acc + c, 0);
  const x = xsum / xs.length;

  const ysum = ys.reduce((acc, c) => acc + c, 0);
  const y = ysum / ys.length;

  return proj4("EPSG:3879", "WGS84", [x, y]);
};

axios
  .get(
    "https://kartta.hel.fi/ws/geoserver/avoindata/wfs?request=getFeature&typename=avoindata:Winkki_rents_audiences"
  )
  .then((resp) => {
    const json = xmlparser.parse(resp.data);

    const kioskit = [];

    json["wfs:FeatureCollection"]["wfs:member"].forEach((item) => {
      if (
        item["avoindata:Winkki_rents_audiences"]["avoindata:rental_subject"] ===
        "Kioskipaikkavuokra"
      ) {
        const startdate = moment(
          item["avoindata:Winkki_rents_audiences"]["avoindata:event_startdate"]
        );
        const enddate = moment(
          item["avoindata:Winkki_rents_audiences"]["avoindata:event_enddate"]
        );

        const output = {
          id:
            item["avoindata:Winkki_rents_audiences"][
              "avoindata:tietopalvelu_id"
            ],
          nimi: item["avoindata:Winkki_rents_audiences"][
            "avoindata:licence_applicant_company"
          ]
            .replace(/.*Froneri.*/, "Pingviini")
            .replace(/.*Unilever.*/, "Ingman")
            .replace(/ [Oo][Yy]/, ""),
          tyyppi:
            item["avoindata:Winkki_rents_audiences"][
              "avoindata:event_description"
            ],
          osoite: item["avoindata:Winkki_rents_audiences"][
            "avoindata:location_description"
          ]
            ? item["avoindata:Winkki_rents_audiences"][
                "avoindata:location_description"
              ]
                .replace(/liitekartta */, "")
                .replace(/kts\. */, "")
                .replace(/\( *\)/, "")
            : "",
          /* geometria: transformGeometry(
            item["avoindata:Winkki_rents_audiences"]["avoindata:geom"][
              "gml:MultiSurface"
            ]["gml:surfaceMember"]["gml:Polygon"]["gml:exterior"][
              "gml:LinearRing"
            ]["gml:posList"]
          ),*/
          geometria: Array.isArray(
            item["avoindata:Winkki_rents_audiences"]["avoindata:geom"][
              "gml:MultiSurface"
            ]["gml:surfaceMember"]
          )
            ? transformGeometry(
                item["avoindata:Winkki_rents_audiences"]["avoindata:geom"][
                  "gml:MultiSurface"
                ]["gml:surfaceMember"][0]["gml:Polygon"]["gml:exterior"][
                  "gml:LinearRing"
                ]["gml:posList"]
              )
            : transformGeometry(
                item["avoindata:Winkki_rents_audiences"]["avoindata:geom"][
                  "gml:MultiSurface"
                ]["gml:surfaceMember"]["gml:Polygon"]["gml:exterior"][
                  "gml:LinearRing"
                ]["gml:posList"]
              ),
          voimassa:
            startdate.isSameOrBefore() && enddate.isSameOrAfter()
              ? true
              : false,
        };
        kioskit.push(output);
      }
    });

    const kioskit2 = kioskit.filter((element) => {
      return (
        (element.tyyppi.match(/äätelö/) ||
          element.nimi.match(/Pingviini/) ||
          element.nimi.match(/Ingman/) ||
          element.nimi.match(/äätelö/)) &&
        !element.tyyppi.match(/rilli/) &&
        !element.nimi.match(/rilli/) &&
        !element.tyyppi.match(/ukka/) &&
        !element.nimi.match(/ukka/)
      );
    });

    console.log(JSON.stringify(kioskit2, null, 2));
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });
