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
// LST Calculation (2005, Landsat 5)
// =========================
var landsat2005 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterBounds(aoi_simple)
  .filterDate('2005-03-01', '2005-05-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));
function calcLST5(image) {
  var thermal = image.select('ST_B6').multiply(0.00341802).add(149.0);
  var lstC = thermal.subtract(273.15);
  return image.addBands(lstC.rename('LST'));
}
var lst2005 = landsat2005.map(calcLST5).select('LST').median().clip(aoi_simple);

// =========================
// PM2.5 Proxy (AOD, MODIS) 2005
// =========================
var aod2005 = ee.ImageCollection('MODIS/061/MYD08_M3')
  .filterBounds(aoi_simple)
  .filterDate('2005-03-01', '2005-05-31')
  .select('Aerosol_Optical_Depth_Land_Ocean_Mean_Mean')
  .mean()
  .clip(aoi_simple);

// =========================
// Sampling and Export
// =========================
var points2005 = ee.FeatureCollection.randomPoints({
  region: aoi_simple,
  points: 500,
  seed: 2005
});
var stacked2005 = lst2005.addBands(aod2005);
var samples2005 = stacked2005.sampleRegions({
  collection: points2005,
  scale: 1000,
  geometries: true
});
Export.table.toDrive({
  collection: samples2005,
  description: 'Vidarbha_Sample_LST_AOD_2005',
  fileFormat: 'CSV'
});

