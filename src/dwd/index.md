---
sql:
  kl_data: ./data/kl_data.parquet
  kl_meta_parameter: ./data/kl_meta_parameter.parquet
  klindex_data: ./data/klindex_data.parquet
  klindex_meta_parameter: ./data/klindex_meta_parameter.parquet
---

# Dashboard: DWD Wetterbeobachtungen

```sql id=ja_tt
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_TT as double) as JA_TT,
from kl_data
where
  JA_TT != -999
```

```sql id=ja_tt_ma
select
    MESS_DATUM_BEGINN,
    cast(JA_TT as double) as JA_TT,
    AVG(JA_TT::double) OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS JA_TT_MA,
    row_number() OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
    ) AS JA_TT_MA_N,
from kl_data
where
  JA_TT != -999
qualify
  JA_TT_MA_N >= 30
```

<div class="card">
  <h2>Temperatur</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt (°C)</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(ja_tt, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TT",
          stroke: "currentColor",
        }),
        Plot.line(ja_tt_ma, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TT_MA",
          stroke: "var(--theme-foreground-focus)"},
        ),
      ]
    }))}
</div>

```sql id=ja_tn
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_TN as double) as JA_TN,
from kl_data
where
  JA_TN != -999
```

```sql id=ja_tn_ma
select
    MESS_DATUM_BEGINN,
    cast(JA_TN as double) as JA_TN,
    AVG(JA_TN::double) OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS JA_TN_MA,
    row_number() OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
    ) AS JA_TN_MA_N,
from kl_data
where
  JA_TN != -999
qualify
  JA_TN_MA_N >= 30
```

<div class="card">
  <h2>Temperatur (Tagesmininum)</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt (°C)</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(ja_tn, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TN",
          stroke: "currentColor",
        }),
        Plot.line(ja_tn_ma, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TN_MA",
          stroke: "var(--theme-foreground-focus)"},
        ),
      ]
    }))}
</div>

```sql id=js_tx
select
  cast(STATIONS_ID as integer) as STATIONS_ID,
  MESS_DATUM_BEGINN,
  MESS_DATUM_ENDE,
  cast(JA_TX as double) as JA_TX,
from kl_data
where
  JA_TX != -999
```

```sql id=js_tx_ma
select
    MESS_DATUM_BEGINN,
    cast(JA_TX as double) as JA_TX,
    AVG(JA_TX::double) OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS JA_TX_MA,
    row_number() OVER (
        PARTITION BY STATIONS_ID
        ORDER BY MESS_DATUM_BEGINN
    ) AS JA_TX_MA_N,
from kl_data
where
  JA_TX != -999
qualify
  JA_TX_MA_N >= 30
```

<div class="card">
  <h2>Temperatur (Tagesmaximum)</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt (°C)</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(js_tx, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TX",
          stroke: "currentColor",
        }),
        Plot.line(js_tx_ma, {
          x: "MESS_DATUM_BEGINN",
          y: "JA_TX_MA",
          stroke: "var(--theme-foreground-focus)"},
        ),
      ]
    }))}
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
