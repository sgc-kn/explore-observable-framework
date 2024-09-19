---
sql:
  data: ./data/data.parquet
  meta_parameter: ./data/meta_parameter.parquet
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

```sql id=data display
select * from data;
```

```sql id=meta_parameter display
select * from meta_parameter;
```

---

## Plot

Plotting works like before:

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(data, {x: "MESS_DATUM_BEGINN", y: "JA_FROSTTAGE"})
  ]
})
```

```js
Plot.plot({
  style: "overflow: visible;",
  marks: [
    Plot.line(data, {x: "MESS_DATUM_BEGINN", y: "JA_TROPENNAECHTE"})
  ]
})
```
