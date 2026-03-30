# A Dual-Impact Analysis of Urbanization: Spatio-Temporal Effects on LST and PM2.5 in Vidarbha Region, Maharashtra, India

## 📌 Project Overview
This research investigates the influence of rapid urbanization in the Vidarbha region of Maharashtra, India, on land surface temperature (LST) and fine particulate air pollution (PM2.5, estimated based on Aerosol Optical Depth data) between the years 2005 and 2025. 

By combining satellite imagery derived from MODIS, Landsat, and Sentinel sensors, this project utilizes Google Earth Engine (GEE) and Python to analyze the spatio-temporal dynamics of urban heat and atmospheric pollution. The study employs Random Forest machine learning for Land Use and Land Cover (LULC) classification and utilizes statistical models to understand the complex interactions between expanding urban infrastructure, regional climate, and air quality.

## 🗺️ Study Area & Data Sources
The Area of Interest (AOI) covers the entire Vidarbha region in Maharashtra, comprising the following **11 districts**: 
*Akola, Amravati, Bhandara, Buldhana, Chandrapur, Gadchiroli, Gondia, Nagpur, Wardha, Washim, and Yavatmal.*

![Vidarbha (Area of Interest)](https://github.com/user-attachments/assets/8d45b4c1-83a3-46e9-bafc-a0f4b9de0f16)

**Data Sources:**
* **District Boundaries:** The regional boundary was constructed by merging 11 individual district shapefiles. [Original Shapefiles Sourced From: [https://www.cse.iitb.ac.in/~pocra/MahaCensus_shapefile_data1.2/MaharashtraCensus.html] ]
* **Thermal Data:** USGS Landsat 5, 8, and 9 (Collection 2, Tier 1, Level 2).
* **Air Quality Proxy (AOD):** MODIS Aqua Monthly Level 3 Global Atmosphere Product (MYD08_M3).
* **Optical Imagery (for LULC):** Landsat 5, Landsat 8, and Sentinel-2 SR Harmonized.

## 📊 Key Findings
* **Land Cover Transformation:** Over the 20-year period, there was a continuous loss of forested land (a decline of over 7,100 sq km) and a net expansion of urban/built-up land by over 800 sq km.
* **Regional Pollution Doubling:** Mean Aerosol Optical Depth (AOD) for the pre-monsoon season rose from 271.10 in 2005 to 551.67 in 2025, representing a greater than 100% increase in regional aerosol pollution.
* **The Urban Heat Island (UHI) Effect:** Surface temperatures increased locally, with "Urban" and "Crop" classes consistently ranking as the hottest land cover types. Conversely, "Forest" and "Water" classes consistently acted as cooling elements in the landscape.
* **Pollution Saturation by 2025:** By 2025, AOD levels became uniformly high across all land cover classes, indicating that regional air pollution had saturated the atmosphere beyond the filtering capacity of natural landscapes like forests.

## 💻 Tech Stack & Libraries
This project relies on cloud-computing platforms and data science libraries to process large-scale spatial datasets:
* **Cloud Platforms:** Google Earth Engine (GEE), Google Colab.
* **Languages:** JavaScript (GEE Code Editor), Python (Google Colab).
* **Machine Learning:** Random Forest (RF) algorithm (`ee.Classifier.smileRandomForest`).
* **Python Libraries:**
  * `pandas`: For data loading, manipulation, and summary tables.
  * `rasterio`: For reading and extracting data from exported GeoTIFF classification maps.
  * `numpy`: For handling raster arrays and pixel count calculations.
  * `matplotlib.pyplot`: For generating scatter plots and raster RGB map visualizations.
  * `seaborn`: For creating distribution boxplots.
  * `scipy.stats`: For executing core statistical computations.

## 📈 Statistical Analyses Performed
To ensure scientific rigor, specific statistical tests were applied to quantify the relationships between different environmental variables:

* **1. LST vs. PM2.5 (Correlation Analysis)**
  * **Test Used:** Spearman Rank Correlation (`scipy.stats.spearmanr`).
  * **Purpose:** To assess the strength and direction of the monotonic relationship between Land Surface Temperature and aerosol pollution across random spatial sample points for each year.
* **2. LULC vs. LST (Zonal Thermal Analysis)**
  * **Test Used:** Kruskal-Wallis H Test (`scipy.stats.kruskal`).
  * **Purpose:** To determine if the variations in surface temperature distributions across the six independent land cover classes (Forest, Crop, Urban, Water, Barren, Grassland) were statistically significant, proving the Urban Heat Island effect.
* **3. LULC vs. PM2.5 (Zonal Pollution Analysis)**
  * **Test Used:** Kruskal-Wallis H Test (`scipy.stats.kruskal`).
  * **Purpose:** To evaluate whether localized air pollution concentrations differ significantly depending on the underlying land cover type.

## 🔄 Methodology Flowchart

```mermaid
graph TD
    A[Define Area of Interest: Vidarbha] --> B(Acquire Satellite Data)
    B --> C{Google Earth Engine}
    C --> D[MODIS: Extract AOD/PM2.5 Proxy]
    C --> E[Landsat: Calculate LST]
    C --> F[Landsat/Sentinel: Random Forest LULC Classification]
    D --> G[Export CSV Data Points]
    E --> G
    F --> H[Export GeoTIFF Maps]
    G --> I{Python / Google Colab}
    H --> I
    I --> J[Zonal Analysis by LULC]
    I --> K[Statistical Correlation: Spearman]
    I --> L[Significance Testing: Kruskal-Wallis]
    J --> M[Final Results & Visualizations]
    K --> M
    L --> M
````

## 🗂️ Quick Links

*(Click the links below to read the detailed documentation for each project phase)*

  * 📂 **`gee_scripts/`** ➔ **[📖 Read the GEE Extraction Documentation](https://www.google.com/search?q=gee_scripts/README.md)**
    *(Contains the JavaScript codes for extracting LST, AOD, and LULC data)*
  * 📂 **`notebooks/`** ➔ **[📖 Read the Python Analysis Documentation](https://www.google.com/search?q=notebooks/README.md)**
    *(Contains the Jupyter Notebooks for statistical correlation and raster visualization)*

<!-- end list -->


