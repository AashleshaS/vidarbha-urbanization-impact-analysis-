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

// Simplify district geometries to avoid edge errors
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

Map.setCenter(79.0, 20.5, 8);

// ============================================================
// MODIS MONTHLY LEVEL 3 AOD (MYD08_M3) - 2005, 2015, 2025
// ============================================================

// Visualization: orange palette, semi-transparent
var modisAODVis = {
  min: 0,
  max: 1,
  palette: ['white', 'yellow', 'orange', 'darkorange', 'red'],
  opacity: 0.7
};

// Helper function for getting the seasonal (March–May) mean
function modisAOD(year) {
  return ee.ImageCollection('MODIS/061/MYD08_M3')
    .filterBounds(aoi_simple)
    .filterDate(year + '-03-01', year + '-05-31')
    .select('Aerosol_Optical_Depth_Land_Ocean_Mean_Mean')
    .mean()
    .clip(aoi_simple);
}

// ---- 2005 ----
var aod_2005 = modisAOD('2005');
Map.addLayer(aod_2005, modisAODVis, 'MODIS AOD (PM2.5 Proxy) 2005');
print('2005 MODIS AOD ready');

// ---- 2015 ----
var aod_2015 = modisAOD('2015');
Map.addLayer(aod_2015, modisAODVis, 'MODIS AOD (PM2.5 Proxy) 2015');
print('2015 MODIS AOD ready');

// ---- 2025 ----
var aod_2025 = modisAOD('2025');
Map.addLayer(aod_2025, modisAODVis, 'MODIS AOD (PM2.5 Proxy) 2025');
print('2025 MODIS AOD ready');

// ==== Summary statistics: Mean, Min, Max ====
function getStats(image, label) {
  var stats = image.reduceRegion({
    reducer: ee.Reducer.mean().combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
    geometry: aoi_simple,
    scale: 1000,
    maxPixels: 1e9
  });
  print(label + ' MODIS AOD AOI Stats:', stats);
}

getStats(aod_2005, '2005');
getStats(aod_2015, '2015');
getStats(aod_2025, '2025');

//EXPORTING TO GOOGLE DRIVE

// === EXPORT 2025 AOD ===
Export.image.toDrive({
  image: aod_2025,
  description: 'Vidarbha_AOD_2025',
  scale: 1000, // MODIS resolution is ~1km
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// === EXPORT 2015 AOD ===
Export.image.toDrive({
  image: aod_2015,
  description: 'Vidarbha_AOD_2015',
  scale: 1000,
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// === EXPORT 2005 AOD ===
Export.image.toDrive({
  image: aod_2005,
  description: 'Vidarbha_AOD_2005',
  scale: 1000,
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

