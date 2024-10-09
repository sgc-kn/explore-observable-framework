---
sql:
  kl_data: ./data/kl_data.parquet
  kl_meta_parameter: ./data/kl_meta_parameter.parquet
  klindex_data: ./data/klindex_data.parquet
  klindex_meta_parameter: ./data/klindex_meta_parameter.parquet
---

# Klimadashboard

- Inspiration: https://klimadashboard.de/auswirkungen/temperatur
- Datenquelle: https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/annual/climate_indices/kl/
- Code (WIP): https://github.com/sgc-kn/explore-observable-framework/pull/9

---

## SQL

The script `data.zip.py` translates the DWD source zip file containing
multiple CSV files to a zip files holding parquet files. We can query
these parquet files with (DuckDB) SQL:

### KLINDEX data


```sql id=klindex display
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_EISTAGE as integer) as JA_EISTAGE,
  cast(JA_SOMMERTAGE as integer) as JA_SOMMERTAGE,
  cast(JA_HEISSE_TAGE as integer) as JA_HEISSE_TAGE,
  cast(JA_FROSTTAGE as integer) as JA_FROSTTAGE,
  cast(JA_TROPENNAECHTE as integer) as JA_TROPENNAECHTE,
from klindex_data;
```

```sql id=klindex_meta_parameter display
select
  cast(Stations_ID as integer) as Stations_ID,
  Von_Datum,
  Bis_Datum,
  Stationsname,
  Parameter,
  Parameterbeschreibung,
  Einheit,
from klindex_meta_parameter;
```

### KL data

```sql id=kl display
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_TX as double) as JA_TX,
from kl_data
where
  JA_TX != -999
```

```sql id=kl_meta_parameter display
select
  cast(Stations_ID as integer) as Stations_ID,
  Von_Datum,
  Bis_Datum,
  Stationsname,
  Parameter,
  Parameterbeschreibung,
  Einheit,
from kl_meta_parameter;
```

---

## Plot

Plotting works like before:

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(klindex, {x: "MESS_DATUM_BEGINN", y: "JA_FROSTTAGE"})
  ]
})
```

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(klindex, {x: "MESS_DATUM_BEGINN", y: "JA_TROPENNAECHTE"})
  ]
})
```

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(kl, {x: "MESS_DATUM_BEGINN", y: "JA_TX"})
  ]
})
```
