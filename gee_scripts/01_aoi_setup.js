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
