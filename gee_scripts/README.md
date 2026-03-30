# Google Earth Engine Extraction Scripts

This directory contains the JavaScript files used within the Google Earth Engine (GEE) Code Editor. These scripts are responsible for the heavy lifting: acquiring satellite imagery, applying necessary filters, performing machine learning classifications, and exporting the processed data for downstream Python analysis.

## 🚀 Prerequisites
To run these scripts, you must have an active [Google Earth Engine account](https://earthengine.google.com/) and access to the GEE Code Editor.

## 📄 File Descriptions

* **`01_aoi_setup.js`**
  Imports 11 district-level vector boundaries representing the Vidarbha region. It applies a geometry simplification (`.simplify(2000)`) to optimize computational performance and merges the districts into a single cohesive Area of Interest (AOI).

* **`02_lst_landsat_export.js`**
  Derives Land Surface Temperature (LST) using USGS Landsat Collection 2 Tier 1 Level 2 products. 
  * Extracts data from Landsat 5 (2005), Landsat 8 (2015), and Landsat 9 (2025).
  * Applies cloud masking (<20% cloud cover) and converts digital numbers (DN) to Celsius.
  * Generates seasonal median composites and exports random sample points as CSV files.

* **`03_aod_modis_export.js`**
  Utilizes the MODIS Aqua Monthly Level 3 Global Atmosphere Product (`MYD08_M3`) to extract Aerosol Optical Depth (AOD) as a proxy for PM2.5 concentrations. Filters imagery for the pre-monsoon season (March 1 - May 31) and exports the data.

* **`04_lulc_classification.js`**
  Executes a supervised Land Use and Land Cover (LULC) classification.
  * Defines six classes: Forest, Crop, Urban, Water, Barren, and Grassland.
  * Trains a Random Forest classifier (`ee.Classifier.smileRandomForest(50)`) using static coordinate points.
