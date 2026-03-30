// =========================
// 1. AOI Setup (Vidarbha)
// =========================
var akola = ee.FeatureCollection('projects/pbl3project/assets/akola_district');
var amravati = ee.FeatureCollection('projects/pbl3project/assets/amravati_district');
var bhandara = ee.FeatureCollection('projects/pbl3project/assets/bhandara_district');
var buldhana = ee.FeatureCollection('projects/pbl3project/assets/buldhana_district');
var chandrapur = ee.FeatureCollection('projects/pbl3project/assets/chandrapur_district');
var gadchiroli = ee.FeatureCollection('projects/pbl3project/assets/gadchiroli_district');
var gondia = ee.FeatureCollection('projects/pbl3project/assets/gondia_district');
var nagpur = ee.FeatureCollection('projects/pbl3project/assets/nagpur_district');
var wardha = ee.FeatureCollection('projects/pbl3project/assets/wardha_district');
var washim = ee.FeatureCollection('projects/pbl3project/assets/washim_district');
var yavatmal = ee.FeatureCollection('projects/pbl3project/assets/yavatmal_district');

function simplify(fc) {
  return fc.map(function(feature) {
    return feature.setGeometry(feature.geometry().simplify(2000));
  });
}
akola = simplify(akola);
amravati = simplify(amravati);
bhandara = simplify(bhandara);
buldhana = simplify(buldhana);
chandrapur = simplify(chandrapur);
gadchiroli = simplify(gadchiroli);
gondia = simplify(gondia);
nagpur = simplify(nagpur);
wardha = simplify(wardha);
washim = simplify(washim);
yavatmal = simplify(yavatmal);
var aoi = akola.merge(amravati)
               .merge(bhandara)
               .merge(buldhana)
               .merge(chandrapur)
               .merge(gadchiroli)
               .merge(gondia)
               .merge(nagpur)
               .merge(wardha)
               .merge(washim)
               .merge(yavatmal);
var aoi_simple = aoi.geometry();

// =========================
// 2. LST Calculation (2025)
// =========================
var landsat2025 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(aoi_simple)
  .filterDate('2025-03-01', '2025-05-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));
function calcLST(image) {
  var thermal = image.select('ST_B10').multiply(0.00341802).add(149.0);
  var lstC = thermal.subtract(273.15);
  return image.addBands(lstC.rename('LST'));
}
var lst2025 = landsat2025.map(calcLST).select('LST').median().clip(aoi_simple);

// =========================
// 3. PM2.5 Proxy/AOD Calculation (2025, MODIS)
// =========================
var aod2025 = ee.ImageCollection('MODIS/061/MYD08_M3')
  .filterBounds(aoi_simple)
  .filterDate('2025-03-01', '2025-05-31')
  .select('Aerosol_Optical_Depth_Land_Ocean_Mean_Mean')
  .mean()
  .clip(aoi_simple);

// =========================
// 4. Generate Random Sample Points & Sample LST/AOD
// =========================
var points = ee.FeatureCollection.randomPoints({
  region: aoi_simple,
  points: 500,           // You can change to 1000 for more data
  seed: 2025
});

// Stack images together, so each point gets LST and AOD
var stacked = lst2025.addBands(aod2025);

var samples = stacked.sampleRegions({
  collection: points,
  scale: 1000,            // MODIS is coarse; 1000m is fine for AOI-level study
  geometries: true        // keeps lat/lon in export
});

// =========================
// 5. Export CSV to Google Drive
// =========================
Export.table.toDrive({
  collection: samples,
  description: 'Vidarbha_Sample_LST_AOD_2025',
  fileFormat: 'CSV'
});
