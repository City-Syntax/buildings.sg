mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eXN5bnRheGxhYiIsImEiOiJjbTRqaGRpdTMwYjJlMmtwdTNoMmVpdzB6In0.KcpHKxiukuiLN_LMwIHjoA';

// 初始化地图
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/citysyntaxlab/cm57lssiu006301po77yqb3r7',
    attributionControl: true,
    dragRotate: true,
    center: [103.825, 1.282],
    zoom: 13.4,
    maxBounds: [
        [103.6, 1.2],
        [104.1, 1.5]
    ],
    pitch: 50,
    bearing: 20
});

// 禁用双击放大
map.doubleClickZoom.disable();

// Geocoding控件
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: {
        color: '#333',
        scale: 0.8,
        draggable: false
    },
    placeholder: 'Search for buildings...'
});
map.addControl(geocoder, 'bottom-right');

// 导航控件
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// Draw控件
var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});
map.addControl(draw, 'top-right');

document.querySelector('.mapboxgl-ctrl-top-right').style.top = "46px";

// 加载地图和layers着色
map.on('load', () => {
    console.log('Map is fully loaded!');

    const attributionElement = document.querySelector('.mapboxgl-ctrl-attrib');
    if (attributionElement) {
        // 在 Attribution 最前面插入你的组织信息
        attributionElement.insertAdjacentHTML('afterbegin', '<a href="https://www.citysyntax.io/" target="_blank">© City Syntax Lab &nbsp;</a>');
    }

    // 2D视图控件
    document.getElementById('toggle2D').addEventListener('click', () => {
        map.easeTo({
            pitch: 0,
            zoom: map.getZoom(),
            duration: 1000
        });

        setTimeout(() => { console.log('New pitch:', map.getPitch()); }, 1100);
    });

    // 添加数据源（更新）
    map.addSource('buildings_all', {
        type: 'vector',
        url: 'mapbox://citysyntaxlab.2iuh8ory'
    });

    // 建筑 archetype 图层
    map.addLayer({
        "id": "sg-buildings-3d",
        "type": "fill-extrusion",
        "source": "buildings_all",
        "source-layer": "sg_buildings-0g14da",
        "layout": {
            "fill-extrusion-edge-radius": 0.5
        },
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": [
                "interpolate", ["linear"], ["get", "height"],
                0, 3,
                280, 280
            ],
            "fill-extrusion-color": [
                "match", ["get", "building_archetype"],
                ["hdb"], "#1abc9c",
                ["landed_property"], "#2ecc71",
                ["hotel", "shophouse"], "#9b59b6",
                ["ihl", "non_ihl"], "#e67e22",
                ["clinic", "hospital", "nursing_home"], "#f1c40f",
                ["mixed_development", "retail", "office", "business_park"], "#34495e",
                ["industrial"], "#e74c3c",
                ["supermarket", "community_cultural", "sports", "data_centre", "restaurant", "hawker_centre"], "#95a5a6",
                ["private_apartment"], "#3498db",
                "#ffffff"
            ],
            "fill-extrusion-flood-light-intensity": 0,
            "fill-extrusion-ambient-occlusion-intensity": 0,
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "filter": ['==', ['get', 'ml_probability'], null]
    });

    // Embodied Carbon 图层
    map.addLayer({
        "id": "buildings-embodied-carbon",
        "type": "fill-extrusion",
        "source": "buildings_all",
        "source-layer": "sg_buildings-0g14da",
        "layout": {
            "fill-extrusion-edge-radius": 0.5
        },
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": [
                "interpolate", ["linear"], ["get", "height"],
                0, 3,
                280, 280
            ],
            "fill-extrusion-color": [
                "interpolate", ["linear"], ["get", "embodied_carbon"],
                0, "#2bf3a9",
                50000, "#2bf3a9",
                1000000, "#0fb89f",
                10000000, "#275fa0",
                20000000, "#df80e0",
                50000000, "#f0004c"
            ],
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "filter": ['==', ['get', 'ml_probability'], null]
    });

    // Operational Carbon 图层
    map.addLayer({
        "id": "buildings-operational-carbon",
        "type": "fill-extrusion",
        "source": "buildings_all",
        "source-layer": "sg_buildings-0g14da",
        "layout": {
            "fill-extrusion-edge-radius": 0.5
        },
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": [
                "interpolate", ["linear"], ["get", "height"],
                0, 3,
                280, 280
            ],
            "fill-extrusion-color": [
                "interpolate", ["linear"], ["get", "energy_total"],
                0, "#0d9c6c",
                5000, "#0d9c6c",
                50000, "#57f46c",
                500000, "#f5ed0f",
                5000000, "#f56b0f"
            ],
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "filter": ['==', ['get', 'ml_probability'], null]
    });

    // 添加bca-buildings-gfa着色图层
    map.addLayer({
        "layout": { "fill-extrusion-edge-radius": 0.5 },
        "filter": ["match", ["get", "data_source"], ["bca"], true, false],
        "type": "fill-extrusion",
        "source": "mapbox://citysyntaxlab.2iuh8ory",
        "id": "bca-buildings-gfa",
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": ["interpolate", ["linear"], ["get", "height"], 0, 3, 280, 280],
            "fill-extrusion-color": ["interpolate", ["linear"], ["get", "gross_floor_area"], 800, "#572323", 20000, "#e07410", 100000, "#faef14", 200000, "#b8ea5d"],
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "slot": "",
        "source-layer": "sg_buildings-0g14da"
    });

    // 添加bca-buildings-eui着色图层
    map.addLayer({
        "layout": { "fill-extrusion-edge-radius": 0.5, "visibility": "none" },
        "filter": ["match", ["get", "data_source"], ["bca"], true, false],
        "type": "fill-extrusion",
        "source": "mapbox://citysyntaxlab.2iuh8ory",
        "id": "bca-buildings-eui",
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": ["interpolate", ["linear"], ["get", "height"], 0, 3, 280, 280],
            "fill-extrusion-color": ["interpolate", ["linear"], ["get", "eui2020"], 10, "#5cfe2f", 300, "#146aff", 600, "#ef14ff"],
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "slot": "",
        "source-layer": "sg_buildings-0g14da"
    });

    // 添加bca-buildings-gm着色图层
    map.addLayer({
        "layout": { "fill-extrusion-edge-radius": 0.5, "visibility": "none" },
        "filter": ["match", ["get", "data_source"], ["bca"], true, false],
        "type": "fill-extrusion",
        "source": "mapbox://citysyntaxlab.2iuh8ory",
        "id": "bca-buildings-gm",
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": ["interpolate", ["linear"], ["get", "height"], 0, 3, 280, 280],
            "fill-extrusion-color": ["match", ["get", "greenmark_rating"],
                ["GoldPlus"], "#fff457", ["Gold"], "#d6ff33", ["Platinum"], "#7eff3d",
                ["Legislated"], "#00ff62", ["Certified"], "#0affb1", "#999999"],
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "slot": "",
        "source-layer": "sg_buildings-0g14da"
    });

    toggleLayer('type');

    // 添加建筑物 3D 图层（白色）
    map.addLayer({
        "id": "sg-buildings-3d-white",
        "type": "fill-extrusion",
        "source": "buildings_all",
        "source-layer": "sg_buildings-0g14da",
        "layout": {
            "fill-extrusion-edge-radius": 0.5,
            "visibility": "none" // 初始隐藏
        },
        "minzoom": 10,
        "maxzoom": 20,
        "paint": {
            "fill-extrusion-height": [
                "interpolate", ["linear"], ["get", "height"],
                0, 3,
                280, 280
            ],
            "fill-extrusion-color": "#f0f0f0",
            "fill-extrusion-opacity": 0.7,
            "fill-extrusion-flood-light-ground-attenuation": 0.7
        },
        "filter": ['==', ['get', 'ml_probability'], null]
    });

    // 添加 Master Plan 2019 数据源和图层
    map.addSource('masterplan2019', {
        type: 'vector',
        url: 'mapbox://citysyntaxlab.4gxilw4j'
    });

    map.addLayer({
        "id": "masterplan2019",
        "type": "fill",
        "source": "masterplan2019",
        "source-layer": "output-47r2yb",
        "layout": {
            "visibility": "none" // 初始隐藏
        },
        "minzoom": 10,
        "maxzoom": 20,
        "filter": ["match", ["geometry-type"], ["Polygon"], true, false],
        "paint": {
            "fill-color": [
                "case",
                ["match", ["get", "LU_DESC"], ["BUSINESS PARK", "BUSINESS 1", "BUSINESS 2"], true, false], "hsl(27, 98%, 56%)",
                ["match", ["get", "LU_DESC"], ["COMMERCIAL", "COMMERCIAL / INSTITUTION"], true, false], "#00b4d8",
                ["match", ["get", "LU_DESC"], ["SPORTS & RECREATION"], true, false], "hsl(339, 93%, 57%)",
                ["match", ["get", "LU_DESC"], ["HOTEL"], true, false], "hsl(355, 78%, 56%)",
                ["match", ["get", "LU_DESC"], ["CIVIC & COMMUNITY INSTITUTION", "PLACE OF WORSHIP", "UTILITY"], true, false], "hsl(273, 46%, 38%)",
                ["match", ["get", "LU_DESC"], ["COMMERCIAL & RESIDENTIAL", "RESIDENTIAL WITH COMMERCIAL AT 1ST STOREY"], true, false], "hsl(43, 82%, 63%)",
                ["match", ["get", "LU_DESC"], ["HEALTH & MEDICAL CARE"], true, false], "hsl(152, 69%, 60%)",
                ["match", ["get", "LU_DESC"], ["OPEN SPACE", "PARK", "BEACH AREA", "RESERVE SITE"], true, false], "hsl(173, 70%, 40%)",
                ["match", ["get", "LU_DESC"], ["EDUCATIONAL INSTITUTION"], true, false], "hsl(273, 63%, 80%)",
                ["match", ["get", "LU_DESC"], ["RESIDENTIAL / INSTITUTION", "RESIDENTIAL"], true, false], "hsl(60, 80.60%, 85.90%)",
                ["match", ["get", "LU_DESC"], ["TRANSPORT FACILITIES", "PORT / AIRPORT"], true, false], "#457b9d",
                ["match", ["get", "LU_DESC"], ["WHITE", "BUSINESS PARK - WHITE", "BUSINESS 1 - WHITE", "BUSINESS 2 - WHITE"], true, false], "hsl(210, 0%, 100%)",
                ["match", ["get", "LU_DESC"], ["ROAD", "MASS RAPID TRANSIT", "LIGHT RAPID TRANSIT"], true, false], "hsl(208, 12%, 86%)",
                ["match", ["get", "LU_DESC"], ["WATERBODY"], true, false], "hsl(181, 94%, 78%)",
                "#212529"
            ],
            "fill-opacity": 1
        }
    });

    const masterplanElements = document.querySelectorAll('.legend-container.masterplan, .introduce-masterplan');
    const masterplanBtn = document.getElementById('ura-link');

    // 需要隐藏的面板类
    const panelsToHide = [
        '.result-panel',
        '.legend-container-bca',
        '.legend-container.type',
        '.legend-container.carbon',
        '.legend-container.energy'
    ];

    // 所有 nav-link
    const navLinks = document.querySelectorAll('.nav-link, #ura-link');

    function hidePanels() {
        panelsToHide.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.dataset.prevDisplay = el.style.display || ''; // 记录原来的display
                el.style.display = 'none';
            });
        });
    }

    function restorePanels() {
        panelsToHide.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.dataset.prevDisplay !== undefined) {
                    el.style.display = el.dataset.prevDisplay;
                    delete el.dataset.prevDisplay;
                } else {
                    el.style.display = '';
                }
            });
        });
    }

    // 点击 Master Plan
    masterplanBtn.addEventListener('click', e => {
        e.preventDefault();
        if (masterplanBtn.classList.contains('active')) return;

        // 移除所有nav-link active状态
        navLinks.forEach(link => link.classList.remove('active'));
        // 激活 Master Plan 按钮
        masterplanBtn.classList.add('active');

        // 隐藏除 Master Plan 外的所有非底图图层
        map.getStyle().layers.forEach(layer => {
            if (
                layer.id !== 'sg-buildings-3d-white' &&
                layer.id !== 'masterplan2019' &&
                !layer.id.includes('background') &&
                !layer.id.includes('water')
            ) {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
            }
        });

        // 显示 Master Plan 图层
        map.setLayoutProperty('sg-buildings-3d-white', 'visibility', 'visible');
        map.setLayoutProperty('masterplan2019', 'visibility', 'visible');

        // 显示 Master Plan 图例
        masterplanElements.forEach(el => el.style.display = 'block');

        // 隐藏其他面板
        hidePanels();
    });

    // 绑定其他按钮退出 Master Plan 模式
    const otherButtons = [
        'type-link',
        'carbon-link',
        'energy-link',
        'bca-link'
    ];

    otherButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('click', e => {
            e.preventDefault();

            // 移除 Master Plan active
            masterplanBtn.classList.remove('active');

            // 给当前按钮加 active
            navLinks.forEach(link => link.classList.remove('active'));
            btn.classList.add('active');

            // 隐藏 Master Plan 图层和图例
            if (map.getLayer('sg-buildings-3d-white')) {
                map.setLayoutProperty('sg-buildings-3d-white', 'visibility', 'none');
            }
            if (map.getLayer('masterplan2019')) {
                map.setLayoutProperty('masterplan2019', 'visibility', 'none');
            }
            masterplanElements.forEach(el => el.style.display = 'none');

            // 恢复面板
            restorePanels();
        });
    });

    // 弹窗逻辑
    map.on('click', 'masterplan2019', (e) => {
        const props = e.features[0].properties;
        const gpr = props['GPR'] || 'NA';
        const lu_desc = props['LU_DESC'] || 'NA';
        const name = props['Name'] || 'NA';

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h3>Land Use Info</h3>
                <p>Name: ${name}<br/>
                GPR: ${gpr}<br/>
                LU_DESC: ${lu_desc}<p>
                `)
            .addTo(map);

        console.log(`Popup shown for: ${name}`);
    });

    // 设置统一开关（假设 checkbox ID 是 buildingTypeToggle） 
    const toggleML = document.getElementById('buildingTypeToggle');
    toggleML.addEventListener('change', function () {
        const mllayers = [
            "sg-buildings-3d",
            "buildings-embodied-carbon",
            "buildings-operational-carbon"
        ];
        const filter = toggleML.checked ? null : ['==', ['get', 'ml_probability'], null];
        mllayers.forEach(id => map.setFilter(id, filter));
    });

    // 默认隐藏所有图层和building info弹出框
    const layers = [
        'sg-buildings-3d',
        'buildings-operational-carbon',
        'buildings-embodied-carbon',
        'bca-buildings-gm',
        'bca-buildings-eui',
        'bca-buildings-gfa'
    ];

    // 确保图层位于最上层
    layers.forEach(layer => map.moveLayer('sg-buildings-3d'));

    // 存储当前的 Popup 实例，防止重复弹出
    let currentPopup = null;

    // 鼠标悬停时改变指针
    map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });

    // 鼠标离开时恢复指针
    map.on('mouseleave', () => {
        map.getCanvas().style.cursor = '';
    });

    // 绑定点击事件（只绑定一次）
    map.on('click', (e) => {
        // 获取点击位置上的可见特征，并确保只选择最上层的一个
        const features = map.queryRenderedFeatures(e.point, { layers });

        if (features.length === 0) {
            if (currentPopup) {
                currentPopup.remove(); // 移除已有的 Popup
                currentPopup = null;
            }
            return;
        }

        const feature = features[0]; // 只取最上层的一个
        const featureId = feature.id;
        const properties = feature.properties;

        // 清除之前的点击状态
        if (map.clickedFeatureId !== undefined) {
            map.setFeatureState(
                { source: 'sg_buildings-0g14da', id: map.clickedFeatureId },
                { clicked: false }
            );
        }

        // 设置当前建筑为点击状态
        map.setFeatureState(
            { source: 'sg_buildings-0g14da', id: featureId },
            { clicked: true }
        );

        map.clickedFeatureId = featureId;

        // 过滤有效信息
        const validEntries = Object.entries({
            "Building Name": properties['addr_housename'],
            "Postal Code": properties['addr_postcode'],
            "Building Address": [properties['addr_housenumber'], properties['addr_street']].filter(v => v && v !== "None" && v !== "0").join(" "),
            "Building Archetype": properties['building_archetype'],
            "ML Archetype Probability": properties['ml_probability'] ? `${(properties['ml_probability'] * 100).toPrecision(2)}%` : null,
            "Building Levels": properties['building_levels'],
            "Building Footprint": properties['building_footprint'] ? `${properties['building_footprint']} m²` : null,
            "Gross Floor Area": properties['gross_floor_area'] ? `${properties['gross_floor_area']} m²` : null,
            "EUI (BCA)": properties['eui2023'] ? `${properties['eui2023']} kWh/m²` : null,
            "Embodied Carbon": properties['embodied_carbon'] ? `${(properties['embodied_carbon'] / 100).toPrecision(5)}*10² kgCO2e` : null,
            "Operational Energy": properties['energy_total'] ? `${(properties['energy_total'] / 10000).toPrecision(5)}*10⁴ kgCO2e` : null,
            "Greenmark Rating": properties['greenmark_rating'],
            "Greenmark Year of Award": properties['greenmark_year'],
            "Greenmark Version": properties['greenmark_version']
        }).filter(([key, value]) => value && value !== "None" && value !== "0");

        if (validEntries.length > 0) {
            const popupHTML = `
                <h3>Building Information</h3>
                <p>${validEntries.map(([key, value]) => `${key}: ${value}`).join("<br>")}</p>
            `;

            // 先移除旧的 Popup
            if (currentPopup) {
                currentPopup.remove();
            }

            // 创建新的 Popup
            currentPopup = new mapboxgl.Popup({ className: 'custom-popup' })
                .setLngLat(e.lngLat)
                .setHTML(popupHTML)
                .addTo(map);
        }
    });

    // 绘制单独绑定事件
    map.on('draw.create', UserDraw);
    map.on('draw.delete', UserDraw);
    map.on('draw.update', UserDraw);

    // 监听绘制事件，显示 .calculation-box
    map.on('draw.create', function (e) {
        console.log('Polygon created', e);
        draw.changeMode('simple_select');
        calculationBox.style.display = 'block';
    });

    map.on('dblclick', function () {
        draw.changeMode('simple_select');  // 强制切换到选择模式
        console.log('Draw is done');
        calculationBox.style.display = 'block'; // 显示计算框
    });

    // 页面开始进度条
    window.mapLoaded = true;
    updateProgress(50);
    checkAllLoaded();
});

const subtypesMapping = {
    publicHousing: ["hdb"],
    privateHousing: ["landed_property", "private_apartment"],
    otherDwelling: ["shophouse", "hotel"],
    commercial: ["retail", "mixed_development", "office", "business_park"],
    healthcare: ["hospital", "clinic", "nursing_home"],
    educational: ["ihl", "non_ihl"],
    industrial: ["industrial"],
    others: ["data_centre", "community_cultural", "sports", "restaurant", "hawker_centre", "supermarket"]
};

const archetypesMapping = {
    "HDB PPVC": "hdb_ppvc",
    "HDB non-PPVC": "hdb",
    "Landed property": "landed_property",
    "Private apartment & condo": "private_apartment",
    "Shophouse": "shophouse",
    "Hotel": "hotel",
    "Retail": "retail",
    "Mixed development": "mixed_development",
    "Office": "office",
    "Business Park": "business_park",
    "Hospital": "hospital",
    "Clinic": "clinic",
    "Nursing home": "nursing_home",
    "Inst. of higher learning (IHL)": "ihl",
    "Non-IHL": "non_ihl",
    "B1": "industrial",
    "B2": "industrial",
    "Data centre": "data_centre",
    "Civic, community & cultural inst.": "community_cultural",
    "Sports & recreation": "sports",
    "Restaurant": "restaurant",
    "Hawker centre": "hawker_centre",
    "Supermarket": "supermarket"
};

// 图层映射
const layerVisibilityMap = {
    carbon: 'buildings-embodied-carbon',
    energy: 'buildings-operational-carbon',
    type: 'sg-buildings-3d',
    gfa: 'bca-buildings-gfa',
    eui: 'bca-buildings-eui',
    gm: 'bca-buildings-gm'
};

// 记录当前活跃的图层
let activeLayer = null;
let currentSubtype = null;

function updateMapFilter() {
    if (!map.isStyleLoaded()) {
        console.warn("Map style is not fully loaded yet.");
        return;
    }

    if (!activeLayer || !layerVisibilityMap[activeLayer] || !map.getLayer(layerVisibilityMap[activeLayer])) {
        console.warn(`Layer ${activeLayer} does not exist.`);
        return;
    }

    const subtypeUI = document.getElementById("subtype").value;
    const archetypeUI = document.getElementById("archetype").value;

    let filters = ["all"];

    if (subtypeUI && subtypesMapping[subtypeUI]) {
        filters.push(["in", ["get", "building_archetype"], ["literal", subtypesMapping[subtypeUI]]]);
        currentSubtype = subtypeUI;
    } else {
        currentSubtype = null;
    }

    if (archetypeUI && archetypesMapping[archetypeUI]) {
        filters.push(["==", ["get", "building_archetype"], archetypesMapping[archetypeUI]]);
    }

    console.log("Applying filter to:", layerVisibilityMap[activeLayer], "Filters:", filters);
    map.setFilter(layerVisibilityMap[activeLayer], filters);
}

// 控制图层显示
function toggleLayer(newLayer) {
    if (activeLayer !== newLayer) {
        const bcaButtons = document.querySelectorAll('.buttons-container button');
        const isActive = Array.from(bcaButtons).some(button => button.classList.contains('active'));

        // 切换图层并重置过滤
        if (isActive) {
            bcaButtons.forEach(button => button.classList.remove('active'));
        }

        Object.entries(layerVisibilityMap).forEach(([key, layer]) => {
            const visibility = (key === newLayer) ? 'visible' : 'none';
            map.setLayoutProperty(layer, 'visibility', visibility);
        });

        activeLayer = newLayer; // 更新 activeLayer 为 newLayer
        console.log('Show legend for:', newLayer); // 调试输出
        showLegend(newLayer);  // 显示对应的图例
        updateMapFilter(); // 重新应用筛选
    }
}

// 显示图例
function showLegend(newLayer) {
    console.log('Trying to show legend for:', newLayer);

    // 只隐藏其他图例，不清除所有图例
    const legendToShow = document.querySelector(`.legend-container.${newLayer}`);
    if (legendToShow) {
        // 只对当前图层的图例进行显示
        legendToShow.classList.add('active', 'show');
    }

    // 如果存在其他图例，不需要清除所有，只清除不显示的
    const otherLegends = document.querySelectorAll('.legend-container');
    otherLegends.forEach(container => {
        if (!container.classList.contains(newLayer)) {
            container.classList.remove('active', 'show');
        }
    });
}

/*
// 显示图例
function showLegend(newLayer) {
    console.log('Trying to show legend for:', newLayer);

    const legendContainers = document.querySelectorAll('.legend-container');
    legendContainers.forEach(container => {
        container.classList.remove('active', 'show');
    });

    const legendToShow = document.querySelector(`.legend-container.${newLayer}`);
    const layerId = layerVisibilityMap[newLayer];
    const layerVisibility = map.getLayoutProperty(layerId, 'visibility');

    if (layerVisibility === 'visible' && legendToShow) {
        legendToShow.classList.add('active', 'show');
    }
}
*/

// 绑定事件
document.getElementById("type-link").addEventListener("click", function (event) {
    updateMapFilter(); // 重新应用筛选
    toggleLayer('type');
});

document.getElementById("carbon-link").addEventListener("click", function (event) {
    updateMapFilter(); // 重新应用筛选
    toggleLayer('carbon');
});

document.getElementById("energy-link").addEventListener("click", function (event) {
    updateMapFilter(); // 重新应用筛选
    toggleLayer('energy');
});

// 监听选择变化
document.getElementById("subtype").addEventListener("change", updateMapFilter);
document.getElementById("archetype").addEventListener("change", updateMapFilter);

// 清除按钮
document.querySelector(".clear-btn").addEventListener("click", function () {
    document.getElementById("subtype").value = "";
    document.getElementById("archetype").value = "";
    updateMapFilter();  // 清除筛选
});

function showLayerGroup(groupName) {
    const layers = {
        'bca-buildings-gfa': ['bca-buildings-gfa'],
        'bca-buildings-eui': ['bca-buildings-eui'],
        'bca-buildings-gm': ['bca-buildings-gm'],
        'buildings-embodied-carbon': ['buildings-embodied-carbon'],
        'buildings-operational-carbon': ['buildings-operational-carbon'],
        'sg-buildings-3d': ['sg-buildings-3d']
    };

    const allLayerNames = Object.values(layers).flat();
    const bcaButtons = document.querySelectorAll('.buttons-container button');
    const bcaContents = document.querySelectorAll('.legend-content');
    const legendContainers = document.querySelectorAll('.legend-container'); // 获取所有 legend-container
    const legendContainerBCA = document.querySelector('.legend-container-bca');

    // 隐藏所有 legend-container
    legendContainers.forEach(container => {
        container.classList.remove('active', 'show');
    });

    // 获取 legend-container-bca 中的内容
    const content = document.querySelector(`.legend-container-bca .legend-content.${groupName}`);
    const currentButton = Array.from(bcaButtons).find(btn => btn.getAttribute('onclick').includes(groupName));

    if (!currentButton) return; // 如果按钮不存在，直接返回

    const isActive = currentButton.classList.contains('active');

    if (isActive) {
        // 关闭当前按钮、图例、图层
        currentButton.classList.remove('active');
        content.classList.remove('open', 'show');

        // 关闭所有 Mapbox 图层
        allLayerNames.forEach(layer => {
            map.setLayoutProperty(layer, 'visibility', 'none');
        });
    } else {
        // 先关闭所有按钮、图例、图层
        bcaButtons.forEach(btn => btn.classList.remove('active'));
        bcaContents.forEach(item => item.classList.remove('open'));

        allLayerNames.forEach(layer => {
            map.setLayoutProperty(layer, 'visibility', 'none');
        });

        // 激活当前按钮、图例、图层
        currentButton.classList.add('active');
        content.classList.add('open', 'show');

        // 显示对应图层
        layers[groupName].forEach(layer => {
            map.setLayoutProperty(layer, 'visibility', 'visible');
        });

        // 显示 legend-container-bca
        legendContainerBCA.classList.add('active', 'show');

        // 强制更新所有图例显示状态
        setTimeout(() => {
            document.querySelectorAll('.legend-content').forEach(legend => {
                if (legend.classList.contains(groupName)) {
                    legend.classList.add('open', 'show');
                } else {
                    legend.classList.remove('open', 'show');
                }
            });
        }, 0);
    }
}

document.getElementById("bca-link").addEventListener("click", function (event) {
    setTimeout(function () {
        let resultPanel = document.querySelector(".result-panel");
        resultPanel.classList.remove("show");
    }, 0);
    const buttonsContainer = document.querySelector(".buttons-container");
    const legendContainer = document.querySelector(".legend-container-bca");

    if (!buttonsContainer || !legendContainer) {
        return;
    }

    // 切换按钮组和图例组的可见性
    buttonsContainer.classList.toggle("show");
    legendContainer.classList.toggle("show");
});

// Draw统一处理函数
function UserDraw(e) {
    if (!e.features || e.features.length === 0) return;  // 空值检查
    const areaResult = updateArea(e);
    const analysisResult = analyzePolygon(e);
    displayResults(areaResult, analysisResult);
}

// 计算多边形面积
function updateArea(e) {
    const data = draw.getAll();
    let result = '';

    if (data.features.length > 0) {
        const area = turf.area(data.features[0]);  // 修正
        const rounded_area = Math.round(area * 100) / 100;
        result = `<p>Total Area: ${rounded_area} m²</p>`;
    } else {
        result = '';
        if (e.type !== 'draw.delete') {
            alert('Draw a polygon to explore building properties within the area.');
        }
    }
    return result;
}

// 分析多边形内数据
function analyzePolygon(e) {
    const polygon = e.features[0].geometry;
    const pointsSources = ['sg_buildings-0g14da'];

    let count = 0;
    let totalEnergy = 0;
    let totalEmbodiedCarbon = 0;
    let totalGrossFloorArea = 0;
    let buildingTypes = {};  // 用来统计建筑类型数量

    pointsSources.forEach(function (pointsSource) {
        const features = map.queryRenderedFeatures({
            layers: [pointsSource]
        });

        features.forEach(function (feature) {
            const centroid = turf.centroid(feature).geometry;
            const isInside = turf.booleanPointInPolygon(centroid, polygon);

            if (isInside) {
                count++;
                totalEnergy += feature.properties.energy_total || 0;
                totalEmbodiedCarbon += feature.properties.embodied_carbon || 0;
                totalGrossFloorArea += feature.properties['gross_floor_area'] || 0;

                // 统计建筑类型
                const buildingType = feature.properties['building_archetype'];
                if (buildingTypes[buildingType]) {
                    buildingTypes[buildingType]++;
                } else {
                    buildingTypes[buildingType] = 1;
                }
            }
        });
    });

    // 构建建筑类型的显示信息
    let buildingTypeInfo = '';
    for (const type in buildingTypes) {
        buildingTypeInfo += `<p>${type} Buildings: ${buildingTypes[type]}</p>`;
    }

    return `
        <p>Building Numbers: ${count}</p>
        <p>Total Embodied Carbon: ${EmbodiedCarbon.toFixed(2)}</p>
        <p>Total Energy: ${totalEnergy.toFixed(2)}</p>
        <p>Total Gross Floor Area: ${totalGrossFloorArea.toFixed(2)} m²</p>
        ${buildingTypeInfo} <br>
    `;
}

// 获取 .calculation-box 和 .closex 元素
const calculationBox = document.querySelector('.calculation-box');
const closeButton = document.querySelector('.closex');

// 显示结果
function displayResults(areaResult, analysisResult) {
    const answer = document.getElementById('calculated-area');
    if (answer) {
        answer.innerHTML = `${areaResult}${analysisResult}`;
    } else {
        console.error('Element with id "calculated-area" not found.');
    }
}

document.querySelector('.closex').addEventListener('click', function () {
    document.querySelector('.calculation-box').style.display = 'none';
});
