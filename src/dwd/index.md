---
sql:
  kl_data: ./data/kl_data.parquet
  kl_meta_parameter: ./data/kl_meta_parameter.parquet
  klindex_data: ./data/klindex_data.parquet
  klindex_meta_parameter: ./data/klindex_meta_parameter.parquet
---

# Dashboard: DWD Wetterbeobachtungen

```sql id=kl_long
with long as(
  select
    cast(STATIONS_ID as integer) as station,
    MESS_DATUM_BEGINN as year,
    variable,
    cast(value as double) as value,
  from kl_data
  unpivot (
    value for variable in (JA_TT, JA_TX, JA_TN)
  )
  where value != -999
),
ma as (
  select
      station,
      year,
      variable,
      AVG(value::double) OVER (
          PARTITION BY station, variable
          ORDER BY year
          ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
      ) AS value_ma,
      row_number() OVER (
          PARTITION BY station, variable
          ORDER BY year
      ) AS n,
  from long
  qualify n >= 30
)
select long.station, long.year, long.variable, long.value, ma.value_ma
from long
left join ma
on long.station = ma.station and long.variable = ma.variable and long.year = ma.year
```

<div class="card">
  <h2>Temperatur</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt (°C)</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      color: { legend: true },
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(kl_long, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(kl_long, {
          x: "year",
          y: "value_ma",
          stroke: "variable",
          filter: (d) => d.value_ma != null
        }),
      ]
    }))}
  TODO: bessere Labels auf der Legende

  TODO: Y-Achse zuschneiden?
</div>


```sql id=ja_sd_s
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_SD_S as double) as JA_SD_S,
from kl_data
where JA_SD_S != -999
```

```sql id=ja_sd_s_ma
select
    MESS_DATUM_BEGINN,
    AVG(JA_SD_S::double) OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS JA_SD_S_MA,
    row_number() OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
    ) AS N,
from kl_data
where JA_SD_S != -999
qualify N >= 30
```

<div class="card">
  <h2>Sonnenstunden</h2>
  <h3>Jahressummen mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(ja_sd_s, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_SD_S",
          stroke: "currentColor",
        }),
        Plot.line(ja_sd_s_ma, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_SD_S_MA",
          stroke: "var(--theme-foreground-focus)"},
        ),
      ]
    }))}
</div>

```sql id=ja_rr
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_RR as double) as JA_RR,
from kl_data
```

```sql id=ja_rr_ma
select
    MESS_DATUM_BEGINN,
    AVG(JA_RR::double) OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS JA_RR_MA,
    row_number() OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
    ) AS N,
from kl_data
where JA_RR != -999
qualify N >= 30
```

<div class="card">
  <h2>Niederschlag</h2>
  <h3>Jahressummen mit 30-jährigem gleitendem Durchschnitt (mm)</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(ja_rr, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_RR",
          stroke: "currentColor",
        }),
        Plot.line(ja_rr_ma, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_RR_MA",
          stroke: "var(--theme-foreground-focus)"},
        ),
      ]
    }))}
</div>

---

# Tabellen

```sql id=klindex_data
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

# Notizen

- Inspiration: https://klimadashboard.de/auswirkungen/temperatur
- Datenquelle: https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/annual/climate_indices/kl/
- Code (WIP): https://github.com/sgc-kn/explore-observable-framework/pull/9
