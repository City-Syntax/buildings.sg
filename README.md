# Buildings.sg

Buildings.sg is a web-based viewer for building carbon information in Singapore. The project combines spatial data, operational and embodied carbon calculations and a set of EnergyPlus templates for typical building archetypes. It can be used to explore carbon performance across the island or to download templates for your own simulations.

## Project structure

- **index.html** – entry point of the web application.
- **data/** – JSON datasets and spreadsheets used to generate charts.
- **download/** – EnergyPlus IDF templates and map data for download.
- **image/** – images representing building archetypes.
- **logo/** – icons used by the site.
- **mapbox copy.js, panel.js, popup.js** – JavaScript controlling the map and UI.

## Running locally

Open `index.html` in a modern browser. Some browsers restrict local file access, so serving the project with a simple HTTP server can help:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000` in your browser.

## Data directory

The `data` directory contains JSON files with example carbon results. Spreadsheets with additional details are also provided.

## EnergyPlus templates

The `download` directory provides `.idf` templates for use with EnergyPlus. Each file represents a common building archetype in Singapore:

```
01_HDB_SGP_2025_V5.idf           12_NonIHL_SGP_2025_V5.idf
02_SFH_SGP_2025_V5.idf           13_IndustrialB1_SGP_2025_V5.idf
03_MFH_SGP_2025_V5.idf           14_IndustrialB2_SGP_2025_V5.idf
04_Hotel_SGP_2025_V5.idf         15_DataCentre_SGP_2025_V5.idf
05_Retail_SGP_2025_V5.idf        16_CivicCommunity_Cultural_SGP_2025_V5.idf
06_Office_SGP_2025_V5.idf        17_SportsRec_SGP_2025_V5.idf
07_BusinessPark_SGP_2025_V5.idf  18_Restaurant_SGP_2025_V5.idf
08_Hospital_SGP_2025_V5.idf      19_HawkerCentre_SGP_2025_V5.idf
09_Polyclinic_SGP_2025_V5.idf    20_Supermarket_SGP_2025_V5.idf
```

A ZIP archive `AllArhcetypes_SGP_2025_V5.zip` collects all templates. These files include typical schedules, constructions and system assumptions reflecting Singapore's 2025 building stock. You can modify them or plug them directly into EnergyPlus for your own analyses.

The `sg_buildings_v3.zip` archive contains the GeoJSON building geometry used by the viewer.

## License

No explicit license file is provided. Assume all rights reserved unless specified otherwise.

