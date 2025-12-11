document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 变量声明 (使用 bm 前缀) ---
    const bmLink = document.getElementById('bm-link');
    const bmPanel = document.getElementById('bm-panel');

    const bmSubtypeSelect = document.getElementById('bm-subtype-select');
    const bmArchetypeSelect = document.getElementById('bm-archetype-select');

    const bmCalculateBtn = document.getElementById('bm-calculate-btn');
    const bmClearBtn = document.getElementById('bm-clear-btn');

    const bmCloseBtn = document.getElementById('bm-close-btn');
    const bmCloseCross = document.getElementById('bm-close-cross');

    // 您提供的 Archetype 数据结构
    const bmArchetypeData = {
        publicHousing: ["HDB PPVC", "HDB non-PPVC"],
        privateHousing: ["Landed property", "Private apartment & condo"],
        otherDwelling: ["Shophouse", "Hotel"],
        commercial: ["Retail", "Mixed development", "Office", "Business park"],
        healthcare: ["Hospital", "Clinic", "Nursing home"],
        educational: ["Inst. of higher learning (IHL)", "Non-IHL"],
        industrial: ["B1", "B2"],
        others: ["Data centre", "Civic, community & cultural inst.", "Sports & recreation", "Restaurant", "Hawker centre", "Supermarket"]
    };

    // --- 2. 全局数据存储和配置 (从前面讨论中整合) ---
    let rawBuildingData = null;

    const chartConfigs = [
        { id: 'chart-eui', metric: '2024 EUI', unit: 'kWh/m²·yr', input: 'bm-eui-input', meta: { name: 'Energy Use Intensity' } },
        { id: 'chart-gui', metric: '2024 GUI', unit: 'kWh/m²·yr', input: 'bm-gui-input', meta: { name: 'Gas Use Intensity' } },
        { id: 'chart-chiller', metric: 'Chilled Water System Efficiency (kW/RT)', unit: 'kW/RT', input: 'bm-chiller-input', meta: { name: 'Chilled Water Sys Eff.' }, fixedRange: [0, 1.5] },
        { id: 'chart-airside', metric: 'Air-side Efficiency (kW/RT)', unit: 'kW/RT', input: 'bm-airside-input', meta: { name: 'Air-side Efficiency' }, fixedRange: [0, 1.5] }
    ];

    // --- 3. CSV 数据加载函数 ---
    async function bmLoadBuildingData(path) {
        try {
            console.log("Loading data from:", path);
            const response = await fetch(path);
            const csvText = await response.text();

            const lines = csvText.trim().split('\n');
            if (lines.length < 2) return;

            const headers = lines[0].split(',').map(h => h.trim());
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length !== headers.length) continue;

                const record = {};
                headers.forEach((header, index) => {
                    record[header] = values[index].trim();
                });
                data.push(record);
            }

            rawBuildingData = data;
            console.log("CSV data loaded successfully. Total records:", rawBuildingData.length);
        } catch (error) {
            console.error("Error loading or parsing CSV data:", error);
        }
    }

    // 立即加载数据
    bmLoadBuildingData('data/bca2025.csv');

    // --- 4. 面板显示/隐藏切换 ---
    bmLink.addEventListener('click', (e) => {
        e.preventDefault();
        bmPanel.classList.toggle('show');
    });

    // --- 5. 下拉菜单联动逻辑 ---
    bmSubtypeSelect.addEventListener('change', bmUpdateArchetypeDropdown);

    function bmUpdateArchetypeDropdown() {
        const selectedSubtype = bmSubtypeSelect.value;
        bmArchetypeSelect.innerHTML = '<option value="">Select Archetype</option>';

        if (selectedSubtype && bmArchetypeData[selectedSubtype]) {
            bmArchetypeData[selectedSubtype].forEach(archetype => {
                const option = document.createElement('option');
                option.value = archetype;
                option.textContent = archetype;
                bmArchetypeSelect.appendChild(option);
            });
            bmArchetypeSelect.disabled = false;
        } else {
            bmArchetypeSelect.disabled = false;
        }
    }

    // --- 6. 计算按钮逻辑 (修改为调用图表渲染和计算) ---
    bmCalculateBtn.addEventListener('click', () => {
        const selectedSubtype = bmSubtypeSelect.value;
        const selectedArchetype = bmArchetypeSelect.value;

        // 收集用户输入
        const bmUserData = {
            eui: parseFloat(document.getElementById('bm-eui-input').value),
            gui: parseFloat(document.getElementById('bm-gui-input').value),
            chiller: parseFloat(document.getElementById('bm-chiller-input').value),
            airside: parseFloat(document.getElementById('bm-airside-input').value),
            gfa: parseFloat(document.getElementById('bm-gfa-input').value),
        };

        if (!selectedSubtype || !selectedArchetype || isNaN(bmUserData.eui) || isNaN(bmUserData.gfa)) {
            alert('Please select an Archetype and input required parameters.');
            return;
        }

        if (!rawBuildingData) {
            return;
        }

        // 渲染图表
        bmRenderCharts(selectedArchetype);

        // 调用核心计算函数 (现在需要使用真实数据进行计算，这里仍是模拟)
        const bmResults = bmCalculateCore(selectedSubtype, selectedArchetype, bmUserData);

        // 更新结果
        bmUpdateResultsDisplay(bmResults, bmUserData);
    });

    // --- 7. 清空按钮逻辑 (完善) ---
    bmClearBtn.addEventListener('click', bmClearAllInputs);

    function bmClearAllInputs() {
        // 1. 清空输入框
        document.getElementById('bm-eui-input').value = '';
        document.getElementById('bm-gui-input').value = '';
        document.getElementById('bm-chiller-input').value = '';
        document.getElementById('bm-airside-input').value = '';
        document.getElementById('bm-gfa-input').value = '';

        // 2. 清空下拉菜单
        bmSubtypeSelect.value = '';
        bmArchetypeSelect.innerHTML = '<option value="">Select Archetype</option>';
        // 建议：保持 disabled = true，直到选择了 Subtype
        bmArchetypeSelect.disabled = true;

        // 3. 清空所有指标的结果显示
        const metrics = ['eui', 'gui', 'chiller', 'airside'];

        metrics.forEach(metric => {
            // 清空排名
            const rankEl = document.getElementById(`bm-rank-${metric}`);
            if (rankEl) rankEl.textContent = 'N/A';

            // 清空基准偏差，并重置颜色
            const devBenchEl = document.getElementById(`bm-dev-bench-${metric}`);
            if (devBenchEl) {
                devBenchEl.textContent = 'N/A';
            }

            // 清空绿色目标偏差
            const devGMEl = document.getElementById(`bm-dev-gm-${metric}`);
            if (devGMEl) devGMEl.textContent = 'N/A';

            // 清空注释
            const notesEl = document.getElementById(`bm-notes-${metric}`);
            if (notesEl) notesEl.textContent = 'N/A';
        });
    }

    const GREENMARK_GOALS_BY_ARCHETYPE = {
        "Retail": { 'Gold Plus EUI': 240, 'Platinum EUI': 210, 'SLE EUI': 160 },
        "Office": {
            'Large': { 'Gold Plus EUI': 155, 'Platinum EUI': 140, 'SLE EUI': 115 },
            'Small': { 'Gold Plus EUI': 135, 'Platinum EUI': 120, 'SLE EUI': 100 }
        },
        "Hotel": {
            'Large': { 'Gold Plus EUI': 230, 'Platinum EUI': 220, 'SLE EUI': 190 },
            'Small': { 'Gold Plus EUI': 180, 'Platinum EUI': 160, 'SLE EUI': 140 }
        },
        "Inst. of higher learning (IHL)": { 'Gold Plus EUI': 130, 'Platinum EUI': 120, 'SLE EUI': 90 },
        "Non-IHL": { 'Gold Plus EUI': 40, 'Platinum EUI': 35, 'SLE EUI': 30 },
        "Hospital": { 'Gold Plus EUI': 375, 'Platinum EUI': 340, 'SLE EUI': 300 },
        "Clinic": { 'Gold Plus EUI': 150, 'Platinum EUI': 135, 'SLE EUI': 120 },
        "Nursing home": { 'Gold Plus EUI': 90, 'Platinum EUI': 80, 'SLE EUI': 70 },
        "Civic, community & cultural inst.": { 'Gold Plus EUI': 150, 'Platinum EUI': 125, 'SLE EUI': 110 },
        "Sports & recreation": { 'Gold Plus EUI': 110, 'Platinum EUI': 80, 'SLE EUI': 50 },
        "B1": { 'Gold Plus EUI': 50, 'Platinum EUI': 45, 'SLE EUI': 35 }
    };


    /**
     * 计算百分位排名 (Percentile Rank)
     * @param {number[]} data - 基准分布数据（已排序）
     * @param {number} value - 用户输入值
     * @param {boolean} isLowerBetter - 指标是否是越低越好 (EUI/GUI/Chiller/Airside都是)
     * @returns {string} - 百分比排名 (0.00% - 100.00%)
     */

    function calculatePercentileRank(data, value, isLowerBetter = true) {
        if (data.length === 0) return '0.00';

        // 确保数据已排序
        data.sort((a, b) => a - b);
        const n = data.length;

        let count = 0;

        for (const d of data) {
            if (d < value) {
                count++;
            } else if (d === value) {
                count += 0.5;
            } else {
                break;
            }
        }
        return ((count / n) * 100).toFixed(2);
    }

    // --- 8. 核心辅助函数 (工具函数和渲染函数，从前面讨论中整合) ---

    function histogram(data, binCount) {
        const min = Math.min(...data), max = Math.max(...data);
        if (min === max) { return [[min, data.length]]; }
        const step = (max - min) / binCount;
        const bins = Array.from({ length: binCount }, (_, i) => ({
            mid: min + (i + 0.5) * step, count: 0
        }));
        data.forEach(val => {
            let idx = Math.floor((val - min) / step);
            if (idx >= binCount) idx = binCount - 1;
            if (idx < 0) idx = 0;
            bins[idx].count++;
        });
        return bins.map(b => [b.mid, b.count]);
    }

    function boxplotStats(data) {
        data.sort((a, b) => a - b);
        const len = data.length;
        if (len === 0) return [[0, 0, 0, 0, 0]];

        const q1 = data[Math.floor(len * 0.25)];
        const median = data[Math.floor(len * 0.5)];
        const q3 = data[Math.floor(len * 0.75)];
        return [[data[0], q1, median, q3, data[len - 1]]];
    }

    // --- 核心计算函数 ---
    function bmCalculateCore(subtype, archetype, userData) {
        console.log(`Calculating for: ${subtype} - ${archetype}`);

        const results = {};

        chartConfigs.forEach(cfg => {
            const metricKey = cfg.metric;
            const shortMetric = cfg.input.replace('bm-', '').replace('-input', '');

            // 1. 获取当前指标的真实数据分布
            const rawData = rawBuildingData
                .filter(item => item['Building Type'] === archetype)
                .map(item => parseFloat(item[metricKey]))
                .filter(val => !isNaN(val));

            const userValue = userData[shortMetric];
            const gfa = userData.gfa; // 获取 GFA

            if (rawData.length === 0 || isNaN(userValue)) {
                results[shortMetric] = {
                    rank: 'N/A',
                    deviation_benchmark: 'N/A',
                    deviation_greenmark: 'N/A',
                    deviation_benchmark_percent: 'N/A',
                    deviation_greenmark_percent: 'N/A',
                    notes: 'N/A'
                };
                return;
            }

            // --- 动态计算基准线 (Benchmark) ---
            const boxStats = boxplotStats(rawData)[0];
            const dynamicBenchmark = boxStats[2]; // Median (Q2)

            // 确定单位
            const unit = cfg.unit.split('(')[0].trim().replace('·', '');

            // 2. 计算百分位排名
            const rank = calculatePercentileRank(rawData, userValue, true);

            // 3. 计算绝对偏差 (Benchmark)
            const deviationBenchmark = (userValue - dynamicBenchmark).toFixed(2);

            // 4. 计算百分比偏差 (Benchmark)
            let deviationBenchmarkPercent = 'N/A';
            if (dynamicBenchmark > 0) {
                deviationBenchmarkPercent = ((userValue - dynamicBenchmark) / dynamicBenchmark * 100).toFixed(2);
            }

            // EUI 专用：计算多个 Green Mark 目标值的偏差
            if (shortMetric === 'eui') {
                let euiGoalsRaw = GREENMARK_GOALS_BY_ARCHETYPE[archetype];

                const multiGreenMarkResults = {};

                // 根据 GFA 判断 'Large' 或 'Small'
                if (archetype === 'Hotel' || archetype === 'Office') {
                    const sizeCategory = gfa >= 15000 ? 'Large' : 'Small';
                    euiGoalsRaw = euiGoalsRaw[sizeCategory];
                }

                const targetKeys = ['Gold Plus EUI', 'Platinum EUI', 'SLE EUI'];

                targetKeys.forEach(key => {
                    const greenMarkGoal = euiGoalsRaw ? euiGoalsRaw[key] : null;
                    let deviation = 'N/A';
                    let deviationPercent = 'N/A';

                    if (greenMarkGoal !== null && !isNaN(greenMarkGoal)) {
                        deviation = (userValue - greenMarkGoal).toFixed(2);
                        if (greenMarkGoal > 0) {
                            deviationPercent = ((userValue - greenMarkGoal) / greenMarkGoal * 100).toFixed(2);
                        }
                    }
                    multiGreenMarkResults[key] = {
                        goal: greenMarkGoal,
                        deviation: deviation,
                        deviationPercent: deviationPercent
                    };
                });

                const defaultGoalResult = multiGreenMarkResults['Gold Plus EUI'];

                // 5. 生成建议/注释 (基于 Gold Plus EUI)
                let notes = '';
                if (parseFloat(deviationBenchmark) > 0) {
                    notes = 'ALERT: Below median benchmark. Review operational efficiency and optimize energy protocols.';
                } else if (defaultGoalResult.goal !== null && parseFloat(defaultGoalResult.deviation) > 0) {
                    notes = 'Above Benchmark. Requires optimization to meet Green Mark Gold Plus target efficiency.';
                } else if (defaultGoalResult.goal !== null && parseFloat(defaultGoalResult.deviation) <= 0) {
                    notes = 'EXCELLENT: Green Mark Gold Plus target achieved. Maintain high efficiency standards.';
                } else {
                    notes = 'Favorable: Exceeds median benchmark. Green Mark target data unavailable for full comparison.';
                }

                // 6. 存储结果
                results[shortMetric] = {
                    rank: rank + '%',
                    deviation_benchmark: deviationBenchmark,
                    deviation_benchmark_percent: deviationBenchmarkPercent,
                    notes: notes,
                    unit: unit,
                    benchmarkValue: dynamicBenchmark,

                    // 兼容旧字段
                    deviation_greenmark: defaultGoalResult.deviation,
                    deviation_greenmark_percent: defaultGoalResult.deviationPercent,
                    greenMarkValue: defaultGoalResult.goal,

                    // 新增：包含所有目标的详细结果
                    multiGreenMarkResults: multiGreenMarkResults
                };
                return; // EUI 结束，进入下一个指标
            }

            // 其他指标 (GUI, Chiller, Airside) 的通用逻辑
            const greenMarkGoal = GREENMARK_GOALS_BY_ARCHETYPE[archetype] ?
                GREENMARK_GOALS_BY_ARCHETYPE[archetype][metricKey] : null;

            let deviationGreenMark = 'N/A';
            let deviationGreenMarkPercent = 'N/A';

            if (greenMarkGoal !== null && !isNaN(greenMarkGoal)) {
                deviationGreenMark = (userValue - greenMarkGoal).toFixed(2);
                if (greenMarkGoal > 0) {
                    deviationGreenMarkPercent = ((userValue - greenMarkGoal) / greenMarkGoal * 100).toFixed(2);
                }
            }

            // 5. 生成建议/注释
            let notes = '';
            if (parseFloat(deviationBenchmark) > 0) {
                notes = 'ALERT: Below median benchmark. Review operational efficiency and optimize energy protocols.';
            } else if (greenMarkGoal !== null && parseFloat(deviationGreenMark) > 0) {
                notes = 'Above Benchmark. Requires optimization to meet Green Mark target efficiency.';
            } else if (greenMarkGoal !== null && parseFloat(deviationGreenMark) <= 0) {
                notes = 'EXCELLENT: Green Mark target achieved. Maintain high efficiency standards.';
            } else {
                notes = 'Favorable: Exceeds median benchmark. Green Mark target data unavailable for full comparison.';
            }


            // 6. 存储结果 
            results[shortMetric] = {
                rank: rank + '%',
                deviation_benchmark: deviationBenchmark,
                deviation_greenmark: deviationGreenMark,
                deviation_benchmark_percent: deviationBenchmarkPercent,
                deviation_greenmark_percent: deviationGreenMarkPercent,
                notes: notes,
                unit: unit,
                benchmarkValue: dynamicBenchmark,
                greenMarkValue: greenMarkGoal
            };
        });

        return results;
    }

    /**
         * 更新结果显示到 HTML 页面 (显示绝对偏差和百分比偏差)
         * @param {object} results - bmCalculateCore 的返回结果
         * @param {object} userData - 用户输入数据
         */
    function bmUpdateResultsDisplay(results, userData) {
        const metrics = ['eui', 'gui', 'chiller', 'airside'];

        // Green Mark EUI 目标键的固定顺序
        const EUI_TARGET_KEYS = ['Gold Plus EUI', 'Platinum EUI', 'SLE EUI'];

        metrics.forEach(metric => {
            const data = results[metric];

            // 获取 HTML 元素
            const rankEl = document.getElementById(`bm-rank-${metric}`);
            const devBenchEl = document.getElementById(`bm-dev-bench-${metric}`);
            const devGMEl = document.getElementById(`bm-dev-gm-${metric}`);
            const notesEl = document.getElementById(`bm-notes-${metric}`);

            // 设置文本对齐
            if (rankEl) rankEl.style.textAlign = 'left';
            if (devBenchEl) devBenchEl.style.textAlign = 'left';
            if (devGMEl) devGMEl.style.textAlign = 'left';
            if (notesEl) notesEl.style.textAlign = 'left';

            // 处理 N/A 数据
            if (!data) {
                if (rankEl) rankEl.textContent = 'N/A';
                if (devBenchEl) devBenchEl.textContent = 'N/A';
                if (devGMEl) devGMEl.textContent = 'N/A';
                if (notesEl) notesEl.textContent = 'N/A';
                return;
            }

            const unit = data.unit;

            // 渲染排名
            if (rankEl) rankEl.textContent = data.rank;

            // 渲染基准偏差 (Benchmark Deviation)
            if (devBenchEl) {
                let displayBench = 'N/A';
                if (data.deviation_benchmark !== 'N/A') {
                    // 原有的基准偏差显示逻辑
                    const percent = data.deviation_benchmark_percent !== 'N/A' ? ` ${data.deviation_benchmark_percent}%` : '';
                    displayBench = `${percent} (Median: ${data.benchmarkValue.toFixed(2)} ${unit})`;
                }
                devBenchEl.textContent = displayBench;

                // 颜色指示
                if (data.deviation_benchmark !== 'N/A') {
                    const deviationValue = parseFloat(data.deviation_benchmark);
                    devBenchEl.style.color = deviationValue > 0 ? 'red' : (deviationValue < 0 ? 'green' : '#333333');
                } else {
                    devBenchEl.style.color = '#333333';
                }
            }

            // 渲染绿色建筑偏差 (Green Mark Deviation)
            if (devGMEl) {
                if (metric === 'eui' && data.multiGreenMarkResults) {
                    // EUI 专用：渲染三行简洁格式
                    let displayHTML = '';
                    const resultsGM = data.multiGreenMarkResults;

                    EUI_TARGET_KEYS.forEach(key => {
                        const result = resultsGM[key];
                        const percent = result.deviationPercent !== 'N/A' ? `${result.deviationPercent}%` : 'N/A';
                        const line = `${percent} from ${key}`;

                        displayHTML += line + '<br>';
                    });

                    // 将结果设置为 HTML 内容，并移除末尾多余的 <br>
                    devGMEl.innerHTML = displayHTML.slice(0, -4);
                    devGMEl.style.color = '#333333'; // 移除颜色指示，因为有多个目标，颜色判断复杂

                } else {
                    // 其他指标 (GUI, Chiller, Airside) 或 EUI 数据缺失时，使用原有逻辑
                    let displayGM = 'N/A';
                    if (data.deviation_greenmark !== 'N/A') {
                        const percent = data.deviation_greenmark_percent !== 'N/A' ? ` ${data.deviation_greenmark_percent}%` : '';
                        displayGM = `${percent} (Goal: ${data.greenMarkValue.toFixed(2)} ${unit})`;
                    }
                    devGMEl.textContent = displayGM;
                    devGMEl.style.color = '#333333'; // 保持默认颜色
                }
            }

            // 渲染注释
            if (notesEl) notesEl.textContent = data.notes;
        });
    }

    // --- 核心图表渲染函数 ---
    const bmChartInstances = {};

    function bmRenderCharts(selectedArchetype) {
        const container = document.getElementById('bm-chart-eui');

        const filteredData = rawBuildingData.filter(
            item => item['Building Type'] === selectedArchetype
        );

        if (filteredData.length === 0) {
            alert(`Benchmarking for this category (${selectedArchetype}) is not supported because the data count is 0.`);
            return;
        }

        console.log(`Found ${filteredData.length} records for ${selectedArchetype}.`);

        // --- ECharts 样式和常量 ---
        const styleColor = "#333";
        const barColor = "lightgray";
        const axisFontSize = 10;
        const markLineColor = '#007cbf';
        const commonGridLeft = '6%';

        chartConfigs.forEach(cfg => {
            // 提取当前指标的数据数组 (与之前相同)
            const rawData = filteredData
                .map(item => parseFloat(item[cfg.metric]))
                .filter(val => !isNaN(val) && val !== null);

            if (rawData.length === 0) {
                console.warn(`No valid data found for metric: ${cfg.metric}`);
                return;
            }

            const chartData = {
                histogram: histogram(rawData, 20),
                boxplot: boxplotStats(rawData)
            };


            let xMin, xMax;

            if (cfg.fixedRange) {
                xMin = cfg.fixedRange[0];
                xMax = cfg.fixedRange[1];
            } else {
                const minValue = Math.min(...rawData);
                const maxValue = Math.max(...rawData);
                const padding = (maxValue - minValue) * 0.1;
                xMin = Math.floor(minValue - padding);
                xMax = Math.ceil(maxValue + padding);
            }

            // 确保 X 轴最小值为非负数 (可选的增强)
            if (xMin < 0 && !cfg.fixedRange) xMin = 0;

            let div = document.getElementById(cfg.id);
            if (!div || div.parentNode !== container) {
                div = document.createElement('div');
                div.className = 'chart-item';
                div.id = cfg.id;
                container.appendChild(div);
            } else {
                if (bmChartInstances[cfg.id]) {
                    echarts.dispose(bmChartInstances[cfg.id]);
                    delete bmChartInstances[cfg.id];
                }
            }

            // 2. 初始化新实例并存储
            const chart = echarts.init(div, null, {
                renderer: 'svg'
            });
            bmChartInstances[cfg.id] = chart; // 存储实例供联动和resize使用

            // ECharts Option 配置
            const option = {
                tooltip: {
                    trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true,
                    formatter: (params) => {
                        let html = `<div style="font-size:12px">`;
                        params.forEach(p => {
                            if (p.seriesType === 'boxplot') {
                                const v = p.value;
                                html += `Max: ${v[5].toFixed(2)}<br/>Q3: ${v[4].toFixed(2)}<br/>Median: ${v[3].toFixed(2)}<br/>Q1: ${v[2].toFixed(2)}<br/>Min: ${v[1].toFixed(2)}`;
                            } else if (p.seriesType === 'bar') {
                                html += `Freq: ${p.value[1]}`;
                            }
                        });
                        return html + "</div>";
                    }
                },
                toolbox: {
                    show: true,
                    orient: 'horizontal',
                    left: '35%',
                    top: '86%',
                    feature: {
                        magicType: {
                            show: true,
                            type: ['line', 'bar'],
                            title: {
                                line: '',
                                bar: ''
                            }
                        },
                        saveAsImage: {
                            show: true,
                            name: `${cfg.meta.name} Distribution for ${selectedArchetype}`,
                            title: ''
                        }
                    }
                },
                grid: [
                    { left: 10, right: '4%', top: '10%', height: '50%' }, // 直方图
                    { left: 48, right: '4%', top: '60%', height: '16%' }  // 箱型图
                ],
                xAxis: [
                    {
                        gridIndex: 0, type: 'value', min: xMin, max: xMax,
                        axisLabel: { fontSize: axisFontSize, color: styleColor, show: false },
                        splitLine: { show: false }
                    },
                    {
                        gridIndex: 1, type: 'value', min: xMin, max: xMax,
                        name: cfg.unit, nameLocation: 'middle', nameGap: 22,
                        nameTextStyle: { fontSize: axisFontSize, color: styleColor },
                        axisLabel: { fontSize: axisFontSize, color: styleColor },
                        splitLine: { show: false },
                        axisLine: { show: true },
                        axisTick: { show: true }
                    }
                ],
                yAxis: [
                    {
                        gridIndex: 0, type: 'value', name: 'Frequency',
                        nameLocation: 'middle', nameGap: 26,
                        nameTextStyle: { fontSize: axisFontSize, color: styleColor },
                        axisLabel: { fontSize: axisFontSize, color: styleColor },
                        splitLine: { show: false }
                    },
                    { gridIndex: 1, type: 'category', show: false }
                ],
                series: [
                    {
                        type: 'bar', xAxisIndex: 0, yAxisIndex: 0,
                        data: chartData.histogram, barWidth: '100%',
                        itemStyle: { color: barColor },
                        markLine: { symbol: 'none', silent: true, data: [], lineStyle: { color: markLineColor, width: 1.5, type: 'solid' }, animation: false }
                    },
                    {
                        name: 'Boxplot',
                        type: 'boxplot',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: chartData.boxplot,
                        itemStyle: { color: barColor, borderColor: styleColor, borderWidth: 1, shadowBlur: 0, shadowColor: 'transparent' },
                        medianStyle: { color: styleColor, lineWidth: 1 },
                        whiskerStyle: { color: styleColor, lineWidth: 1 },
                        boxWidth: ['25%', '25%'],
                        markLine: { symbol: 'none', silent: true, data: [], lineStyle: { color: markLineColor, width: 1.5, type: 'solid' }, animation: false, label: { show: false } }
                    }
                ]
            };

            chart.setOption(option);

            // 3. 绑定输入联动 (使用存储的实例)            
            const inputEl = document.getElementById(cfg.input);

            if (inputEl) {
                // 立即获取当前输入框的值
                const initialVal = parseFloat(inputEl.value);
                const initialMarkData = !isNaN(initialVal) ? [{ xAxis: initialVal }] : [];

                // 立即更新 MarkLine
                chart.setOption({
                    series: [
                        { markLine: { data: initialMarkData } }, // for 'bar' series
                        { markLine: { data: initialMarkData } } // for 'boxplot' series
                    ]
                });

                // 原始的 input 事件监听器 (保留)
                inputEl.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    const markData = !isNaN(val) ? [{ xAxis: val }] : [];
                    chart.setOption({ series: [{ markLine: { data: markData } }, { markLine: { data: markData } }] });
                });
            }

            // 确保在 resize 时 ECharts 重新渲染其内部 canvas
            window.addEventListener('resize', () => chart.resize());
        });
    }

    function bmClosePanel() {
        if (bmPanel) { bmPanel.classList.remove('show'); }
    }

    if (bmCloseBtn) { bmCloseBtn.addEventListener('click', bmClosePanel); }
    if (bmCloseCross) { bmCloseCross.addEventListener('click', bmClosePanel); }


    /**
     * 核心函数：处理“导出报告”按钮的点击事件
     */
    function exportReport() {
        console.log("Starting Word report export process...");

        // 1. 调用函数，从 DOM 中提取所有文本数据
        const finalData = buildDataToSend();

        // 检查数据是否正确提取
        if (Object.keys(finalData).length === 0) {
            alert("Could not extract any report data. Please ensure the page is fully loaded.");
            return;
        }

        // 2. 发送数据给后端 API
        fetch('http://127.0.0.1:8000/api/generate-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData)
        })
            .then(response => {
                // 检查 HTTP 状态码
                if (!response.ok) {
                    // 英文错误日志
                    console.error(`Fetch error. Server returned status: ${response.status} ${response.statusText}`);
                    throw new Error(`Server returned status: ${response.status}. Please check the backend service.`);
                }
                // 3. 将响应体转换为 Blob (二进制文件数据)
                return response.blob();
            })
            .then(blob => {
                // 4. 触发浏览器下载
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');

                // 设置下载的文件名
                const filename = 'Report_' + new Date().toISOString().slice(0, 10) + '.docx';

                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                console.log("Word report successfully generated and download started.");
            })
            .catch(error => {
                // 统一的英文错误日志
                console.error("An error occurred during report export:", error);
                alert(`Report export failed: ${error.message}`);
            });

    }

    /**
     * 辅助函数：从 HTML DOM 中提取所有指定 ID 的纯文本内容，并构建数据对象。
     */
    function buildDataToSend() {
        const allPlaceholderIds = [
            "bm-archetype-select",
            "bm-eui-input",
            "bm-gui-input",
            "bm-gfa-input",
            "bm-chiller-input",
            "bm-airside-input",
            "bm-rank-eui",
            "bm-rank-gui",
            "bm-dev-bench-eui",
            "bm-dev-bench-gui",
            "bm-dev-gm-eui",
            "bm-dev-gm-gui",
            "bm-notes-eui",
            "bm-notes-gui",
            "bm-rank-chiller",
            "bm-rank-airside",
            "bm-dev-bench-chiller",
            "bm-dev-bench-airside",
            "bm-dev-gm-chiller",
            "bm-dev-gm-airside",
            "bm-notes-chiller",
            "bm-notes-airside"
        ];

        const dataToSend = {};

        // 2. 遍历列表，动态构建数据对象
        allPlaceholderIds.forEach(id => {
            const element = document.getElementById(id);

            if (element) {
                dataToSend[id] = element.innerText.trim();
            } else {
                // 统一的英文警告日志
                console.warn(`HTML element with ID "${id}" not found.`);
                dataToSend[id] = 'N/A';
            }
        });

        return dataToSend;
    }

    document.addEventListener('DOMContentLoaded', (event) => {
        // 1. 获取按钮元素
        const exportButton = document.getElementById('bm-export-btn');

        // 2. 检查按钮是否存在并绑定监听器
        if (exportButton) {
            // 绑定函数引用。这行代码会导致编辑器识别到引用，函数就不会变灰了。
            exportButton.addEventListener('click', exportReport);
        } else {
            console.error("Initialization error: Button with ID 'bm-export-btn' not found.");
        }
    });


});

