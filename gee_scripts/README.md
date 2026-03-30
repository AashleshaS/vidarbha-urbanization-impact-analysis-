# Google Earth Engine Extraction Scripts

This directory contains the JavaScript files used within the Google Earth Engine (GEE) Code Editor. These scripts handle the core data acquisition and processing: acquiring satellite imagery, applying necessary filters, performing machine learning classifications, and exporting the data for downstream Python analysis.

## 🚀 Prerequisites
To run these scripts, you must have an active [Google Earth Engine account](https://earthengine.google.com/) and access to the GEE Code Editor.

## 📄 File Descriptions

* **`01_aoi_setup.js`**
  Imports the 11 district-level vector boundaries representing the Vidarbha region. It applies a geometry simplification (`.simplify(2000)`) to optimize computational performance and merges the individual districts into a single cohesive Area of Interest (AOI).

* **`02_lst_landsat_export.js`**
  Derives Land Surface Temperature (LST) using USGS Landsat Collection 2 Tier 1 Level 2 products. 
  * Extracts data from Landsat 5 (2005), Landsat 8 (2015), and Landsat 9 (2025).
  * Applies cloud masking (<20% cloud cover) and converts thermal band digital numbers (DN) to Celsius.
  * Generates seasonal median composites.

* **`03_aod_modis_export.js`**
  Utilizes the MODIS Aqua Monthly Level 3 Global Atmosphere Product (`MYD08_M3`) to extract Aerosol Optical Depth (AOD) as a proxy for fine particulate matter (PM2.5) concentrations. It filters the imagery specifically for the pre-monsoon season (March 1 - May 31) to generate seasonal average AOD maps.

* **`LULC_Classification`**
  Executes a supervised Land Use and Land Cover (LULC) classification.
  * Defines six distinct environmental classes: Forest, Crop, Urban, Water, Barren, and Grassland.
  * Trains a Random Forest classifier (`ee.Classifier.smileRandomForest(50)`) using statically defined coordinate points.
  * Exports the final classified maps to Google Drive as GeoTIFF files for zonal analysis.

* **`Statistical_Analysis( DATA EXPORT)`**
  Handles the spatial sampling for statistical analysis. 
  * Stacks the processed LST and AOD images.
  * Generates 500 random sample points (`ee.FeatureCollection.randomPoints`) across the AOI for each study year.
  * Extracts the overlapping LST and AOD values at those specific coordinates and exports them to Google Drive as `.csv` files (e.g., `Vidarbha_Sample_LST_AOD_2025.csv`).
