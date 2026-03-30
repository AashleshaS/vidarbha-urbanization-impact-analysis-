// ============================================================
// VIDARBHA REGION - AOI + LST WITH SIMPLIFIED GEOMETRY
// ============================================================

// Import all 11 Vidarbha districts from assets
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

// Simplify each district geometry individually
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

// Merge simplified districts into one AOI
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

// Get simplified geometry from merged AOI
var aoi_simple = aoi.geometry();

// Center map
Map.setCenter(79.0, 20.5, 8);

// Draw filled AOI (transparent)
var empty = ee.Image().byte();
var filled = empty.paint({
  featureCollection: ee.FeatureCollection([ee.Feature(aoi_simple)]),
  color: 1
});
Map.addLayer(filled, {palette: ['FF0000'], opacity: 0.2}, 'Vidarbha Area');

// Draw boundary
var outline = empty.paint({
  featureCollection: ee.FeatureCollection([ee.Feature(aoi_simple)]),
  color: 1,
  width: 3
});
Map.addLayer(outline, {palette: ['FF0000']}, 'Vidarbha Boundary');

print('✅ Vidarbha AOI created successfully!');
print('AOI variable is ready for analysis');

// Visualization parameters for transparent LST overlay
var lstVis = {
  min: 20,
  max: 45,
  palette: ['0000FF', '00FFFF', '00FF00', 'FFFF00', 'FF8000', 'FF0000'],
  opacity: 0.6
};

// === LST 2025 (Landsat 9) ===
var landsat2025 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(aoi_simple)
  .filterDate('2025-03-01', '2025-05-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));

function calculateLST(image) {
  var thermal = image.select('ST_B10').multiply(0.00341802).add(149.0);
  var lstCelsius = thermal.subtract(273.15);
  return image.addBands(lstCelsius.rename('LST'));
}
var landsatWithLST2025 = landsat2025.map(calculateLST);
var lst2025 = landsatWithLST2025.select('LST').median().clip(aoi_simple);
Map.addLayer(lst2025, lstVis, 'LST 2025 (°C) - Transparent');
print('✅ Step 2 COMPLETE: Transparent LST heat map displayed over Vidarbha AOI.');

// === LST 2015 (Landsat 8) ===
var landsat2015 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(aoi_simple)
  .filterDate('2015-03-01', '2015-05-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));

function calculateLST_L8(image) {
  var thermal = image.select('ST_B10').multiply(0.00341802).add(149.0);
  var lstCelsius = thermal.subtract(273.15);
  return image.addBands(lstCelsius.rename('LST'));
}
var landsatWithLST2015 = landsat2015.map(calculateLST_L8);
var lst2015 = landsatWithLST2015.select('LST').median().clip(aoi_simple);
Map.addLayer(lst2015, lstVis, 'LST 2015 (°C) - Transparent');
print('✅ Step 3 COMPLETE: Transparent LST heat map displayed for 2015.');

// === LST 2005 (Landsat 5) ===
var landsat2005 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterBounds(aoi_simple)
  .filterDate('2005-03-01', '2005-05-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));

function calculateLST_L5(image) {
  var thermal = image.select('ST_B6').multiply(0.00341802).add(149.0);
  var lstCelsius = thermal.subtract(273.15);
  return image.addBands(lstCelsius.rename('LST'));
}
var landsatWithLST2005 = landsat2005.map(calculateLST_L5);
var lst2005 = landsatWithLST2005.select('LST').median().clip(aoi_simple);
Map.addLayer(lst2005, lstVis, 'LST 2005 (°C) - Transparent');
print('✅ Step 4 COMPLETE: Transparent LST heat map displayed for 2005.');


// === STATISTICS for each year LST ===
var stats_lst2025 = lst2025.reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.minMax(),
    sharedInputs: true
  }),
  geometry: aoi_simple,
  scale: 1000,
  maxPixels: 1e9
});
print('LST 2025 AOI Stats:', stats_lst2025);

var stats_lst2015 = lst2015.reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.minMax(),
    sharedInputs: true
  }),
  geometry: aoi_simple,
  scale: 1000,
  maxPixels: 1e9
});
print('LST 2015 AOI Stats:', stats_lst2015);

var stats_lst2005 = lst2005.reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.minMax(),
    sharedInputs: true
  }),
  geometry: aoi_simple,
  scale: 1000,
  maxPixels: 1e9
});
print('LST 2005 AOI Stats:', stats_lst2005);

//EXPORT TO GOOGLE DRIVE 

// === EXPORT 2025 LST ===
Export.image.toDrive({
  image: lst2025,
  description: 'Vidarbha_LST_2025',
  scale: 30, // Landsat resolution
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// === EXPORT 2015 LST ===
Export.image.toDrive({
  image: lst2015,
  description: 'Vidarbha_LST_2015',
  scale: 30,
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// === EXPORT 2005 LST ===
Export.image.toDrive({
  image: lst2005,
  description: 'Vidarbha_LST_2005',
  scale: 30,
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});
