import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import json
from shapely.geometry import shape

# 读取 geojson 数据
with open('washed_data_ml.geojson', 'r') as f:
    data = json.load(f)

# 展平 'properties' 数据
df_properties = pd.json_normalize([feature['properties'] for feature in data['features']])

# 提取 'geometry' 数据
geometry_data = [feature['geometry'] for feature in data['features']]

# 提取形状特征
areas = []
perimeters = []
compactness_ratios = []  # 周长与面积的比值
convexity_ratios = []  # 凸包与原始多边形面积的比值
centroids = []  # 重心坐标

for geom in geometry_data:
    polygon = shape(geom)
    
    # 计算面积
    areas.append(polygon.area)
    
    # 计算周长
    perimeters.append(polygon.length)
    
    # 计算形状复杂度（周长/面积）
    if polygon.area > 0:
        compactness_ratios.append(polygon.length / polygon.area)
    else:
        compactness_ratios.append(0)
    
    # 计算凸包与原始面积比值
    convex_hull = polygon.convex_hull
    if convex_hull.area > 0:
        convexity_ratios.append(polygon.area / convex_hull.area)
    else:
        convexity_ratios.append(0)
    
    # 计算重心坐标
    centroids.append(polygon.centroid.coords[0])

# 将形状特征添加到数据中
df_properties['area'] = areas
df_properties['perimeter'] = perimeters
df_properties['compactness_ratio'] = compactness_ratios
df_properties['convexity_ratio'] = convexity_ratios
df_properties['centroid_x'] = [centroid[0] for centroid in centroids]
df_properties['centroid_y'] = [centroid[1] for centroid in centroids]

# 合并 properties 数据
df = pd.concat([df_properties], axis=1)

# 准备特征和目标
X = df.drop(columns=['id', 'building_archetype'])
y = df['building_archetype']

# 处理每一列
for column in X.select_dtypes(include=['object']).columns:
    if not isinstance(X[column].iloc[0], list):
        X[column] = X[column].astype('category')

# 数据拆分
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 初始化并训练模型
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 评估模型
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(classification_report(y_test, y_pred))

# 如果模型准确率大于70%，进行预测并保存结果
if accuracy >= 0.7:
    # 读取新数据并进行相同的处理
    with open('unknow_archetype_ml.geojson', 'r') as f:
        new_data = json.load(f)

    df_properties_new = pd.json_normalize([feature['properties'] for feature in new_data['features']])

    # 提取新数据的geometry并计算形状特征
    geometry_data_new = [feature['geometry'] for feature in new_data['features']]
    areas_new = []
    perimeters_new = []
    compactness_ratios_new = []
    convexity_ratios_new = []
    centroids_new = []

    for geom in geometry_data_new:
        polygon = shape(geom)
        
        # 计算面积
        areas_new.append(polygon.area)
        
        # 计算周长
        perimeters_new.append(polygon.length)
        
        # 计算形状复杂度（周长/面积）
        if polygon.area > 0:
            compactness_ratios_new.append(polygon.length / polygon.area)
        else:
            compactness_ratios_new.append(0)
        
        # 计算凸包与原始面积比值
        convex_hull = polygon.convex_hull
        if convex_hull.area > 0:
            convexity_ratios_new.append(polygon.area / convex_hull.area)
        else:
            convexity_ratios_new.append(0)
        
        # 计算重心坐标
        centroids_new.append(polygon.centroid.coords[0])

    # 将形状特征添加到新数据
    df_properties_new['area'] = areas_new
    df_properties_new['perimeter'] = perimeters_new
    df_properties_new['compactness_ratio'] = compactness_ratios_new
    df_properties_new['convexity_ratio'] = convexity_ratios_new
    df_properties_new['centroid_x'] = [centroid[0] for centroid in centroids_new]
    df_properties_new['centroid_y'] = [centroid[1] for centroid in centroids_new]

    X_new = df_properties_new.drop(columns=['id'])

    # 转换类别列并填充缺失列
    for column in X_new.select_dtypes(include=['object']).columns:
        if not isinstance(X_new[column].iloc[0], list):
            X_new[column] = X_new[column].astype('category')

    X_new = X_new.reindex(columns=X.columns, fill_value=0)

    # 对新数据进行预测
    predictions = model.predict(X_new)

    # 将预测结果添加到新数据中
    for i, feature in enumerate(new_data['features']):
        feature['properties']['building_archetype'] = predictions[i]

    # 统计各个building_archetype的个数和百分比
    archetype_counts = pd.Series(predictions).value_counts()
    total_count = len(predictions)
    archetype_percentages = archetype_counts / total_count * 100

    # 打印各个building_archetype的个数和百分比
    print("\nBuilding Archetype Distribution:")
    for archetype, count in archetype_counts.items():
        percentage = archetype_percentages[archetype]
        print(f"{archetype}: {count} ({percentage:.2f}%)")

    # 保存修改后的结果为新文件（带有头部和尾部）
    output_file = 'fixed_unknow_archetype_ml.geojson'
    with open(output_file, "w", encoding="utf-8") as f:
        # 写入头部
        f.write("{\n")
        f.write('  "type": "FeatureCollection",\n')
        f.write('  "generator": "overpass-turbo",\n')
        f.write('  "source": "OpenStreetMap",\n')
        f.write('  "features": [\n')
        
        # 逐个保存建筑物数据，确保逗号分隔
        for i, feature in enumerate(new_data["features"]):
            json.dump(feature, f, ensure_ascii=False)
            if i < len(new_data["features"]) - 1:  # 如果不是最后一条数据
                f.write(",\n")
            else:  # 如果是最后一条数据，不加逗号
                f.write("\n")
        
        # 写入尾部
        f.write("  ]\n")
        f.write("}\n")

    print(f"Results saved to '{output_file}'.")
else:
    print("Model accuracy is below 70%. No results saved.")
