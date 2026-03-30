# Python Analysis & Visualization Notebooks

This directory contains the Jupyter Notebooks used to analyze the data exported from Google Earth Engine. These notebooks handle all statistical testing, LULC area calculations, and the generation of visual plots.

### 1. `01_correlation_analysis_lst_pm25_lulc.ipynb`
**Purpose:** Conducts a multi-year statistical study (2005, 2015, 2025) to identify how urbanization and land cover changes influence surface heat and air pollution.

* **Statistical Correlation:** Calculates **Spearman Rank Correlation** coefficients to measure the strength and direction of the relationship between Land Surface Temperature (LST) and AOD (PM2.5 proxy).
* **LULC vs. LST Analysis:** * Categorizes temperature data across different land classes (e.g., Forest, Agriculture, Urban).
    * Identifies which land cover types exhibit the highest thermal signatures (Surface Urban Heat Island effect).
    * Generates mean, median, and standard deviation of temperatures for each specific LULC category to track heating trends.
* **LULC vs. PM2.5 Analysis:**
    * Analyzes how particulate matter concentration varies between natural vegetation (Forest) and anthropogenic areas (Urban/Industrial).
    * Assesses whether specific land uses act as "sinks" or "sources" for atmospheric aerosols.
* **Temporal Trend Tracking:** Compares these relationships across three decades to visualize how environmental degradation scales with land-use change.
* **Data Visualization:** Produces scatter plots with regression lines and categorical boxplots showing the distribution of environmental variables by LULC class.

### 2. `02_raster_processing_maps.ipynb`
**Purpose:** Processes spatial GeoTIFF data to generate high-resolution environmental maps and regional statistics.

* **Geospatial Processing:** Utilizes `rasterio` and `numpy` to handle large-scale satellite raster layers exported from Google Earth Engine.
* **Heatmap Generation:** Creates professional-grade spatial visualizations of LST across the Vidarbha region using scientific colormaps (e.g., `inferno`).
* **Spatial Statistics:** * Calculates area-wide metrics including the 1st, 25th, 50th, 75th, and 99th percentiles for temperature.
    * Computes regional standard deviation to measure thermal variance within the study area.
* **Masking & Cleaning:** Handles "NoData" values and performs coordinate transformations to ensure the spatial accuracy of the maps.
* **Comparative Visualization:** Sets up the framework to visually overlay LULC maps with thermal maps to identify "hotspots" in the landscape.
