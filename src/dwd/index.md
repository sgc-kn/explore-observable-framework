---
sql:
  long_ma30y: ./data/long_ma30y.parquet
  kl_data: ./data/kl_data.parquet
  kl_meta_parameter: ./data/kl_meta_parameter.parquet
  klindex_data: ./data/klindex_data.parquet
  klindex_meta_parameter: ./data/klindex_meta_parameter.parquet
---

# Dashboard: DWD Wetterbeobachtungen

```sql id=temp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_TT', 'JA_TN', 'JA_TX')
order by year asc, variable asc
```

```js
const variable_labels = {
  "JA_MX_TN": "Absolutes Minimum",
  "JA_MX_TX": "Absolutes Maximum",
  "JA_TN": "Jahresmittel aus Tagesminimum",
  "JA_TT": "Jahresmittel aus Tagesdurchschnitt",
  "JA_TX": "Jahresmittel aus Tagesmaximum",
};

function label_variable(variable) {
  return variable_labels[variable]
};
```

<div class="card">
  <h2>Temperatur der Luft</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      color: {
        domain: ["JA_TN", "JA_TT", "JA_TX"],
        legend: true,
        tickFormat: label_variable,
      },
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: '°C', labelArrow: 'none'}),
        Plot.dot(temp, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(temp, {
          x: "year",
          y: "ma30y",
          stroke: "variable",
        }),
      ]
    }))}
</div>

```sql id=maxtemp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TX')
order by year asc, variable asc
```

<div class="card">
  <h2>Temperatur der Luft</h2>
  <h3>Absolutes Maximum mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: '°C', labelArrow: 'none'}),
        Plot.dot(maxtemp, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(maxtemp, {
          x: "year",
          y: "ma30y",
          stroke: "variable",
        }),
      ]
    }))}
</div>

```sql id=mintemp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TN')
order by year asc, variable asc
```

<div class="card">
  <h2>Temperatur der Luft</h2>
  <h3>Absolutes Minimum mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: '°C', labelArrow: 'none'}),
        Plot.dot(mintemp, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(mintemp, {
          x: "year",
          y: "ma30y",
          stroke: "variable",
        }),
      ]
    }))}
</div>

```sql id=sun
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_SD_S')
order by year asc, variable asc
```

<div class="card">
  <h2>Sonnenstunden</h2>
  <h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null}),
        Plot.dot(sun, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(sun, {
          x: "year",
          y: "ma30y",
          stroke: "variable",
        }),
      ]
    }))}
</div>

```sql id=rain
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_RR')
order by year asc, variable asc
```

<div class="card">
  <h2>Niederschlag</h2>
  <h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: 'Millimeter', labelArrow: 'none'}),
        Plot.dot(rain, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(rain, {
          x: "year",
          y: "ma30y",
          stroke: "variable"},
        ),
      ]
    }))}
</div>

```sql id=maxrain
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_RS')
order by year asc, variable asc
```

<div class="card">
  <h2>Niederschlag</h2>
  <h3>Jahresmaximum mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: 'Millimeter', labelArrow: 'none'}),
        Plot.dot(maxrain, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(maxrain, {
          x: "year",
          y: "ma30y",
          stroke: "variable"},
        ),
      ]
    }))}
</div>

---

# Variablen

```sql id=kl_meta display
select distinct
  Parameter as variable,
  Parameterbeschreibung as label,
  Einheit as unit,
  'kl' as tab,
from kl_meta_parameter
union
select distinct
  Parameter as variable,
  Parameterbeschreibung as label,
  Einheit as unit,
  'klindex' as tab,
from klindex_meta_parameter
```

---

# Notizen

- Inspiration: https://klimadashboard.de/auswirkungen/temperatur
- Datenquelle: https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/annual/climate_indices/kl/
- Code (WIP): https://github.com/sgc-kn/explore-observable-framework/pull/9
