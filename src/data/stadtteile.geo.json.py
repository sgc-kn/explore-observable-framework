import geopandas as gpd
import pandas as pd
import sys
import tempfile

# Load STT_NAME from CSV
csv = pd.read_csv('raw_data/EW_STT_1995ff.csv', sep=';')
names = ( csv[['STT_ID', 'STT']]
         .drop_duplicates()
         .set_index('STT_ID')
         .rename(columns={ 'STT' : 'STT_NAME'})
         )

# Extend geojson with STT_NAME from CSV
geo = ( gpd
       .read_file('raw_data/stadtteile.geo.json')
       .drop(columns=['STT_NAME', 'STT_NR'])
       .rename(columns={ 'STT' : 'STT_ID'})
       .join(names, on='STT_ID')
       )

# Compress geojson / lower detail
geo.geometry = geo.geometry.simplify(0.0001)

print(geo.to_json())
