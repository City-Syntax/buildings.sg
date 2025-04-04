// 数据源：将不同的内容存储在一个对象中
const contentData = {
    data: `
        <h2>Data Introduction</h2>
        <p><strong>Singapore Building Archetypes: </strong>
        Singapore's building types include residential and non-residential buildings, classified into seven Building Subtypes, which are further divided into 23 Building Archetypes, forming a three-tier classification system. 
        This categorization is specifically designed for building carbon emission simulations in Singapore. 
        Detailed descriptions of the subtypes and archetypes can be found in the Archetypes section of the map.
        </p>
        <p><strong>Embodied Carbon Simulation: </strong>
        Embodied carbon refers to the emissions associated with materials and construction processes throughout a building's life cycle. While more is considered in a full life cycle assessment (LCA), 
        the results in this project include only emissions associated with raw material extraction, material transportation, manufacturing and onsite construction activities (A1 to A5, termed "cradle to practical completion"). 
        Due to extreme data shortage and high uncertainty, emissions were calculated with a probabilistic method. Hence, results are presented in the form of probability distributions instead of single-point estimates to convey the level of uncertainty of the results and allow risk assessment.
        </p>
        <p><strong>Operational Carbon Simulation: </strong>
        Operational carbon refers to the emissions associated with a building's day-to-day operations, which includes energy consumption for cooling, lighting, electrical equipment, heating, etc. 
        Urban building energy modeling (UBEM) conducts bottom-up physics based energy modeling for buildings on a city-level. UBEM serves as an analytical tool to evaluate carbon emissions for an energy-efficient built environment through the evaluation of various scenarios.
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
                    <td>Unique identifier for a building, usually formatted as 'relation/' or 'way/' followed by a 7-digit number.</td>
                    <td>Text</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Building Name</td>
                    <td>addr_housename</td>
                    <td>Name of the building, sometimes the same as its address.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Address (Housenumber)</td>
                    <td>addr_housenumber</td>
                    <td>The building's unit or street number, typically followed by a road name.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Address (Street)</td>
                    <td>addr_street</td>
                    <td>Official street name where the building is located.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Postal Code</td>
                    <td>addr_postcode</td>
                    <td>Unique postal code for the building in Singapore.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Building Levels</td>
                    <td>building_levels</td>
                    <td>Number of floors in the building, excluding underground levels.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/HDB*/Google Map</td>
                </tr>
                <tr>
                    <td>Building Archetype</td>
                    <td>building_archetype</td>
                    <td>Detailed classification of building types, covering 23 residential and non-residential categories in Singapore.</td>
                    <td>Text</td>
                    <td>OpenStreetMap/HDB*/BCA</td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td>height</td>
                    <td>Physical height of the building, excluding minimum height considerations.</td>
                    <td>Number</td>
                    <td>OpenStreetMap/HDB*</td>
                </tr>
                <tr>
                    <td>Building Footprint</td>
                    <td>building_footprint</td>
                    <td>The ground coverage area of the building, derived from its polygon geometry.</td>
                    <td>Number</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Gross Floor Area</td>
                    <td>gross_floor_area</td>
                    <td>Total gross floor area (m²), partially estimated by multiplying the footprint by the number of floors.</td>
                    <td>Number</td>
                    <td>BCA/OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Built Year</td>
                    <td>built_year</td>
                    <td>Year when the building was constructed.</td>
                    <td>Text</td>
                    <td>HDB*/OpenStreetMap/BCA</td>
                </tr>
                <tr>
                    <td>Data Source</td>
                    <td>data_source</td>
                    <td>Specific sources such as HDB and BCA are marked for filtering in Mapbox layers. Default source: OpenStreetMap.</td>
                    <td>Text</td>
                    <td>HDB*/BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Rating</td>
                    <td>greenmark_rating</td>
                    <td>Certification rating under the Singapore Green Mark system.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Year of Award</td>
                    <td>greenmark_year</td>
                    <td>Year when the building received the Green Mark certification.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Green Mark Version</td>
                    <td>greenmark_version</td>
                    <td>Version of the Green Mark certification scheme used.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>AC Floor Area Percentage</td>
                    <td>aircon_area</td>
                    <td>Percentage of the total floor area that is air-conditioned, mainly for non-residential buildings.</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Type of AC System</td>
                    <td>aircon_type</td>
                    <td>Type of air-conditioning system used in the building.</td>
                    <td>Text</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Average Monthly Building Occupancy Rate</td>
                    <td>occupancy</td>
                    <td>Average occupancy rate (people density) of the building on a monthly basis (P/sqm).</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2021 EUI</td>
                    <td>eui2021</td>
                    <td>Measured Energy Use Intensity (EUI) of the building for 2021.</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2022 EUI</td>
                    <td>eui2022</td>
                    <td>Measured Energy Use Intensity (EUI) of the building for 2022.</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>2023 EUI</td>
                    <td>eui2023</td>
                    <td>Measured Energy Use Intensity (EUI) of the building for 2023.</td>
                    <td>Number</td>
                    <td>BCA</td>
                </tr>
                <tr>
                    <td>Total Dwelling Units</td>
                    <td>total_dwelling_units</td>
                    <td>Total number of residential units in the building.</td>
                    <td>Number</td>
                    <td>HDB*</td>
                </tr>
                <tr>
                    <td>Total Embodied Carbon</td>
                    <td>embodied_carbon</td>
                    <td>Total carbon footprint from materials and construction (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Cooling Carbon</td>
                    <td>energy_cooling</td>
                    <td>Carbon footprint from cooling energy consumption (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Lighting Carbon</td>
                    <td>energy_lighting</td>
                    <td>Carbon footprint from lighting energy consumption (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Equipment Carbon</td>
                    <td>energy_equipment</td>
                    <td>Carbon footprint from equipment energy consumption (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Water Carbon</td>
                    <td>energy_water</td>
                    <td>Carbon footprint from water-related energy consumption (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>
                <tr>
                    <td>Total End Use</td>
                    <td>energy_total</td>
                    <td>Total carbon footprint from energy end-use (kgCO₂)</td>
                    <td>Number</td>
                    <td>Simulation</td>
                </tr>

                <tr>
                    <td>Geometry Type</td>
                    <td>type</td>
                    <td>Type of geometric object, usually "Polygon" or "MultiPolygon."</td>
                    <td>Text</td>
                    <td>OpenStreetMap</td>
                </tr>
                <tr>
                    <td>Geometry Coordinates</td>
                    <td>coordinates</td>
                    <td>A 2D array representing the polygon's vertices, with latitude-longitude pairs forming a closed shape.</td>
                    <td>Array</td>
                    <td>OpenStreetMap</td>
                </tr>
            </tbody>
        </table>
        <p>
        * The data is sourced from the 3D city model of Singapore public housing (HDB) buildings dataset in CityJSON. 
        This integration was developed by the NUS Urban Analytics Lab, combining data from multiple sources, including HDB and OSM.
        Reference: Biljecki F (2020), <em>Exploration of open data in Southeast Asia to generate 3D building models</em>. ISPRS Annals, VI-4/W1-2020: 37-44. 
        DOI:10.5194/isprs-annals-vi-4-w1-2020-37-2020.
        </p>
        <br>
        
        <h2>Data Download</h2>
    `,
    about: `
        <h2>About the Project</h2>
        <p>The <a href="#" class="link">Singapore Building Carbon Map</a> is an interactive platform developed by <a href="https://www.citysyntax.io/" class="link">City Syntax Lab</a> at the <a href="https://nus.edu.sg/" class="link">National University of Singapore (NUS)</a>. It visualizes and analyzes the carbon emissions of buildings across Singapore, covering both operational and embodied carbon footprints. By integrating geographic data with building performance insights, the platform empowers policymakers, industry professionals, and the public to identify opportunities for carbon reduction. This tool supports Singapore’s <a href="https://www.greenplan.gov.sg/" class="link">Green Plan 2030</a> by promoting energy-efficient designs, sustainable materials, and low-carbon construction practices, driving progress toward a more sustainable built environment.
        <br><br>The Map leverages the <a href="https://www.ubem.io/" class="link">Urban Building Energy Model (UBEM)</a> framework to assess and visualize the carbon emissions of buildings across Singapore. UBEM provides a simulation-based approach to model energy usage, carbon footprints, and environmental impacts of buildings on a city-wide scale, providing valuable insights for reducing emissions and improving energy efficiency in urban planning.</p>
        <div style="text-align: center; margin-top: 10px;">
            <a href="https://www.citysyntax.io/">
                <img src="logo/logo_nus_citysyntax.jpg" style="height: 40px; width: auto;">
            </a>
        </div>
        <br>
        
        <h2>Partners</h2>
        <p></p>
        <div style="text-align: center; margin-top: 20px; margin-bottom: 30px; display: flex; justify-content: center; gap: 50px;">
            <img src="logo/logo_ura.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(120%);">
            <img src="logo/logo_bca.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(120%);">
            <img src="logo/logo_hdb.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(100%) brightness(100%);">
            <img src="logo/logo_jtc.png" style="height: 30px; width: auto; filter: grayscale(100%) contrast(170%) brightness(100%);">
        </div>
        <br>
        
        <h2>Disclaimer</h2>
        <p>The Singapore Building Carbon Map provides a general overview of carbon emissions associated with buildings across Singapore. The data presented is for informational purposes only and should not be relied upon for legal, financial, or regulatory decisions. While every effort has been made to ensure the accuracy and completeness of the information, no guarantees are made regarding the precision, timeliness, or completeness of the data. 
        Users are encouraged to verify the information through official channels before making any decisions based on this map. The developers and contributors are not liable for any loss or damages arising from the use of this map.</p>
        
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
    fetch("data/sg_buildings_v2.geojson") 
        .then(response => response.blob()) 
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob); 
            link.download = "singapore_building_carbon_map2025_v2.geojson"; 
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

