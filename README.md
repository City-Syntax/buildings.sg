# Buildings.sg

<img width="1920" height="1200" alt="platform1" src="https://github.com/user-attachments/assets/56349b70-5349-4b0b-b53a-119879239733" />

<p align="right">
  <a href="https://buildings.sg">Website</a> |
  <a href="https://city-syntax.github.io/buildings.sg/documentation.html">Documentation</a> |
  <a href="https://github.com/City-Syntax/buildings.sg">GitHub</a> |
  <a href="https://github.com/City-Syntax/buildings.city">Toolkit</a>
</p>

[Buildings.sg](https://buildings.sg) is an open, interactive platform developed by the [City Syntax Lab](https://www.citysyntax.io/) at the National University of Singapore (NUS) for **Urban Building Energy Modeling (UBEM)** and carbon emissions mapping in Singapore. The platform integrates spatial data with operational and embodied carbon simulations, supported by a comprehensive set of open-source EnergyPlus templates for typical building archetypes in Singapore. Users can download and customize these templates for detailed simulations. The platform supports Singapore’s Green Plan 2030 and is designed to be scalable for deployment in other regions with available building and climate data.

### Buildings.city

Buildings.city is a lightweight toolkit developed through Buildings.sg to help cities quickly build interactive Urban Building Energy Modeling (UBEM) platforms using their own building data. Through a simple configuration system and GeoJSON datasets, the package enables cities and researchers to visualize urban buildings, explore energy-related information, and communicate city-scale building data through an interactive map interface.

In addition to data visualization, the platform can support basic workflows for operational carbon and embodied carbon analysis by connecting user-provided datasets or simulation results. Buildings.city was initially developed as part of a research effort to lower the technical barrier for deploying urban energy platforms and can be adapted by cities and research teams using their own data. For implementation guidance, please refer to the Documentation or explore the Open-source Package.

### Building Archetypes
Singapore’s buildings are organized into seven Building Subtypes and 23 Building Archetypes, forming a three-tier classification optimized for UBEM and carbon assessment. Detailed descriptions are available in the Archetypes section of the platform.

### Operational Carbon Simulation
Operational carbon reflects emissions from day-to-day building energy use, including cooling, lighting, equipment, and heating. Buildings.sg adopts a city-scale shoebox-based UBEM workflow to evaluate multiple scenarios and identify effective carbon-reduction strategies.

### Embodied Carbon Simulation
Embodied carbon includes emissions from material extraction, transport, manufacturing, and construction (A1–A5). A probabilistic method is used to address uncertainties, with results presented as probability distributions for risk-informed decision-making.
<br><br>

## 📂 Project Structure

index.html          – Main entry point that loads and initializes the web application.  
documentation.html  – Documentation for project pipelines and user guidance.  
data/               – GeoJSON files and spreadsheets supporting charts and analysis.  
download/           – EnergyPlus IDF templates, DesignBuilder files, and map data.  
image/              – Illustration images for building archetypes.  
logo/               – Icons and branding graphics used across the site.  
benchmark.js        – Supports individual buildings energy benchmarking.
mapbox.js           – Initializes and styles the Mapbox GL JS 3D environment.  
panel.js            – Manages UI panels, controls, and filtering logic.  
popup.js            – Generates informational popups for Data and About sections.
<br><br>

## 🚀 Main Features

- Multi-layer 3D visualization of building archetypes, operational carbon, embodied carbon, and Green Mark attributes.  
- Archetype-based filtering to explore simulation methods, parameters, and results.  
- Interactive building-level information panels showing energy use, emissions, and key metrics.  
- Integration of Singapore’s Master Plan 2019 zoning with 3D land-use layers.  
- Toggle machine-learning–derived parameters to explore alternative scenarios.  
- Downloadable GeoJSON datasets and EnergyPlus IDF templates for external modeling.  
- Minimal dependencies and no complex frameworks, enabling easy maintenance and adaptation for other cities.
<br><br>

## 🧩 Version Information

**Platform Version:** 1.0  **Status:** Active  
**Building Dataset Version:** 5.0  **Last Updated:** 2025-11-15  

### Energy Simulation  
**Version:** 5.0  **Last Updated:** 2025-06-18  

### Embodied Carbon Simulation  
**Version:** 3.0  **Last Updated:** 2025-06-11  
<br><br>

## 🛠️ Running Locally

Download the entire code base and open `index.html` in a modern browser. Some browsers restrict local file access, so serving the project with a simple HTTP server can help:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000` in your browser.
<br><br>

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
<br>

## 🧾 EnergyPlus Templates

The `Data/Download` directory provides a set of files supporting building-level simulation, analysis, and data exploration. The content is organized into four main categories:

**EnergyPlus IDF templates**  
This section includes `.idf` files representing typical building archetypes in Singapore. Each template contains standardized assumptions for geometry, schedules, constructions, and systems, and is calibrated or validated against publicly available benchmarks.  
All archetypes are also available as a bundled archive (`AllArhcetypes_SGP_2025_V5.zip`) for batch use. These files can be directly used in EnergyPlus or adapted for customized simulation studies.

**DesignBuilder project files**  
DesignBuilder (`.dsb`) files are provided for selected archetypes to allow users to inspect model setup and continue simulation workflows in a graphical environment. These files reflect the same archetype logic as the IDF templates and can be modified for scenario testing or further calibration.

**Scorecard templates**  
Scorecard documents are provided for each building archetype to support structured documentation and evaluation of building performance. These templates can be used to record simulation inputs, results, and benchmarking metrics in a consistent format.

**GeoJSON dataset**  
A complete GeoJSON dataset (`sg_buildings_v5.zip`) is provided, containing building geometries and associated attributes across Singapore. The dataset can be used for visualization, spatial analysis, or integration with UBEM workflows and simulation pipelines.

---

The provided models can be integrated into simulation environments such as EnergyPlus, Rhino/Grasshopper (via Ladybug Tools and Honeybee), or other EnergyPlus-based tools including ClimateStudio and DesignBuilder. 

Simulations are typically initialized using Singapore EPW weather data (2001–2020), followed by archetype-level or batch analysis depending on the study scope.

<br>

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

