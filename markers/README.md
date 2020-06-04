# Ohjeet jäätelökioskien sijaintien päivittämiseksi

Ingman oli niin ystävällinen, että antoi jäätelökioskien sijainnit excel-taulukkona.
Ne pitää siis päivittää manuaalisesti.

Myös Helsingin jäätelötehtaan kioskeja oli niin vähän, että ne on syötetty käsin.

Helsingin kaupungin kioskiluvat löytyy heidän avoimesta datasta ja pingviinin kiskat
pitää screipata heidän nettisivuiltaan.

Komennot:
./pingviinidump.sh
node helsinki_kioskit.js > hki_kioskit_cooked.json
node ingman_geokoodaus.js > ingman_cooked.json
node consolidate.js