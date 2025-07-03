# Buildings.sg

![image](https://github.com/user-attachments/assets/3a21117b-211f-4bc8-8ef0-e101a984a903)

[Buildings.sg](https://buildings.sg) is an open, interactive platform developed by the [City Syntax Lab](https://www.citysyntax.io/) at the National University of Singapore (NUS) for **Urban Building Energy Modeling (UBEM)** and carbon emissions mapping in Singapore.

The platform combines spatial data with operational and embodied carbon simulations, supported by a full set of EnergyPlus templates for typical building archetypes in Singapore. Users can freely download and customize the (open-source) EnergyPlus templates for their simulations. The platform also enables users to visualize and analyze building-level carbon footprints, identifying opportunities for reduction.

[Buildings.sg](https://buildings.sg) supports Singapore’s Green Plan 2030 by promoting energy-efficient designs, sustainable materials, and low-carbon construction practices. The platform is designed to be scalable and adaptable, making it deployable in any city or municipality with available building and climate data.

## 📂 Project Structure

- **index.html** – The main entry point that loads and initializes the web application.
- **data/** – Contains GeoJSON files and spreadsheets used to generate charts and support data analysis.
- **download/** – Provides EnergyPlus IDF templates and map data files for users to download and use externally.
- **image/** – Holds images illustrating different building archetypes, used throughout the interface for better visualization.
- **logo/** – Includes icons and branding graphics displayed on the site.
- **mapbox copy.js, panel.js, popup.js** – Core JavaScript files managing the frontend behavior:
  - `mapbox copy.js`: initializes and styles the interactive map using Mapbox GL JS.
  - `panel.js`: handles user interface panels, controls, and filtering options.
  - `popup.js`: creates and displays informational popups `Data` and `About`.
 
## 🚀 Main Features

The platform offers a range of interactive tools designed to support urban-scale building performance analysis and decision-making:

- Multi-layer 3D visualization of building archetypes, embodied and operational carbon, and Green Mark attributes.  
- Filter by building archetype to explore detailed simulation methods, parameters, and results.  
- Click on individual buildings to view energy, carbon emissions, and key metrics.  
- Toggle displays for machine learning–derived parameters to explore various scenarios.  
- Download GeoJSON map data and EnergyPlus IDF templates for the selected archetypes to facilitate further simulation or analysis.
- Built with minimal dependencies and without reliance on complex frameworks, the platform is easy to edit, maintain, and scale for use in other regions.

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
- **Machine learning–predicted building archetypes** fill gaps where archetypes are missing from referenced sources.
- **Simulated embodied and operational carbon** metrics are modeled and attributed per building.

These datasets are merged into a unified GeoJSON format and visualized using **Mapbox GL JS**. Color-coded map layers primarily represent building archetype classifications, embodied and operational carbon metrics, along with selected government data such as EUI and Green Mark ratings.

The full dataset is available in `sg_buildings_v3.zip`. You can find it directly in the `/data` folder or download it via the Buildings.sg platform under **Data → Download → Download GEOJSON Files**.

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

## 💡 Example Usage

<img width="800" alt="image" src="https://github.com/user-attachments/assets/17bfe306-908a-47ba-b04f-2cfbbf0166ae" /><br>


Here is an example workflow demonstrating how to use Buildings.sg for urban energy and carbon analysis:

1. **Select study area**  
   Use the polygon selection tool on Buildings.sg to delineate your candidate study area. The tool displays outline information such as building counts by archetype, average Energy Use Intensity (EUI), and total carbon footprint.

2. **Export geometry**  
   Export the selected area as a Rhino 3D model from Cadmapper. Perform minor adjustments as needed.

3. **Complete missing attributes**  
   Inspect individual buildings directly on Buildings.sg to retrieve missing attributes, such as building levels or height.

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

Whether you are a policymaker, urban planner, or researcher, Buildings.sg provides an accessible, data-driven platform for analyzing building energy use, quantifying carbon emissions, evaluating reduction scenarios, and supporting sustainable urban development decisions.

