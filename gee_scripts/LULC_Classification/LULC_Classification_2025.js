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

Map.setCenter(79.0, 20.5, 8);

// === AOI visualization ===
var empty = ee.Image().byte();
var filled = empty.paint({
  featureCollection: ee.FeatureCollection([ee.Feature(aoi_simple)]),
  color: 1
});
Map.addLayer(filled, {palette: ['FF0000'], opacity: 0.2}, 'Vidarbha Area');
var outline = empty.paint({
  featureCollection: ee.FeatureCollection([ee.Feature(aoi_simple)]),
  color: 1,
  width: 3
});
Map.addLayer(outline, {palette: ['FF0000']}, 'Vidarbha Boundary');

// ====================================
// 2) LULC TRAINING POINTS (30 per class, example-coords)
// ====================================
// Replace these example points for best accuracy

function makeFeatureList(classId, coords) {
  return coords.map(function(c) {
    return ee.Feature(ee.Geometry.Point(c), {'class': classId});
  });
}

// Dummy example coordinates (replace with real sample locations)
var forest_coords = [
  [79.95, 21.30],[80.10, 20.80],[79.60, 21.05],[79.45, 21.25],[80.00, 20.75],
  [79.86, 20.91],[79.67, 21.19],[80.22, 21.07],[79.89, 20.95],[80.12, 21.10],
  [79.57, 21.27],[80.07, 20.61],[80.18, 21.11],[79.84, 21.22],[79.90, 20.76],
  [79.65, 21.12],[79.78, 21.08],[79.92, 21.03],[80.24, 20.85],[80.33, 21.01],
  [79.49, 20.97],[80.13, 21.15],[79.75, 21.13],[80.16, 21.20],[80.08, 20.69],
  [79.80, 21.14],[80.17, 20.79],[79.73, 21.11],[80.09, 20.93],[80.25, 21.05]
];
var crop_coords = [
  [78.75, 20.85],[78.90, 21.00],[79.20, 20.70],[79.60, 20.95],[78.95, 20.65],
  [79.32, 20.88],[78.98, 21.02],[79.12, 20.78],[79.41, 21.05],[78.88, 20.91],
  [79.23, 20.63],[79.37, 20.99],[79.04, 20.80],[79.55, 21.01],[78.87, 21.11],
  [79.45, 20.72],[79.30, 21.09],[79.16, 20.92],[79.28, 20.86],[79.33, 21.14],
  [79.47, 20.83],[78.91, 20.97],[79.06, 21.10],[79.31, 20.77],[79.25, 20.89],
  [79.17, 21.08],[78.99, 20.94],[79.11, 20.76],[79.56, 21.06],[79.22, 20.93]
];
var urban_coords = [
  [79.08, 21.15],[77.75, 20.70],[78.11, 20.93],[79.17, 21.28],[77.99, 20.69],
  [79.02, 21.18],[78.95, 21.11],[79.32, 20.70],[79.10, 21.14],[78.98, 21.24],
  [79.23, 20.79],[79.31, 21.01],[78.78, 21.08],[79.04, 20.99],[79.16, 20.82],
  [79.44, 21.19],[78.91, 21.06],[79.07, 20.86],[79.21, 21.22],[78.99, 21.08],
  [79.09, 20.97],[79.30, 21.17],[78.97, 20.88],[79.26, 21.25],[79.18, 20.93],
  [79.05, 21.04],[78.84, 20.81],[79.15, 20.98],[78.92, 21.15],[79.29, 20.90]
];
var water_coords = [
  [79.23, 21.05],[77.90, 20.71],[80.18, 20.47],[79.83, 20.30],[80.30, 21.00],
  [79.50, 20.90],[80.05, 21.10],[78.92, 20.70],[79.18, 21.19],[80.08, 20.82],
  [79.27, 20.95],[80.21, 20.62],[79.42, 20.85],[79.69, 21.11],[80.15, 20.55],
  [79.87, 20.97],[80.28, 21.14],[78.98, 21.01],[79.25, 20.72],[79.15, 21.13],
  [80.11, 20.76],[78.91, 21.07],[79.36, 21.15],[79.94, 20.81],[80.18, 21.00],
  [79.66, 20.97],[80.13, 20.84],[79.54, 21.18],[80.09, 20.67],[79.80, 21.14]
];
var barren_coords = [
  [79.30, 20.40],[79.45, 20.55],[78.80, 21.18],[78.56, 20.37],[80.09, 21.23],
  [79.65, 20.88],[79.92, 21.06],[80.22, 21.17],[79.81, 20.98],[80.14, 20.61],
  [79.60, 21.19],[78.99, 20.92],[79.10, 21.15],[78.85, 20.90],[79.50, 21.12],
  [80.00, 21.08],[78.91, 20.78],[79.78, 20.63],[80.26, 21.03],[79.45, 20.92],
  [79.20, 21.04],[80.08, 20.95],[78.84, 21.21],[79.16, 20.51],[79.37, 21.11],
  [78.97, 20.67],[80.19, 20.73],[79.12, 21.10],[79.61, 20.70],[80.15, 21.12]
];
var grassland_coords = [
  [79.15, 21.00],[78.70, 21.00],[79.70, 20.90],[78.86, 20.77],[79.02, 21.13],
  [78.92, 20.95],[79.32, 21.09],[79.50, 21.18],[78.97, 21.03],[79.11, 20.79],
  [79.56, 21.13],[78.87, 21.01],[78.79, 21.19],[79.60, 20.99],[78.99, 20.80],
  [79.04, 21.20],[79.22, 21.17],[78.94, 20.97],[79.27, 21.21],[79.68, 20.69],
  [78.74, 21.18],[79.31, 20.94],[79.05, 21.09],[79.40, 20.86],[78.91, 21.15],
  [79.18, 20.97],[78.93, 21.10],[79.17, 20.92],[79.41, 21.03],[78.84, 21.13]
];

