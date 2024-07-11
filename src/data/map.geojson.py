import json

with open('raw_data/Kleinräumige_Gliederung_-3000388873533769374.geojson', 'r', encoding='utf-8') as file:
    geojson_data = json.load(file)

print(json.dumps(geojson_data, indent=2, ensure_ascii=False))