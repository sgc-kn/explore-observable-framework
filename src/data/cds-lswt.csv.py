import pandas as pd
import sys

src = "https://github.com/sgc-kn/cds-examples/raw/main/"
src += "satellite-lake-water-temperature.csv"
df = pd.read_csv(src, sep=',', encoding='utf8')
df = df[df.lakeid_CCI == 352] # Bodensee
df = df.assign(
        time = pd.to_datetime(df.time),
        temperature = df.lake_surface_water_temperature - 273.15,
        uncertainty = df.lswt_uncertainty,
        )
df = df[['time', 'temperature', 'uncertainty']]
df = df.resample('W-Mon', on='time').mean().reset_index()
df = df[~df.temperature.isna()]
df.to_csv(sys.stdout, index=False, sep=',', encoding='utf8')
