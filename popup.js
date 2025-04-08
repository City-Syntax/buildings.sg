// 数据源：将不同的内容存储在一个对象中
const contentData = {
    data: `
        <h2>Data Introduction</h2>
        <p><strong>Singapore Building Archetypes: </strong>
        Singapore's buildings are categorized into residential and non-residential types, with seven Building Subtypes and 23 Building Archetypes, creating a comprehensive three-tier classification system.
        This classification framework is optimized for simulating building carbon emissions in Singapore.
        For detailed information about subtypes and archetypes, please refer to the Archetypes section of the map.
        </p>
        <p><strong>Embodied Carbon Simulation: </strong>
        Embodied carbon encompasses emissions from materials and construction throughout a building's lifecycle. While comprehensive life cycle assessments (LCA) consider multiple factors, this project focuses specifically on emissions from raw material extraction, transportation, manufacturing, and construction (stages A1-A5, known as "cradle to practical completion").
        Due to limited data availability and inherent uncertainties, we developed a probabilistic calculation methods. Results are therefore presented as probability distributions rather than single values, accurately reflecting uncertainty levels and enabling effective risk assessment.
        </p>
        <p><strong>Operational Carbon Simulation: </strong>
        Operational carbon represents emissions from a building's day-to-day energy use, including cooling, lighting, equipment, and heating systems. 
        Our approach uses Urban Building Energy Modeling (UBEM), a city-scale physics-based methodology that simulates energy performance across the built environment. This research-based analytical framework enables evaluation of multiple scenarios to identify effective carbon reduction strategies and promote energy efficiency.
        </p>
        <br>
        
        <h2>Data Dictionary</h2>
        <table>
            <thead style="background-color: #f0f0f0;">
                <tr>
                    <th>Features Name</th>
                    <th>Dataset Field Name</th>
                    <th>Description</th>
                    <th>Data Type</th>
                    <th>Data Source</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Building ID</td>
                    <td>id</td>
                    <td>Unique identifier for each building, formatted as 'relation/' or 'way/' followed by a 7-digit number.</td>
                    <td>Text</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Building Name</td>
                    <td>addr_housename</td>
                    <td>Official name of the building, which may sometimes match its address.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Address (Housenumber)</td>
                    <td>addr_housenumber</td>
                    <td>Building's street or unit number, usually appearing before the street name in the full address.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Address (Street)</td>
                    <td>addr_street</td>
                    <td>Official street or road name where the building is situated.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Postal Code</td>
                    <td>addr_postcode</td>
                    <td>Singapore postal code assigned to the building location.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Levels</td>
                    <td>building_levels</td>
                    <td>Total number of above-ground floors in the building, excluding basement levels.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/HDB*/Google Map</td>
                </tr>
                <tr>
                    <td>Building Archetype</td>
                    <td>building_archetype</td>
                    <td>Classification category from the 23 defined building archetypes, spanning both residential and non-residential uses.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/HDB*/BCA/Machine Learning</td>
                </tr>
                <tr>
                    <td>Machine Learning Predicted Archetype Probability</td>
                    <td>ml_probability</td>
                    <td>The probability that a building belongs to a specific archetype, as predicted by a random forest classification model, based on input data from buildings in Singapore with known archetypes.</td>
                    <td>Number</td>
                    <td>Machine Learning</td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td>height</td>
                    <td>Total vertical height of the building in meters, measured from ground level to the highest point.</td>
                    <td>Number</td>
                    <td>OpenStreetMap/HDB*</td>
                </tr>
                <tr>
                    <td>Building Footprint</td>
                    <td>building_footprint</td>
                    <td>Ground-level area covered by the building, calculated from its geometric polygon outline (m²).</td>
                    <td>Number</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Gross Floor Area</td>
                    <td>gross_floor_area</td>
                    <td>Total usable floor space in the building (m²), calculated or estimated based on footprint and number of floors.</td>
                    <td>Number</td>
                    <td>BCA/OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Built Year</td>
                    <td>built_year</td>
                    <td>Year of the building's original construction completion.</td>
                    <td>Text</td>
                    <td>HDB*/OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Data Source</td>
                    <td>data_source</td>
                    <td>Origin of the building data, with HDB and BCA sources specially marked for Mapbox layer filtering. Default: OpenStreetMap.</td>
                    <td>Text</td>
                    <td>HDB*/BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Rating</td>
                    <td>greenmark_rating</td>
                    <td>Building's sustainability performance rating under Singapore's Green Mark certification system.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Year of Award</td>
                    <td>greenmark_year</td>
                    <td>Year when the Green Mark certification was granted to the building.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Version</td>
                    <td>greenmark_version</td>
                    <td>Specific edition of the Green Mark assessment criteria used for the building's certification.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>AC Floor Area Percentage</td>
                    <td>aircon_area</td>
                    <td>Percentage of total floor area with air-conditioning, primarily relevant for non-residential buildings.</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Type of AC System</td>
                    <td>aircon_type</td>
                    <td>Specific air-conditioning technology deployed in the building (e.g., central, split, VRF).</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Average Monthly Building Occupancy Rate</td>
                    <td>occupancy</td>
                    <td>Average monthly occupant density measured in persons per square meter (P/sqm).</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2021 EUI</td>
                    <td>eui2021</td>
                    <td>Measured Energy Use Intensity for 2021, representing annual energy consumption per unit floor area (kWh/m²/year).</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2022 EUI</td>
                    <td>eui2022</td>
                    <td>Measured Energy Use Intensity (EUI) for 2022, representing annual energy consumption per unit floor area (kWh/m²/year).</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2023 EUI</td>
                    <td>eui2023</td>
                    <td>Measured Energy Use Intensity for 2023, representing annual energy consumption per unit floor area (kWh/m²/year).</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Total Dwelling Units</td>
                    <td>total_dwelling_units</td>
                    <td>Complete count of individual residential units within the building.</td>
                    <td>Number</td>
                    <td>HDB*</td>
                </tr>
                <tr>
                    <td>Total Embodied Carbon</td>
                    <td>embodied_carbon</td>
                    <td>Total carbon emissions associated with building materials and construction processes (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Cooling Carbon</td>
                    <td>energy_cooling</td>
                    <td>Carbon emissions resulting from energy used for space cooling and air conditioning (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Lighting Carbon</td>
                    <td>energy_lighting</td>
                    <td>Carbon emissions resulting from energy consumed for interior and exterior lighting (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Equipment Carbon</td>
                    <td>energy_equipment</td>
                    <td>Carbon emissions from energy used by appliances, office equipment, and other electrical devices (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Water Carbon</td>
                    <td>energy_water</td>
                    <td>Carbon emissions associated with energy used for water heating, pumping, and treatment systems (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Total End Use</td>
                    <td>energy_total</td>
                    <td>Aggregate carbon emissions from all operational energy consumption categories (kgCO₂).</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>

                <tr>
                    <td>Geometry Type</td>
                    <td>type</td>
                    <td>GeoJSON geometry classification, typically "Polygon" for simple buildings or "MultiPolygon" for more complex structures.</td>
                    <td>Text</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Geometry Coordinates</td>
                    <td>coordinates</td>
                    <td>Ordered array of geographic coordinates defining the building outline, with each point represented as [longitude, latitude].</td>
                    <td>Array</td>
                    <td>OpenStreetMap</td>
                </tr>
            </tbody>
        </table>
        <p>
        *Data for HDB buildings is derived from various data sources including HDB, OpenStreetMap, and the HDB dataset from the NUS Urban Analytics Lab.
        </p>
        <br>
        
        <h2>Data Download</h2>
    `,
    about: `
        <h2>About the Project</h2>
        <p>The <a href="#" class="link">Buildings.sg</a> is an interactive platform developed by <a href="https://www.citysyntax.io/" class="link">City Syntax Lab</a> at the <a href="https://nus.edu.sg/" class="link">National University of Singapore (NUS)</a>. It visualizes and analyzes the carbon emissions of buildings across Singapore, covering both operational and embodied carbon footprints. By integrating geographic data with building performance insights, the platform empowers policymakers, industry professionals, and the public to identify opportunities for carbon reduction. This tool supports Singapore's <a href="https://www.greenplan.gov.sg/" class="link">Green Plan 2030</a> by promoting energy-efficient designs, sustainable materials, and low-carbon construction practices, driving progress toward a more sustainable built environment.
        <br><br>The Map leverages the <a href="https://www.ubem.io/" class="link">Urban Building Energy Model (UBEM)</a> framework to assess and visualize the carbon emissions of buildings across Singapore. UBEM provides a simulation-based approach to model energy usage, carbon footprints, and environmental impacts of buildings on a city-wide scale, providing valuable insights for reducing emissions and improving energy efficiency in urban planning.</p>
        <div style="text-align: center; margin-top: 10px;">
            <a href="https://www.citysyntax.io/">
                <img src="logo/logo_nus_citysyntax.jpg" style="height: 40px; width: auto;">
            </a>
        </div>
        <br>
        
        <h2>Collaborators</h2>
        <p></p>
        <div style="text-align: center; margin-top: 20px; margin-bottom: 30px; display: flex; justify-content: center; gap: 50px;">
            <img src="logo/logo_ura.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(120%);">
            <img src="logo/logo_bca.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(120%);">
            <img src="logo/logo_hdb.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(100%) brightness(100%);">
            <img src="logo/logo_jtc.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(100%);">
        </div>
        <br>
        
        <h2>Disclaimer</h2>
        <p>Buildings.sg presents carbon emission data for informational purposes only. This information should not be used as the basis for legal, financial, or regulatory decisions. Despite our commitment to accuracy, we make no warranties regarding the precision, completeness, or reliability of this data. 
        Users should independently verify all information through official sources before taking any action based on this tool. The developers, contributors, and affiliated organizations expressly disclaim all liability for any consequences arising from the use of this tool.</p>
        <br>
        
        <h2>Publications</h2>
        <p>This section is currently under development.</p>
        `
};

