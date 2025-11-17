# Buildings.sg

## 📦 Quick Access

<div style="padding:16px; background:#f2f7ff; border-left:6px solid #3b82f6; margin-bottom:12px;">
  <strong>Buildings.sg</strong><br>
  Access the live platform for urban energy and carbon analysis.<br>
  🔗 <a href="http://buildings.sg/">http://buildings.sg/</a>
</div>

<div style="padding:16px; background:#f0fdfa; border-left:6px solid #14b8a6; margin-bottom:12px;">
  <strong>Buildings.sg Documentation</strong><br>
  Read the full pipelines, simulation workflows, and methods.<br>
  🔗 <a href="https://city-syntax.github.io/buildings.sg/documentation.html">Documentation</a>
</div>

<div style="padding:16px; background:#fef6e4; border-left:6px solid #f59e0b;">
  <strong>GitHub Repository</strong><br>
  Explore the source code, datasets, and EnergyPlus templates.<br>
  🔗 <a href="https://github.com/City-Syntax/buildings.sg/tree/main">GitHub Repo</a>
</div>


<img width="1920" height="1200" alt="platform1" src="https://github.com/user-attachments/assets/56349b70-5349-4b0b-b53a-119879239733" />

[Buildings.sg](https://buildings.sg) is an open, interactive platform developed by the [City Syntax Lab](https://www.citysyntax.io/) at the National University of Singapore (NUS) for **Urban Building Energy Modeling (UBEM)** and carbon emissions mapping in Singapore. The platform integrates spatial data with operational and embodied carbon simulations, supported by a comprehensive set of open-source EnergyPlus templates for typical building archetypes in Singapore. Users can download and customize these templates for detailed simulations. The platform supports Singapore’s Green Plan 2030 and is designed to be scalable for deployment in other regions with available building and climate data.

### Building Archetypes
Singapore’s buildings are organized into seven Building Subtypes and 23 Building Archetypes, forming a three-tier classification optimized for UBEM and carbon assessment. Detailed descriptions are available in the Archetypes section of the platform.

### Operational Carbon Simulation
Operational carbon reflects emissions from day-to-day building energy use, including cooling, lighting, equipment, and heating. Buildings.sg adopts a city-scale shoebox-based UBEM workflow to evaluate multiple scenarios and identify effective carbon-reduction strategies.

### Embodied Carbon Simulation
Embodied carbon includes emissions from material extraction, transport, manufacturing, and construction (A1–A5). A probabilistic method is used to address uncertainties, with results presented as probability distributions for risk-informed decision-making.

## 📂 Project Structure

index.html          – Main entry point that loads and initializes the web application.  
documentation.html  – Documentation for project pipelines and user guidance.  
data/               – GeoJSON files and spreadsheets supporting charts and analysis.  
download/           – EnergyPlus IDF templates, DesignBuilder files, and map data.  
image/              – Illustration images for building archetypes.  
logo/               – Icons and branding graphics used across the site.  
mapbox.js           – Initializes and styles the Mapbox GL JS 3D environment.  
panel.js            – Manages UI panels, controls, and filtering logic.  
popup.js            – Generates informational popups for Data and About sections.

## 🚀 Main Features

- Multi-layer 3D visualization of building archetypes, operational carbon, embodied carbon, and Green Mark attributes.  
- Archetype-based filtering to explore simulation methods, parameters, and results.  
- Interactive building-level information panels showing energy use, emissions, and key metrics.  
- Integration of Singapore’s Master Plan 2019 zoning with 3D land-use layers.  
- Toggle machine-learning–derived parameters to explore alternative scenarios.  
- Downloadable GeoJSON datasets and EnergyPlus IDF templates for external modeling.  
- Minimal dependencies and no complex frameworks, enabling easy maintenance and adaptation for other cities.

## 🧩 Version Information

**Platform Version:** 5.0  
**Release Date:** 2025-11-15  
**Status:** Active  

### Energy Simulation  
**Version:** 5.0  **Last Updated:** 2025-06-18  

### Embodied Carbon Simulation  
**Version:** 3.0  **Last Updated:** 2025-06-11  

## 🛠️ Running Locally

Download the entire code base and open `index.html` in a modern browser. Some browsers restrict local file access, so serving the project with a simple HTTP server can help:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000` in your browser.

## 🧱 Data Backbone

[Buildings.sg](https://buildings.sg) is powered by an integrated urban-scale to building-level dataset covering the entire territory of Singapore. The dataset combines multiple sources:

- **OpenStreetMap (OSM)** provides the core building footprints and heights that serve as the spatial foundation for all other data.
- **Housing and Development Board (HDB)** and **Building and Construction Authority (BCA)** contribute public housing details and Green Mark certification data.
- **Urban Redevelopment Authority (URA)** provides Master Plan 2019 land‑use zoning data for interactive exploration of permitted uses and planning annotations.
- **Machine learning–predicted building archetypes** fill gaps where archetypes are missing from referenced sources.
- **Simulated embodied and operational carbon** metrics are modeled and attributed per building.

These datasets are merged into a unified GeoJSON format and visualized using **Mapbox GL JS**. Color-coded map layers primarily represent building archetype classifications, embodied and operational carbon metrics, along with selected government data such as EUI and Green Mark ratings.

The full dataset is available in `sg_buildings_v5.zip`. You can find it directly in the `/data` folder or download it via the Buildings.sg platform under **Data → Download → Download GEOJSON Files**.

Each feature corresponds to a single building with its geometry and detailed attributes. A sample entry is shown below:

```json
{
  "type": "Feature",
  "properties": {
    "id": "relation/1569296",
    "addr_housenumber": "30",
    "addr_street": "Jalan Lempeng",
    "addr_postcode": "128806",
    "building_levels": "7",
    "building_archetype": "non_ihl",
    "height": 22.4,
    "building_footprint": 7361.03,
    "gross_floor_area": 51527.21,
    ...
    "greenmark_rating": null,
    ...
    "embodied_carbon": 31229202.89,
    "energy_total": 196819.51,
    ...
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [...]
  }
}
```

## 🧾 EnergyPlus Templates

The `Data/Download` directory provides `.idf` templates for use with EnergyPlus. Each file represents a common building archetype in Singapore, with the parameter set sourced and contextualized for the relevant buildings. The archetype templates are either calibrated or validated against benchmark data published by the authorities:

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

A ZIP archive `AllArhcetypes_SGP_2025_V5.zip` collects all templates. These files include typical schedules, constructions, and system assumptions reflecting Singapore's 2025 building stock. You can modify them or plug them directly into EnergyPlus for your own analyses.

These models can be imported into Rhino3D and Grasshopper for scenario customization using tools like Ladybug Tools, which includes Honeybee and Honeybee-Energy for assigning constructions, internal loads, and HVAC systems, along with Ladybug for climate integration and visualization. Alternatively, the provided EnergyPlus templates can be used directly in any software that supports the EnergyPlus engine, such as ClimateStudio, DesignBuilder, or custom simulation workflows. Initial calibration can be performed using Singapore’s EPW climate data (2001–2020), before proceeding to batch simulations or archetype-level performance analyses.

## 💡 Usage Pipeline

You can find complete details on how Buildings.sg is developed and operated in the **official documentation**.

### Operational Carbon Simulation
For a step-by-step guide to EnergyPlus-based UBEM workflows, visit:  
https://city-syntax.github.io/buildings.sg/documentation.html#energy

### Embodied Carbon Simulation
To explore the probabilistic embodied-carbon workflow, visit:  
https://city-syntax.github.io/buildings.sg/documentation.html#carbon  
or download the tutorial slide deck:  
https://github.com/City-Syntax/buildings.sg/blob/main/download/Rhino%20%26%20Grasshopper%20Tutorial.pptx

