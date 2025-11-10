document.addEventListener("DOMContentLoaded", function () {
    let resultPanel = document.querySelector(".result-panel");
    let carbonLink = document.getElementById("carbon-link");
    let energyLink = document.getElementById("energy-link");
    let typeLink = document.getElementById("type-link");
    let subtypeSelect = document.getElementById("subtype");
    let archetypeSelect = document.getElementById("archetype");
    let clearButton = document.querySelector(".clear-btn");
    let closeButton = document.querySelector('.panel-close-btn');
    let resultText = document.querySelector(".result-text");
    let simulationHeader = document.querySelector(".simulation-header");
    let currentSimulation = "";
    let archetypesunCharts = document.getElementById("archetype-charts");
    let sunChartsElementNumber = document.getElementById("sunchartsnumber");
    let sunChartsElementFootprint = document.getElementById("sunchartsfootprint");
    let carbonContainer = document.getElementById("carbon-container");
    let energyContainer = document.getElementById("energy-container");

    resultPanel.addEventListener('wheel', (event) => {
        event.preventDefault();

        resultPanel.scrollBy({
            top: event.deltaY,
            behavior: 'smooth'
        });
    });

    const imageCache = {};

    function preloadImages(archetypeList) {
        archetypeList.forEach(archetype => {
            const img = new Image();
            img.src = `image/${archetype}.jpg`; // 注意不要加 nocache
            imageCache[archetype] = img;
        });
    }

    window.onload = () => {
        preloadImages(["B1",
            "B2",
            "Business park",
            "Civic, community & cultural inst.",
            "Clinic",
            "Data centre",
            "Hawker centre",
            "HDB non-PPVC",
            "HDB PPVC",
            "Hospital",
            "Hotel",
            "Inst. of higher learning (IHL)",
            "Landed property",
            "Mixed development",
            "Non-IHL",
            "Nursing home",
            "Office",
            "Private apartment & condo",
            "Restaurant",
            "Retail",
            "Shophouse",
            "Sports & recreation",
            "Supermarket"]);
    };

    // 全局缓存变量
    let cachedCarbonData = null;

    window.addEventListener('DOMContentLoaded', async () => {
        const files = ['data/Asia.json', 'data/Baseline.json', 'data/PAMC.json'];

        try {
            let datasets = await Promise.all(files.map(file => fetch(file).then(res => res.json())));
            cachedCarbonData = {
                Asia: datasets[0],
                Baseline: datasets[1],
                PAMC: datasets[2]
            };
            console.log("Data preload finished");
            updateCarbonArcheChart();
            window.chartDataLoaded = true;
            updateProgress(80); // 图表加载是大头
            checkAllLoaded();
        } catch (error) {
            console.error("Data prload failed", error);
        }
    });

    // 获取所有的 nav-link 元素
    const navLinks = document.querySelectorAll('.nav .nav-link');

    // 获取 bca-link 和相关的元素
    const bcaLink = document.getElementById('bca-link');
    const legendContainerBCA = document.querySelector('.legend-container-bca');
    const buttonsContainer = document.querySelector('.buttons-container');

    // 遍历每个链接并添加点击事件监听
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // 如果点击的不是 bca-link，则移除 bca-link 的 active 类并隐藏相关元素
            if (event.target.id !== 'bca-link') {
                bcaLink.classList.remove('active');
                legendContainerBCA.classList.remove('active', 'show');
                buttonsContainer.classList.remove('active', 'show');
            } else {
                // 如果点击的是 bca-link，确保它的相关元素显示
                bcaLink.classList.add('active');
                legendContainerBCA.classList.add('active', 'show');
                buttonsContainer.classList.add('active', 'show');
            }
        });
    });

    setTimeout(function () {
        let resultPanel = document.querySelector(".result-panel");
        resultPanel.classList.remove("show");
    }, 0);

    const simulationContent = {
        energy: "<h2>Operational Carbon</h2>",
        carbon: "<h2>Embodied Carbon</h2>",
        type: "<h2>Building Archetype</h2>"
    };

    const archetypes = {
        publicHousing: ["HDB PPVC", "HDB non-PPVC"],
        privateHousing: ["Landed property", "Private apartment & condo"],
        otherDwelling: ["Shophouse", "Hotel"],
        commercial: ["Retail", "Mixed development", "Office", "Business park"],
        healthcare: ["Hospital", "Clinic", "Nursing home"],
        educational: ["Inst. of higher learning (IHL)", "Non-IHL"],
        industrial: ["B1", "B2"],
        others: ["Data centre", "Civic, community & cultural inst.", "Sports & recreation", "Restaurant", "Hawker centre", "Supermarket"]
    };

    const descriptions = {
        publicHousing: "Public Housing includes government-built housing for citizens, primarily managed by the Housing and Development Board (HDB). These housing schemes offer affordable living options for Singaporean citizens.",
        privateHousing: "Private Housing includes properties built by private developers. These properties are sold to private owners and typically include condominiums, landed houses, and other forms of private residential developments.",
        otherDwelling: "Other Dwelling includes various non-residential properties that serve as residential spaces, such as shophouses or non-traditional forms of housing.",
        commercial: "Commercial properties are buildings or spaces used for business purposes, such as offices, retail spaces, Business parks, and mixed-use developments.",
        healthcare: "Healthcare properties include hospitals, clinics, nursing homes, and other buildings designed for medical and health-related services.",
        educational: "Educational properties include institutions of higher learning such as universities, colleges, and schools. Non-IHL refers to educational institutions that do not fall under higher learning.",
        industrial: "Industrial properties are used for manufacturing, production, and other industrial purposes, such as factories, warehouses, and industrial parks.",
        others: "Other categories include various types of properties such as data centres, civic buildings, community and cultural institutions, sports and recreation facilities, restaurants, hawker centres, and supermarkets."
    };

    const archetypeDescriptions = {
        "HDB PPVC": "Prefabricated Pre-finished Volumetric Construction (PPVC) is a method of building that uses modular units, pre-built offsite and assembled onsite. This approach helps reduce construction time and enhances quality control.",
        "HDB non-PPVC": "Traditional method of construction used by the Housing and Development Board (HDB) without prefabricated units. It involves the use of concrete and steel to construct public housing units.",
        "Landed property": "Landed properties are individual houses that have their own plot of land. They include detached houses, semi-detached houses, and terraced houses, offering more space and privacy compared to high-rise flats.",
        "Private apartment & condo": "Private apartments and condominiums are residential buildings that are owned privately. They usually offer amenities such as swimming pools, gyms, and security, and can be found in both city-centre and suburban areas.",
        "Shophouse": "Shophouses are traditional buildings that combine both commercial and residential uses. They typically consist of a ground-floor retail space with living quarters above.",
        "Hotel": "Hotels are commercial establishments offering accommodations to travelers, with amenities such as room service, concierge, and recreational facilities.",
        "Retail": "Retail properties include spaces for selling goods directly to consumers, such as shopping malls, stores, and boutiques.",
        "Mixed development": "Mixed development properties are those that combine different types of uses, typically commercial, retail, and residential, within a single complex.",
        "Office": "Office buildings are spaces designed for business and administrative purposes. They can range from small office buildings to large office towers.",
        "Business park": "Business parks are specialized areas designed to accommodate various types of businesses, particularly in research and development, information technology, and industrial services.",
        "Hospital": "Hospitals are large healthcare facilities that provide medical treatment and emergency care, with inpatient and outpatient services.",
        "Clinic": "Clinics are smaller healthcare facilities that offer outpatient medical services, typically for general practitioners or specialized services.",
        "Nursing home": "Nursing homes are facilities that provide residential care and support for elderly individuals, including medical assistance and daily living activities.",
        "Inst. of higher learning (IHL)": "Institutions of higher learning (IHL) include universities, polytechnics, and other higher education institutions offering advanced degrees and diplomas.",
        "Non-IHL": "Non-Institution of Higher Learning refers to other types of educational institutions, including schools and training centres that provide education at a pre-university or vocational level.",
        "B1": "B1 industrial properties are those zoned for light industry or research and development activities. They often accommodate businesses that do not involve heavy manufacturing processes.",
        "B2": "B2 industrial properties are those zoned for general industrial uses, including manufacturing and processing activities that may produce noise, pollution, or waste.",
        "Data centre": "Data centres are facilities used to house computer systems and associated components, such as telecommunications and storage systems, often with high levels of security and redundancy.",
        "Civic, community & cultural inst.": "Civic, community, and cultural institutions include public buildings that serve community and cultural purposes, such as libraries, museums, and community centres.",
        "Sports & recreation": "Sports and recreation properties include facilities such as sports complexes, stadiums, gyms, swimming pools, and recreational parks.",
        "Restaurant": "Restaurants are establishments that provide food and beverages to customers in exchange for money, typically served at tables in a dining setting.",
        "Hawker centre": "Hawker centres are open-air food courts where various food vendors sell affordable local dishes, providing an essential part of Singapore's food culture.",
        "Supermarket": "Supermarkets are large retail spaces that sell a wide variety of food, beverages, and household products, typically arranged in aisles."
    };

    function toggleSimulationType(simulationType) {
        // 找到当前点击的链接
        const currentLink = document.getElementById(`${simulationType}-link`);
        const isActive = currentLink.classList.contains('active');
        const resultPanel = document.querySelector('.result-panel'); // 确保你有一个结果面板

        if (isActive) {
            resultPanel.classList.remove("show");
            currentLink.classList.remove('active'); // 取消激活状态
            // currentSimulation = ""; // 清空当前模拟类型
        } else {
            // 更新当前模拟内容
            currentSimulation = simulationType;
            resultPanel.classList.add("show"); // 显示面板
            document.querySelector(".simulation-header").innerHTML = simulationContent[currentSimulation];

            // 激活当前链接
            const allLinks = document.querySelectorAll('.nav-link');
            allLinks.forEach(link => link.classList.remove('active')); // 清除所有链接的激活状态
            currentLink.classList.add('active'); // 设置当前链接为激活状态
        }
    }

    function panelClose() {
        const resultPanel = document.querySelector('.result-panel');
        if (resultPanel) {
            resultPanel.classList.remove('show');
        }
    }

    closeButton.addEventListener('click', panelClose);

    // 返回建筑类型选择结果
    function updateArchetypes() {
        let subtype = subtypeSelect.value;
        archetypeSelect.innerHTML = "<option value=''>All Archetype</option>";

        if (subtype && archetypes[subtype]) {
            archetypes[subtype].forEach(option => {
                let optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                archetypeSelect.appendChild(optionElement);
            });
        }
    }

    function updateArchetypeDescription() {
        let subtype = subtypeSelect.value; // 获取选中的subtype
        let archetype = archetypeSelect.value; // 获取选中的archetype
        let archetypeDescriptionElement = document.getElementById("archetype-description");

        if (archetype && archetypeDescriptions[archetype]) {
            archetypeDescriptionElement.textContent = archetypeDescriptions[archetype];
        }
        // 如果没有选择archetype，但选择了subtype，显示subtype的介绍
        else if (subtype && descriptions[subtype]) {
            archetypeDescriptionElement.textContent = descriptions[subtype];
        } else {
            // 如果没有subtype或archetype，显示默认信息
            archetypeDescriptionElement.textContent = "Please select a valid archetype or type.";
        }
    }

    // 监听subtypeSelect和archetypeSelect的变化
    subtypeSelect.addEventListener("change", updateArchetypeDescription);
    archetypeSelect.addEventListener("change", updateArchetypeDescription);
    clearButton.addEventListener("click", updateArchetypeDescription);

    function addImage(archetypeSelect, containerId) {
        let imageContainer = document.getElementById(containerId);

        // 删除旧图
        const existingImage = imageContainer.querySelector("img");
        if (existingImage) {
            imageContainer.removeChild(existingImage);
        }

        const cachedImage = imageCache[archetypeSelect];
        if (cachedImage) {
            const newImg = cachedImage.cloneNode();
            imageContainer.appendChild(newImg);
        } else {
            const fallbackImg = new Image();
            fallbackImg.src = `image/${archetypeSelect}.jpg`;
            fallbackImg.alt = archetypeSelect;
            fallbackImg.onerror = () => {
                console.error("Image failled", fallbackImg.src);
            };
            imageContainer.appendChild(fallbackImg);
        }
    }

    // Simulation details
    function carbonsimulationDetails() {
        const archetypeSpan = document.getElementById("archetype-val");
        const ecSpan = document.getElementById("ec-intensity");
        const distSpan = document.getElementById("fitted-distribution");
        const paramsSpan = document.getElementById("distribution-params");
        const archetypeSelect = document.getElementById("archetype");
        const concreteMISpan = document.getElementById("concreteMI");
        const concreteWFSpan = document.getElementById("concreteWF");
        const steelMISpan = document.getElementById("steelMI");
        const steelWFSpan = document.getElementById("steelWF");
        const glassMISpan = document.getElementById("glassMI");
        const glassWFSpan = document.getElementById("glassWF");
        const alMISpan = document.getElementById("alMI");
        const alWFSpan = document.getElementById("alWF");
        const brickMISpan = document.getElementById("brickMI");
        const brickWFSpan = document.getElementById("brickWF");
        const meanOnsiteEmissionsSpan = document.getElementById("meanOnsiteEmissions");

        if (!archetypeSpan || !ecSpan || !distSpan || !paramsSpan || !archetypeSelect) {
            return;
        }

        let excelData = [];

        async function loadExcel() {
            try {
                const response = await fetch("data/embodied carbon simulation details.xlsx");
                if (!response.ok) {
                    return;
                }

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                const sheet = workbook.Sheets["Baseline Scenario"];
                if (!sheet) {
                    return;
                }

                excelData = XLSX.utils.sheet_to_json(sheet);

                archetypeSelect.addEventListener("change", updateCarbonDetails);
                updateCarbonDetails();
            } catch (error) {
                console.error("Embodied Carbon Excel failed:", error);
            }
        }

        function updateCarbonDetails() {
            const selectedArchetype = archetypeSelect.value;

            if (excelData.length === 0) {
                console.warn("Embodied Carbon Excel is empty");
                return;
            }

            const data = excelData.find(row => row.Archetypes === selectedArchetype);

            if (data) {
                // detail descriptions
                archetypeSpan.textContent = data.Archetypes || "N/A";
                ecSpan.textContent = data["Mean EC Intensity"] ? `${parseFloat(data["Mean EC Intensity"]).toFixed(4)} kgCO₂e/m²` : "N/A";
                distSpan.textContent = data["Fitted Distribution"] || "N/A";
                paramsSpan.textContent = data["Distribution Parameters"] || "N/A";

                // parameters
                concreteMISpan.textContent = data["Mean MI Concrete"] ? `${parseFloat(data["Mean MI Concrete"]).toFixed(4)} kg/m²` : "N/A";
                concreteWFSpan.textContent = data["Mean WF Concrete"] ? parseFloat(data["Mean WF Concrete"]).toFixed(4) : "N/A";
                steelMISpan.textContent = data["Mean MI Steel"] ? `${parseFloat(data["Mean MI Steel"]).toFixed(4)} kg/m²` : "N/A";
                steelWFSpan.textContent = data["Mean WF Steel"] ? parseFloat(data["Mean WF Steel"]).toFixed(4) : "N/A";
                glassMISpan.textContent = data["Mean MI Glass"] ? `${parseFloat(data["Mean MI Glass"]).toFixed(4)} kg/m²` : "N/A";
                glassWFSpan.textContent = data["Mean WF Glass"] ? parseFloat(data["Mean WF Glass"]).toFixed(4) : "N/A";
                alMISpan.textContent = data["Mean MI Aluminium"] ? `${parseFloat(data["Mean MI Aluminium"]).toFixed(4)} kg/m²` : "N/A";
                alWFSpan.textContent = data["Mean WF Aluminium"] ? parseFloat(data["Mean WF Aluminium"]).toFixed(4) : "N/A";
                brickMISpan.textContent = data["Mean MI Bricks"] ? `${parseFloat(data["Mean MI Bricks"]).toFixed(4)} kg/m²` : "N/A";
                brickWFSpan.textContent = data["Mean WF Bricks"] ? parseFloat(data["Mean WF Bricks"]).toFixed(4) : "N/A";
                meanOnsiteEmissionsSpan.textContent = data["Mean onsite emissions"] ? `${parseFloat(data["Mean onsite emissions"]).toFixed(4)} kgCO₂e/m²` : "N/A";

                console.log("The Embodied Carbon Data is refreshed");
            } else {
                console.warn("No matching Archetype data found!");
            }
        }

        loadExcel();
    }

    // 直方图 三个情景的MCS 结果
    function updateCarbonArcheChart() {
        if (!cachedCarbonData) {
            console.warn("Waiting for the preload of the dataset...");
            return;
        }

        var chartDom = document.getElementById('carbonHistogram');
        if (!chartDom) {
            console.error("Error: carbonHistogram container not found.");
            return;
        }

        var carbonHistogram = echarts.init(chartDom);

        const names = ['Asia', 'Baseline', 'PAMC'];
        const binCount = 40;
        const xMin = 0, xMax = 2000;
        const binSize = (xMax - xMin) / binCount;

        let selectedBuildingType = archetypeSelect.value;

        let histogramData = names.map(name => {
            let data = cachedCarbonData[name];
            let values = Object.values(data[selectedBuildingType] || {});
            let bins = new Array(binCount).fill(0);
            let totalCount = values.length;

            values.forEach(val => {
                if (val >= xMin && val <= xMax) {
                    let binIndex = Math.floor((val - xMin) / binSize);
                    bins[binIndex]++;
                }
            });

            bins = bins.map(bin => parseFloat((bin / (totalCount * binSize) * 100).toFixed(4)));

            return { name: name, type: 'bar', data: bins };
        });

        let xAxisData = Array.from({ length: binCount }, (_, i) => Math.round(xMin + (i + 0.5) * binSize));
        let colors = ['#7ed6df', '#30336b', '#ccff66'];

        let option = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontSize: 12 } },
            legend: { data: names, top: 0 },
            grid: { left: '67px', right: '35px', top: '35px', bottom: '40px' },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    magicType: { show: true, type: ['line', 'bar'] },
                    saveAsImage: { show: true, name: 'MCS result for embodied carbon intensity' }
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                name: 'Embodied carbon intensity (kgCO₂e/m²)',
                nameGap: 25,
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: 12,
                    color: '#333',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                },
                axisLabel: { fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                name: 'Probability Density (×10^-2)',
                nameLocation: 'middle',
                nameGap: 40,
                nameTextStyle: {
                    fontSize: 12,
                    color: '#333',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                },
                axisLabel: { fontSize: 10 }
            },
            series: histogramData.map((item, index) => ({
                ...item,
                barGap: '0%',
                barCategoryGap: '0%',
                itemStyle: { color: colors[index % colors.length] }
            }))
        };

        carbonHistogram.setOption(option);
        setTimeout(() => carbonHistogram.resize(), 100);
    }


    // 监听下拉菜单的变化
    archetypeSelect.addEventListener("change", updateCarbonArcheChart);

    function subCarbonUpdateChart(selectedSub) {
        console.log('Selected Subtype:', selectedSub);

        const categoryMap = {
            publicHousing: ["HDB"],
            privateHousing: ["Landed property", "Private apt. & condo."],
            otherDwelling: ["Shophouse", "Hotel"],
            commercial: ["Retail", "Mixed development", "Office", "Business park"],
            healthcare: ["Hospital", "Clinic", "Nursing home"],
            educational: ["IHL", "Non-IHL"],
            industrial: ["Industrial B1", "Industrial B2"],
            others: ["Cultural inst.", "Sports", "Restaurant", "Hawker centre", "Supermarket", "Data centre"]
        };

        let subColorMap = {
            "HDB": "#1abc9c", "Landed property": "#2ecc71", "Private apt. & condo.": "#3498db",
            "Shophouse": "#9b59b6", "Hotel": "#9b59b6", "Retail": "#34495e", "Mixed development": "#34495e",
            "Office": "#34495e", "Business park": "#34495e", "Hospital": "#f1c40f",
            "Clinic": "#f1c40f", "Nursing home": "#f1c40f", "IHL": "#e67e22",
            "Non-IHL": "#e67e22", "Industrial B1": "#e74c3c", "Industrial B2": "#e74c3c",
            "Data centre": "#95a5a6", "Cultural inst.": "#95a5a6",
            "Sports": "#95a5a6", "Restaurant": "#95a5a6", "Hawker centre": "#95a5a6",
            "Supermarket": "#95a5a6"
        };

        // 处理 selectedSub 的数据类型
        let selectedArche = (Array.isArray(selectedSub) ? selectedSub : [selectedSub])
            .flatMap(category => categoryMap[category] || []);
        console.log('Selected subtypes:', selectedArche);

        let reversedSubArchetypes = [...subArchetypes].reverse();

        subChart.setOption({
            yAxis: {
                data: reversedSubArchetypes,
                axisLabel: {
                    fontSize: 10,
                    color: value => selectedArche.includes(value) ? '#333' : '#999'
                }
            },
            series: [{
                data: reversedSubArchetypes.map((sub, i) => ({
                    value: subValues[subArchetypes.indexOf(sub)],
                    itemStyle: {
                        color: selectedArche.includes(sub) ? subColorMap[sub] : 'rgba(211, 211, 211, 0.6)',
                        borderRadius: [0, 10, 10, 0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}',
                        fontSize: 10,
                        color: selectedArche.includes(sub) ? '#333' : '#999'
                    }
                }))
            }]
        });

        document.getElementById('downloadSubCarbonBar').addEventListener('click', function () {
            const imgURL = subChart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
            const link = document.createElement('a');
            link.href = imgURL;
            link.download = 'embodied_carbon_intensity_subtype.png';
            link.click();
        });
    }

    function subCarbonInit() {
        console.log("Initializing Sub Carbon Chart...");

        let subtypeSelect = document.getElementById("subtype");
        if (!subtypeSelect) {
            console.error("Type dropdown not found!");
            return;
        }

        subtypeSelect.addEventListener("change", () => {
            let selectedValue = subtypeSelect.value;
            subCarbonUpdateChart(selectedValue ? [selectedValue] : []);
        });

        subArchetypes = [
            "HDB", "Landed property", "Private apt. & condo.", "Shophouse", "Hotel",
            "Retail", "Mixed development", "Office", "Business park", "Hospital",
            "Clinic", "Nursing home", "IHL", "Non-IHL",
            "Industrial B1", "Industrial B2", "Data centre", "Cultural inst.",
            "Sports", "Restaurant", "Hawker centre", "Supermarket"
        ];

        subValues = [646.3, 527.1, 572.2, 848.1, 848.1, 527.4, 604.5, 519.97, 559.1,
            585.6, 652.9, 600, 546.3, 594.9, 556.4, 637.4, 700, 523.6,
            561.9, 620, 580, 550];

        subChart = echarts.init(document.getElementById('carbonSubChart'));

        subChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontSize: 12, color: '#333' }, borderRadius: 10 },
            grid: { left: '110px', right: '15px', top: '10px', bottom: '20px' },
            xAxis: { type: 'value', name: 'kgCO₂e/m²', axisLabel: { fontSize: 10, color: '#333' }, max: 900 },
            yAxis: { type: 'category', data: [...subArchetypes].reverse(), axisLabel: { fontSize: 10, color: '#999' } },
            series: [{
                type: 'bar',
                data: subArchetypes.slice().reverse().map((archetype, i) => ({
                    value: subValues[subArchetypes.length - 1 - i],
                    itemStyle: {
                        color: 'rgba(211, 211, 211, 0.6)',
                        borderRadius: [0, 10, 10, 0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}',
                        fontSize: 10,
                        color: '#999'
                    }
                }))
            }]
        });

    }

    function updateCarbonPanel() {
        let subtype = subtypeSelect.value;
        let archetype = archetypeSelect.value;
        let carbonContentElement = document.getElementById("carbon-content");
        let carbonSubtypeElement = document.getElementById("carbon-subtype");
        let carbonUnderselectElement = document.getElementById("carbon-underselect");

        // 隐藏所有元素
        carbonContentElement.style.display = "none";
        carbonSubtypeElement.style.display = "none";
        carbonUnderselectElement.style.display = "none";

        if (archetype) {
            carbonContentElement.style.display = "flex";
            addImage(archetype, "image-container-carbon");
            carbonsimulationDetails();
            updateCarbonArcheChart();
        } else if (subtype) {
            carbonSubtypeElement.style.display = "flex";
            subCarbonInit();
        } else {
            carbonUnderselectElement.style.display = "flex";
        }
    }

    // 监听subtypeSelect和archetypeSelect的变化
    subtypeSelect.addEventListener("change", updateCarbonPanel);
    archetypeSelect.addEventListener("change", updateCarbonPanel);
    clearButton.addEventListener("click", updateCarbonPanel);

    function updateEnergyPanel() {
        let subtype = subtypeSelect.value; // 获取选中的subtype
        let archetype = archetypeSelect.value; // 获取选中的archetype
        let energyContentElement = document.getElementById("energy-content");
        let energySubtypeElement = document.getElementById("energy-subtype");
        let energyUnderselectElement = document.getElementById("energy-underselect");

        // 隐藏所有的 energy div
        energyContentElement.style.display = "none";
        energySubtypeElement.style.display = "none";
        energyUnderselectElement.style.display = "none";

        if (archetype) {
            initEnergyChart();
            energyContentElement.style.display = "flex";
            addImage(archetype, "image-container-energy");
            energysimulationDetails();
            updateEnergyArcheChart(event);
        }
        else if (subtype) {
            energySubtypeElement.style.display = "flex";
            document.getElementById("subtype").addEventListener("change", function (e) {
                const selectedSubtype = e.target.value || null; // 如果选 "" 就传 null
                renderEnergySubChart(selectedSubtype); // 更新图表
            });
        } else {
            energyUnderselectElement.style.display = "flex";
        }
    }


    // Subtype Charts for Operational Part
    function renderEnergySubChart(subtypeSelect = null) {
        const energysubChart = echarts.init(document.getElementById('energySubChart'));

        const categoryMap = {
            publicHousing: ["HDB"],
            privateHousing: ["Landed property", "Private apt. & condo."],
            otherDwelling: ["Shophouse", "Hotel"],
            commercial: ["Retail", "Mixed development", "Office", "Business park"],
            healthcare: ["Hospital", "Clinic", "Nursing home"],
            educational: ["IHL", "Non-IHL"],
            industrial: ["Industrial B1", "Industrial B2"],
            others: ["Cultural inst.", "Sports", "Restaurant", "Hawker centre", "Supermarket", "Data centre"]
        };

        const euiData = {
            "HDB": [19.417, 9.083, 11.361, 6.611],
            "Landed property": [18.056, 5.000, 15.167, 2.500],
            "Private apt. & condo.": [18.667, 9.083, 11.361, 6.194],
            "Shophouse": [0.000, 0.000, 0.000, 0.000],
            "Hotel": [178.278, 21.722, 37.806, 11.389],
            "Retail": [240.638, 35.056, 37.556, 13.028],
            "Mixed development": [223.900, 24.070, 12.840, 9.700],
            "Office": [171.583, 21.444, 39.306, 3.333],
            "Business Park": [143.167, 16.083, 28.583, 3.333],
            "Hospital": [221.444, 30.500, 41.583, 5.194],
            "Clinic": [133.611, 9.556, 20.694, 3.000],
            "Nursing home": [75.028, 7.111, 8.278, 4.778],
            "IHL": [143.250, 11.056, 23.278, 1.722],
            "Non-IHL": [22.972, 15.167, 12.778, 2.250],
            "Industrial B1": [229.278, 25.722, 82.306, 6.139],
            "Industrial B2": [227.444, 25.722, 185.194, 6.139],
            "Data centre": [1134.694, 26.056, 833.611, 1.750],
            "Cultural inst.": [116.584, 22.583, 18.056, 6.222],
            "Sports": [145.750, 26.000, 13.000, 13.333],
            "Restaurant": [248.583, 27.639, 23.028, 37.306],
            "Hawker centre": [107.833, 23.889, 119.500, 39.194],
            "Supermarket": [268.150, 48.830, 85.972, 18.083]
        };
                
        const defaultGray = '#D3D3D3';
        const colorMapping = {
            'Cooling': '#A5F3FC',
            'Interior Lighting': '#FFFF00',
            'Electric Equipment': '#E0E0E0',
            'Water System': '#5a2e14'
        };

        // 获取要高亮的类别
        const highlightCategories = subtypeSelect && categoryMap[subtypeSelect]
            ? categoryMap[subtypeSelect]
            : [];

        const seriesData = [
            { name: 'Cooling', type: 'bar', stack: 'total', data: [] },
            { name: 'Interior Lighting', type: 'bar', stack: 'total', data: [] },
            { name: 'Electric Equipment', type: 'bar', stack: 'total', data: [] },
            { name: 'Water System', type: 'bar', stack: 'total', data: [] }
        ];

        // 准备系列数据 - 所有柱子都会显示
        categoryList.forEach((category, index) => {
            const isHighlighted = highlightCategories.includes(category);
            seriesData.forEach(series => {
                series.data.push({
                    value: dataValues[index][seriesData.indexOf(series)],
                    itemStyle: {
                        color: isHighlighted ? colorMapping[series.name] : defaultGray,
                        opacity: isHighlighted ? 1 : 0.6
                    }
                });
            });
        });

        const chartenergyOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: { left: '110px', right: '10px', top: '10px', bottom: '20px' },
            xAxis: {
                type: 'value',
                axisLabel: { fontSize: 10 }
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    fontSize: 10,
                    color: function (category) {
                        return highlightCategories.includes(category) ? '#333' : defaultGray;
                    }
                },
                data: categoryList
            },
            series: seriesData,
            legend: { show: false }
        };

        energysubChart.setOption(chartenergyOption, true);

        document.getElementById('downloadSubEnergyBar').addEventListener('click', function () {
            const imgURL = energysubChart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
            const link = document.createElement('a');
            link.href = imgURL;
            link.download = 'operational_carbon_intensity_subtype.png';
            link.click();
        });
    }

    // 初始化图表
    renderEnergySubChart();

    // Archetype部分的
    // Simulation details
    function energysimulationDetails() {
        const archetypeSpan = document.getElementById("archetype-value");
        const peopleDensitySpan = document.getElementById("people-density");
        const equipDensitySpan = document.getElementById("equip-density");
        const lightDensitySpan = document.getElementById("light-density");
        const coolingSetSpan = document.getElementById("coolingSet");
        const minFreshAirSpan = document.getElementById("minFreshAir");
        const roofUvalSpan = document.getElementById("roofUval");
        const facadeUvalSpan = document.getElementById("facadeUval");
        const partitionUvalSpan = document.getElementById("partitionUval");
        const slabUvalSpan = document.getElementById("slabUval");
        const airChangeSpan = document.getElementById("airChange");
        const coolingCOPSpan = document.getElementById("coolingCOP");

        let excelEnergyData = [];

        async function loadExcel() {
            try {
                const response = await fetch("data/operational carbon simulation details.xlsx");
                if (!response.ok) {
                    return;
                }

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                const sheet = workbook.Sheets["Sheet1"];
                if (!sheet) {
                    return;
                }

                excelEnergyData = XLSX.utils.sheet_to_json(sheet);

                archetypeSelect.addEventListener("change", updateEnergyDetails);
                updateEnergyDetails();
            } catch (error) {
                console.error("Operational Carbon Excel failed:", error);
            }
        }

        function updateEnergyDetails() {
            const selectedArchetype = archetypeSelect.value;

            if (excelEnergyData.length === 0) {
                console.warn("Operational Carbon Excel is empty");
                return;
            }

            const data = excelEnergyData.find(row => row.Archetypes === selectedArchetype);

            if (data) {
                // detail descriptions
                archetypeSpan.textContent = data["Archetypes"] ? data["Archetypes"] : "N/A";
                peopleDensitySpan.textContent = (data["People Density"] ? `${data["People Density"]} people/m²` : "N/A");
                equipDensitySpan.textContent = (data["Equipment Power Density"] ? `${data["Equipment Power Density"]} W/m²` : "N/A");
                lightDensitySpan.textContent = (data["Lighting Power Density"] ? `${data["Lighting Power Density"]} W/m²` : "N/A");

                // parameters
                coolingSetSpan.textContent = (data["Cooling Set Point"] ? `${data["Cooling Set Point"]} °C` : "N/A");
                minFreshAirSpan.textContent = (data["Min Fresh Air Area"] ? `${data["Min Fresh Air Area"]} m³/s` : "N/A");
                roofUvalSpan.textContent = (data["Roof UVal"] ? `${data["Roof UVal"]} W/m²·K` : "N/A");
                facadeUvalSpan.textContent = (data["Façade Uval"] ? `${data["Façade Uval"]} W/m²·K` : "N/A");
                partitionUvalSpan.textContent = (data["Partition Uval"] ? `${data["Partition Uval"]} W/m²·K` : "N/A");
                slabUvalSpan.textContent = (data["Slab Uval"] ? `${data["Slab Uval"]} W/m²·K` : "N/A");
                airChangeSpan.textContent = (data["Air Changes per Hour"] ? `${data["Air Changes per Hour"]} ACH` : "N/A");
                coolingCOPSpan.textContent = (data["Cooling COP"] ? `${data["Cooling COP"]}` : "N/A");

                console.log("The Operational Carbon Data is refreshed");
            } else {
                console.warn("No matching Archetype data found!");
            }
        }

        loadExcel();
    }

    // 全局数据
    var euidata = {
            "HDB non-PPVC": [46.472, 19.417, 9.083, 11.361, 6.611],
            "HDB PPVC": [46.472, 19.417, 9.083, 11.361, 6.611],
            "Landed property": [40.723, 18.056, 5.000, 15.167, 2.500],
            "Private apartment & condo": [45.305, 18.667, 9.083, 11.361, 6.194],
            "Shophouse": [0.000, 0.000, 0.000, 0.000, 0.000],
            "Hotel": [249.195, 178.278, 21.722, 37.806, 11.389],
            "Retail": [326.278, 240.638, 35.056, 37.556, 13.028],
            "Mixed development": [270.510, 223.900, 24.070, 12.840, 9.700],
            "Office": [235.666, 171.583, 21.444, 39.306, 3.333],
            "Business park": [191.166, 143.167, 16.083, 28.583, 3.333],
            "Hospital": [298.721, 221.444, 30.500, 41.583, 5.194],
            "Clinic": [166.861, 133.611, 9.556, 20.694, 3.000],
            "Nursing home": [95.195, 75.028, 7.111, 8.278, 4.778],
            "Inst. of higher learning (lHL)": [179.306, 143.250, 11.056, 23.278, 1.722],
            "Non-IHL": [53.167, 22.972, 15.167, 12.778, 2.250],
            "B1": [343.445, 229.278, 25.722, 82.306, 6.139],
            "B2": [444.499, 227.444, 25.722, 185.194, 6.139],
            "Data centre": [1996.111, 1134.694, 26.056, 833.611, 1.750],
            "Civic, community & cultural inst.": [163.445, 116.584, 22.583, 18.056, 6.222],
            "Sports & recreation": [197.083, 145.750, 26.000, 13.000, 13.333],
            "Restaurant": [336.556, 248.583, 27.639, 23.028, 37.306],
            "Hawker centre": [290.416, 107.833, 23.889, 119.500, 39.194],
            "Supermarket": [420.035, 268.150, 48.830, 85.972, 18.083]            
        };


    // 初始化图表
    function initEnergyChart() {
        var euiBar = echarts.init(document.getElementById('energy-eui'));

        var initialOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 10,
                padding: [8, 16],
                textStyle: { fontSize: 12, color: '#333' }
            },
            grid: { top: '10px', bottom: '30px', left: '50px', right: '40px' },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                color: '#333',
                feature: {
                    mark: { show: true },
                    saveAsImage: { show: true, name: 'EUI Barchart' }
                }
            },
            xAxis: {
                type: 'category',
                data: ['Total', 'Cooling', 'Lighting', 'Equipment', 'Hot Water'],
                axisLabel: { textStyle: { fontSize: 10, color: '#333' }, interval: 0 },
                axisLine: { lineStyle: { color: '#333' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { formatter: '{value}', textStyle: { fontSize: 10, color: '#333' } },
                axisLine: { lineStyle: { color: '#333' } },
                nameRotate: 90,
                nameLocation: 'middle',
                name: 'Energy Use Intensity (kW/m²)',
                nameTextStyle: {
                    fontSize: 12,
                    color: '#333',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                },
                nameGap: 35
            },
            series: [{
                data: [], // 初始为空，等待用户选择
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                    color: function (params) {
                        var colors = ['#34495e', '#A5F3FC', '#FFFF00', '#E0E0E0', '#5a2e14'];
                        return colors[params.dataIndex];
                    }
                }
            }]
        };

        euiBar.setOption(initialOption);
    }

    // 更新图表
    function updateEnergyArcheChart(event) {
        let archetype = event.target.value.trim();
        var euiBar = echarts.getInstanceByDom(document.getElementById('energy-eui'));

        if (!euiBar) {
            euiBar = echarts.init(document.getElementById('energy-eui'));
        }

        if (!euidata[archetype]) {
            console.error("No EUI data found for: ", archetype);
            return;
        }

        console.log("Updating chart for:", archetype, "Data:", euidata[archetype]);

        euiBar.setOption({
            series: [{ data: euidata[archetype] }]
        });
    }

    archetypeSelect.addEventListener("change", updateEnergyArcheChart);

    // 监听subtypeSelect和archetypeSelect的变化
    subtypeSelect.addEventListener("change", updateEnergyPanel);
    archetypeSelect.addEventListener("change", updateEnergyPanel);
    clearButton.addEventListener("click", updateEnergyPanel);

    carbonLink.addEventListener("click", function (event) {
        updateArchetypes();
        archetypesunCharts.style.display = "none";
        energyContainer.style.display = "none";
        carbonContainer.style.display = "block";
        toggleSimulationType("carbon");
    });

    energyLink.addEventListener("click", function (event) {
        updateArchetypes();
        archetypesunCharts.style.display = "none";
        carbonContainer.style.display = "none";
        energyContainer.style.display = "block";
        toggleSimulationType("energy");
    });

    typeLink.addEventListener("click", function (event) {
        updateArchetypes();
        toggleSimulationType("type");
        carbonContainer.style.display = "none";
        energyContainer.style.display = "none";
        archetypesunCharts.style.display = "block";

        var sunChartsNumber = echarts.init(sunChartsElementNumber);
        var optionone = {
            color: ['#ddd'],
            tooltip: {
                show: true,
                trigger: 'item',
                textStyle: {
                    fontSize: 12,
                    color: '#333'
                },
                borderRadius: 10,
                formatter: function (params) {
                    var parentValue = params.treePathInfo[params.treePathInfo.length - 2]?.value || 0;
                    var percentage = (params.data.value / parentValue * 100).toFixed(2);
                    return `${params.name}: ${params.data.value} (${percentage}%)`;
                }
            },
            series: {
                type: 'sunburst',
                radius: ['10%', '90%'],
                data: [
                    {
                        name: 'Public housing',
                        itemStyle: { color: "#1abc9c" },
                        children: [
                            { name: 'HDB (PPVC)', value: 205, itemStyle: { color: "#1abc9c" }, label: { show: false } },
                            { name: 'HDB (Non-PPVC)', value: 11205, itemStyle: { color: "#1abc9c" } }
                        ]
                    },
                    {
                        name: 'Private housing',
                        itemStyle: { color: "#57d798" },
                        children: [
                            { name: 'Landed property', value: 18675, itemStyle: { color: "#2ecc71" } },
                            { name: 'Private apt.', value: 3508, itemStyle: { color: "#3498db" } }
                        ]
                    },
                    {
                        name: 'Other dwellings',
                        itemStyle: { color: "#9b59b6" },
                        children: [
                            { name: 'Shophouse', value: 6, itemStyle: { color: "#9b59b6" }, label: { show: false } },
                            { name: 'Hotel', value: 193, itemStyle: { color: "#9b59b6" }, label: { show: false } }
                        ], label: { show: false }
                    },
                    {
                        name: 'Commercial',
                        itemStyle: { color: "#34495e" },
                        children: [
                            { name: 'Retail', value: 2552, itemStyle: { color: "#34495e" } },
                            { name: 'Mixed development', value: 207, itemStyle: { color: "#34495e" }, label: { show: false } },
                            { name: 'Office', value: 412, itemStyle: { color: "#34495e" }, label: { show: false } },
                            { name: 'Business park', value: 3, itemStyle: { color: "#34495e" }, label: { show: false } }
                        ]
                    },
                    {
                        name: 'Healthcare',
                        itemStyle: { color: "#f1c40f" },
                        children: [
                            { name: 'Hospital', value: 88, itemStyle: { color: "#f1c40f" }, label: { show: false }, label: { show: false } },
                            { name: 'Clinic', value: 29, itemStyle: { color: "#f1c40f" }, label: { show: false }, label: { show: false } },
                            { name: 'Nursing home', value: 48, itemStyle: { color: "#f1c40f" }, label: { show: false }, label: { show: false } }
                        ], label: { show: false }
                    },
                    {
                        name: 'Educational inst.',
                        itemStyle: { color: "#e67e22" },
                        children: [
                            { name: 'IHL', value: 303, itemStyle: { color: "#e67e22" }, label: { show: false } },
                            { name: 'Non-IHL', value: 541, itemStyle: { color: "#e67e22" }, label: { show: false } }
                        ], label: { show: false }
                    },
                    {
                        name: 'Industrial',
                        itemStyle: { color: "#e74c3c" },
                        children: [
                            { name: 'B1', value: 1033, itemStyle: { color: "#e74c3c" } },
                            { name: 'B2', value: 1700, itemStyle: { color: "#e74c3c" } }
                        ]
                    },
                    {
                        name: 'Others',
                        itemStyle: { color: "#95a5a6" },
                        children: [
                            { name: 'Data centre', value: 6, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Community inst.', value: 697, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Sports', value: 116, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Restaurant', value: 25, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Hawker centre', value: 30, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Supermarket', value: 8, itemStyle: { color: "#95a5a6" }, label: { show: false } }
                        ], label: { show: false }
                    }],
                label: {
                    rotate: 'radial',
                    color: '#fff',
                    fontSize: 8
                },
                itemStyle: {
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            }
        };
        sunChartsNumber.setOption(optionone);

        var sunChartsFootprint = echarts.init(sunChartsElementFootprint);
        var optiontwo = {
            color: ['#ddd'],
            tooltip: {
                show: true,
                trigger: 'item',
                textStyle: {
                    fontSize: 12,
                    color: '#333'
                },
                borderRadius: 10,
                formatter: function (params) {
                    var parentValue = params.treePathInfo[params.treePathInfo.length - 2]?.value || 0;
                    var percentage = (params.data.value / parentValue * 100).toFixed(2);
                    return `${params.name}: ${params.data.value} (${percentage}%)`;
                }
            },
            series: {
                type: 'sunburst',
                radius: ['10%', '90%'],
                data: [
                    {
                        name: 'Public housing',
                        itemStyle: { color: "#1abc9c" },
                        children: [
                            { name: 'HDB (PPVC)', value: 10.98, itemStyle: { color: "#1abc9c" }, label: { show: false } },
                            { name: 'HDB (Non-PPVC)', value: 1710.98, itemStyle: { color: "#1abc9c" } }
                        ]
                    },
                    {
                        name: 'Private housing',
                        itemStyle: { color: "#57d798" },
                        children: [
                            { name: 'Landed property', value: 1398.92, itemStyle: { color: "#2ecc71" } },
                            { name: 'Private apt.', value: 634.64, itemStyle: { color: "#3498db" } }
                        ]
                    },
                    {
                        name: 'Other dwellings',
                        itemStyle: { color: "#9b59b6" },
                        children: [
                            { name: 'Shophouse', value: 0.11, itemStyle: { color: "#9b59b6" }, label: { show: false } },
                            { name: 'Hotel', value: 42.63, itemStyle: { color: "#9b59b6" }, label: { show: false } }
                        ], label: { show: false }
                    },
                    {
                        name: 'Commercial',
                        itemStyle: { color: "#34495e" },
                        children: [
                            { name: 'Retail', value: 579.96, itemStyle: { color: "#34495e" } },
                            { name: 'Mixed development', value: 125.38, itemStyle: { color: "#34495e" }, label: { show: false } },
                            { name: 'Office', value: 222.94, itemStyle: { color: "#34495e" } },
                            { name: 'Business park', value: 2.30, itemStyle: { color: "#34495e" }, label: { show: false } }
                        ]
                    },
                    {
                        name: 'Healthcare',
                        itemStyle: { color: "#f1c40f" },
                        children: [
                            { name: 'Hospital', value: 69.20, itemStyle: { color: "#f1c40f" }, label: { show: false } },
                            { name: 'Clinic', value: 22.78, itemStyle: { color: "#f1c40f" }, label: { show: false } },
                            { name: 'Nursing home', value: 11.92, itemStyle: { color: "#f1c40f" }, label: { show: false } }
                        ], label: { show: false }
                    },
                    {
                        name: 'Educational inst.',
                        itemStyle: { color: "#e67e22" },
                        children: [
                            { name: 'IHL', value: 104.34, itemStyle: { color: "#e67e22" }, label: { show: false } },
                            { name: 'Non-IHL', value: 413.13, itemStyle: { color: "#e67e22" } }
                        ]
                    },
                    {
                        name: 'Industrial',
                        itemStyle: { color: "#e74c3c" },
                        children: [
                            { name: 'B1', value: 111.67, itemStyle: { color: "#e74c3c" } },
                            { name: 'B2', value: 1999.99, itemStyle: { color: "#e74c3c" } }
                        ]
                    },
                    {
                        name: 'Others',
                        itemStyle: { color: "#95a5a6" },
                        children: [
                            { name: 'Data centre', value: 4.16, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Community inst.', value: 252.72, itemStyle: { color: "#95a5a6" } },
                            { name: 'Sports', value: 64.28, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Restaurant', value: 1.09, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Hawker centre', value: 7.28, itemStyle: { color: "#95a5a6" }, label: { show: false } },
                            { name: 'Supermarket', value: 3.82, itemStyle: { color: "#95a5a6" }, label: { show: false } }
                        ]
                    }],
                label: {
                    rotate: 'radial',
                    color: '#fff',
                    fontSize: 8
                },
                itemStyle: {
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            }
        };
        sunChartsFootprint.setOption(optiontwo);
    });

    subtypeSelect.addEventListener("change", updateArchetypes);
    archetypeSelect.addEventListener("change", updateResultContent);

    function clearSelections() {
        subtypeSelect.value = "";
        archetypeSelect.innerHTML = "<option value=''>All Archetype</option>";
        resultText.innerHTML = "";
    }

    clearButton.addEventListener("click", clearSelections);

    /*
    // ML过滤器
    const toggleML = document.getElementById('buildingTypeToggle');

    const mllayers = [
        "sg-buildings-3d",
        "buildings-embodied-carbon",
        "buildings-operational-carbon"
    ];

    // 统一过滤器更新函数，整合机器学习和建筑类型过滤
    function updateMLFilteredBuildings() {
        console.log('ML toggle changed:', toggleML.checked);

        const selectedSubtype = subtypeSelect?.value || "";
        const selectedArchetype = archetypeSelect?.value || "";
        const mlEnabled = toggleML.checked;

        const filterML = mlEnabled ? null : ['==', ['get', 'ml_probability'], null];
        const filterSubtype = selectedSubtype !== "" ? ['==', ['get', 'building_subtype'], selectedSubtype] : null;
        const filterArchetype = selectedArchetype !== "" ? ['==', ['get', 'building_archetype'], selectedArchetype] : null;

        let filters = [];
        if (filterSubtype) filters.push(filterSubtype);
        if (filterArchetype) filters.push(filterArchetype);
        if (filterML) filters.push(filterML);

        // 当没有任何过滤器时，如果启用机器学习，显示所有建筑；否则只显示未用机器学习的建筑
        const combinedFilter = filters.length > 1 ? ['all', ...filters]
            : filters.length === 1 ? filters[0]
                : filterML || null;

        mllayers.forEach(id => map.setFilter(id, combinedFilter));
    }

    // 绑定事件监听器
    toggleML.addEventListener('change', updateMLFilteredBuildings);
    subtypeSelect.addEventListener('change', updateMLFilteredBuildings);
    archetypeSelect.addEventListener('change', updateMLFilteredBuildings);
    clearButton.addEventListener('click', function () {
        subtypeSelect.value = "";
        archetypeSelect.value = "";
        updateMLFilteredBuildings();
    });

    console.log(document.getElementById('buildingTypeToggle'));

    toggleML.addEventListener('change', () => {
        console.log('ML toggle changed to:', toggleML.checked);
        updateMLFilteredBuildings();
    });    
*/
});