// 获取 DOM 元素
const dataLink = document.getElementById('data-link');
const aboutLink = document.getElementById('about-link');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const popupText = document.getElementById('popup-text');
const downloadBtnGeoJson = document.getElementById("download-btn-geojson");
const downloadBtnIDF = document.getElementById("download-btn-idf");

// 点击链接时根据不同的参数显示对应的内容
function showPopup(type) {
    popupText.innerHTML = contentData[type] || "Content not found!";

    if (type === "data") {
        downloadBtnGeoJson.style.display = "inline-block";
        downloadBtnIDF.style.display = "inline-block";
    } else {
        downloadBtnGeoJson.style.display = "none";
        downloadBtnIDF.style.display = "none";
    }

    popup.style.display = 'block';
    overlay.style.display = 'block';
}

// 点击 'Data' 链接显示数据内容
dataLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup('data');
});

// 点击 'About' 链接显示关于内容
aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup('about');
});

// 点击关闭按钮隐藏弹出框
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
});

// 点击遮罩层隐藏弹出框
overlay.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
});

// GeoJSON 下载按钮功能
downloadBtnGeoJson.addEventListener("click", function () {
    fetch("data/sg_buildings_v3.geojson") 
        .then(response => response.blob()) 
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob); 
            link.download = "singapore_building_carbon_map202504.geojson"; 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
        })
        .catch(error => console.error("save failled:", error));
});

downloadBtnIDF.addEventListener("click", function () {
    fetch("data/singapore_building_IDF.zip") // 确保这里是你的 ZIP 文件路径
        .then(response => response.blob()) // 转换为 Blob
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob); // 生成 Blob URL
            link.download = "singapore_building_IDF.zip"; // 设置下载文件名
            document.body.appendChild(link); // 添加到 DOM
            link.click(); // 触发下载
            document.body.removeChild(link); // 移除 DOM 元素
        })
        .catch(error => console.error("save failled:", error));
});