var forest = ee.FeatureCollection(makeFeatureList(0, forest_coords));
var crop = ee.FeatureCollection(makeFeatureList(1, crop_coords));
var urban = ee.FeatureCollection(makeFeatureList(2, urban_coords));
var water = ee.FeatureCollection(makeFeatureList(3, water_coords));
var barren = ee.FeatureCollection(makeFeatureList(4, barren_coords));
var grassland = ee.FeatureCollection(makeFeatureList(5, grassland_coords));

var trainingPoints = forest
                      .merge(crop)
                      .merge(urban)
                      .merge(water)
                      .merge(barren)
                      .merge(grassland);

Map.addLayer(forest, {color: '228B22'}, 'Forest LULC Samples');
Map.addLayer(crop, {color: 'FFD700'}, 'Cropland/Agriculture Samples');
Map.addLayer(urban, {color: '808080'}, 'Urban/Built-up Samples');
Map.addLayer(water, {color: '1E90FF'}, 'Water Bodies Samples');
Map.addLayer(barren, {color: 'D2B48C'}, 'Barren/Soil Samples');
Map.addLayer(grassland, {color: '7CFC00'}, 'Grassland/Scrubland Samples');

// ===============================
// 3) SENTINEL-2 SR HARMONIZED IMAGE CLIP (2025)
// ===============================
var bands25 = ['B2','B3','B4','B8'];
var image25_full = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi_simple)
  .filterDate('2025-03-01', '2025-05-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median();
var image25 = image25_full.select(bands25);

Map.addLayer(image25_full.clip(aoi_simple), {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Sentinel-2 RGB 2025 (clipped)');

// ===============================
// 4) RANDOM FOREST TRAIN, CLASSIFY, EXPORT
// ===============================

// 1. Sample S2 bands onto training points
var training25 = image25.sampleRegions({
  collection: trainingPoints,
  properties: ['class'],
  scale: 10
});

// 2. Train Random Forest classifier
var classifier25 = ee.Classifier.smileRandomForest(50).train({
  features: training25,
  classProperty: 'class',
  inputProperties: bands25
});

// 3. Classify AOI
var lulc25 = image25.clip(aoi_simple).classify(classifier25);

// 4. Visualize classified LULC map
Map.addLayer(lulc25, {
  min: 0, max: 5,
  palette: ['228B22', 'FFD700', '808080', '1E90FF', 'D2B48C', '7CFC00']
}, 'LULC Classified 2025 (RF)');

// 5. Export classified map to Google Drive
Export.image.toDrive({
  image: lulc25,
  description: 'LULC_RF_classified_2025',
  scale: 60,
  region: aoi_simple,
  fileFormat: 'GeoTIFF',
  maxPixels: 2e9
});
