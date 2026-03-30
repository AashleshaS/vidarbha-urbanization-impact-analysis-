# Python Analysis & Visualization Notebooks

This directory contains the Jupyter Notebooks used to analyze the data exported from Google Earth Engine. These notebooks handle all statistical testing, LULC area calculations, and the generation of visual plots.

## 🚀 Prerequisites
These notebooks are written in Python 3. It is highly recommended to run them in [Google Colab](https://colab.research.google.com/) to easily mount Google Drive where the GEE exports are saved. 

Required libraries:
* `pandas`
* `rasterio`
* `numpy`
* `matplotlib`
* `seaborn`
* `scipy`

## 📄 File Descriptions

* **`vidharbha_research.ipynb`**
  This notebook focuses on the statistical analysis. It imports the spatially sampled `.csv` files containing LST and AOD values.
  * Cleans the data by dropping null values.
  * Generates scatter plots mapping LST against AOD.
  * Executes the **Spearman rank correlation** (`scipy.stats.spearmanr`) to quantify the relationship between heat and air pollution.
  * Executes **Kruskal-Wallis H tests** to determine the statistical significance of variations across different LULC classes.

* **`New codes.ipynb`**
  This notebook processes the exported LULC GeoTIFF arrays for spatial analysis and mapping.
  * Uses `rasterio` to open and read the satellite classification data.
  * Applies custom RGB color palettes to generate visual LULC maps.
  * Calculates pixel counts and converts them to real-world area (square kilometers) to track land cover transformation (e.g., deforestation and urban expansion) between 2005, 2015, and 2025.
