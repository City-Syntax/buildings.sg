# Buildings.sg

![image](https://github.com/user-attachments/assets/f4796fe9-130e-4a80-882a-be38e5d13901)

[Buildings.sg](https://buildings.sg) is an open, interactive platform developed by the [City Syntax Lab](https://www.citysyntax.io/) at the National University of Singapore (NUS) for urban building energy modeling (UBEM) and carbon emissions mapping in Singapore.

The platform combines spatial data with operational and embodied carbon simulations, supported by a full set of EnergyPlus templates for typical building archetypes. It allows users to visualize and analyze building-level carbon footprints to identify opportunities for reduction.

[Buildings.sg](https://buildings.sg) supports Singapore’s Green Plan 2030 by promoting energy-efficient designs, sustainable materials, and low-carbon construction practices. You can also download simulation templates for further customization.

## 📂 Project Structure

- **index.html** – The main entry point that loads and initializes the web application.
- **data/** – Contains GeoJSON files and spreadsheets used to generate charts and support data analysis.
- **download/** – Provides EnergyPlus IDF templates and map data files for users to download and use externally.
- **image/** – Holds images illustrating different building archetypes, used throughout the interface for better visualization.
- **logo/** – Includes icons and branding graphics displayed on the site.
- **mapbox copy.js, panel.js, popup.js** – Core JavaScript files managing the frontend behavior:
  - `mapbox copy.js`: initializes and styles the interactive map using Mapbox GL JS.
  - `panel.js`: handles user interface panels, controls, and filtering options.
  - `popup.js`: creates and displays informational popups when map features are clicked.
 
## 🚀 Main Features

The platform offers a range of interactive tools designed to support urban-scale building performance analysis and decision-making:

- Multi-layer 3D visualization of building archetypes, embodied and operational carbon, and Green Mark attributes.  
- Filter by building archetype to explore detailed simulation methods, parameters, and results.  
- Click on individual buildings to view energy, carbon emissions, and key metrics.  
- Toggle displays for machine learning–derived parameters to explore various scenarios.  
- Download GeoJSON map data and EnergyPlus IDF templates for selected archetypes for further simulation or analysis.  

## 🛠️ Running Locally

Download entire code base and popen `index.html` in a modern browser. Some browsers restrict local file access, so serving the project with a simple HTTP server can help:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000` in your browser.

## 🗃️ Data Directory

The `data` directory includes example **GeoJSON** files containing building-level carbon emissions results. Additional field descriptions are provided in the spreadsheets under `data/Information`.

The `sg_buildings_v3.zip` archive contains the full dataset for Singapore, including building footprints, archetypes, and associated simulation outputs. Each feature corresponds to a single building with its geometry and detailed attributes. A sample entry is shown below:

```json
{
  "type": "Feature",
  "properties": {
    "id": "relation/1569296",
    "addr_housename": "None",
    "addr_housenumber": "30",
    "addr_street": "Jalan Lempeng",
    "addr_postcode": "128806",
    "building_levels": "7",
    "building_archetype": "non_ihl",
    "height": 22.4,
    "building_footprint": 7361.03,
    "gross_floor_area": 51527.21,
    "built_year": null,
    "data_source": null,
    "greenmark_rating": null,
    "greenmark_year": null,
    "greenmark_version": null,
    "aircon_area": null,
    "occupancy": null,
    "eui2020": null,
    "eui2021": null,
    "eui2022": null,
    "eui2023": null,
    "total_dwelling_units": null,
    "embodied_carbon": 31229202.89,
    "energy_cooling": 0.0,
    "energy_lighting": 117318.18,
    "energy_equipment": 61667.25,
    "energy_water": 17834.08,
    "energy_total": 196819.51,
    "aircon_system": null,
    "gui2023": null,
    "ml_probability": null
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[103.7611972, 1.3190274], [103.7611972, 1.3189724], [103.7612562, 1.3189322], ..., [103.7609566, 1.3193733]]]
  }
}
```

## 🧾 EnergyPlus Templates

The `Data/Download` directory provides `.idf` templates for use with EnergyPlus. Each file represents a common building archetype in Singapore:

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

These models can be imported into Rhino3D and Grasshopper for scenario customization using **Ladybug Tools**. The **Honeybee** and **Honeybee-Energy** plugins are used to assign constructions, internal loads, and HVAC systems based on the provided templates, while **Ladybug** handles climate integration and visualization. Initial calibration can be performed using Singapore’s EPW climate data (2001–2020), before proceeding to batch simulations or archetype-level performance analyses.

## 💡 Example Usage

<img width="483" alt="image" src="https://github.com/user-attachments/assets/ce9bcc82-e30f-4404-a4d5-7f28b6783fa4" />

Here is an example workflow demonstrating how to use Buildings.sg for urban energy and carbon analysis:

1. **Select study area**  
   Use the polygon selection tool on Buildings.sg to delineate your candidate study area. The tool displays outline information such as building counts by archetype, average Energy Use Intensity (EUI), and total carbon footprint.

2. **Export geometry**  
   Export the selected area as a Rhino 3D model from Cadmapper. Perform minor adjustments as needed.

3. **Complete missing attributes**  
   Inspect individual buildings directly on Buildings.sg to retrieve missing attributes like building levels or height.

4. **Download simulation templates**  
   Download the EnergyPlus IDF templates corresponding to the building archetypes in your study area.

5. **Set up simulation**  
   Replace default simulation models in Grasshopper with the building data from your study area. Verify meteorological files before running baseline energy simulations.

6. **Run scenarios**  
   Adjust parameters such as building envelope and occupancy conditions to develop multiple simulation scenarios.

7. **Calculate regional carbon metrics**  
   Aggregate simulation outputs using Python and Excel. Calculate total energy consumption and carbon emissions by weighting archetype-level Energy Use Intensity (EUI) with gross floor area (GFA), incorporating various end-use categories and photovoltaic (PV) savings as applicable.

8. **Visualize and interpret results**  
   Use Buildings.sg to analyze and visualize the spatial distribution of energy performance and carbon footprints, enabling data-driven insights and decision-making.
