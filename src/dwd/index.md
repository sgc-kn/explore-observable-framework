---
theme: dashboard
sql:
  long_ma30y: ./data/long_ma30y.parquet
  kl_meta_geo: ./data/kl_meta_geo.parquet
---

# Wetterbeobachtungen

## des Deutschen Wetterdienstes in Konstanz

```sql id=kl_geo
with typed as(
  select
    (Von_Datum::date)::text as von,
    (Bis_Datum::date)::text as bis,
    "Geogr.Breite" as lat,
    "Geogr.Laenge" as lon,
    Stationshoehe as altitude,
  from kl_meta_geo)
select
  min(von) as von,
  max(bis) as bis,
  lat,
  lon,
from typed
group by lat, lon
order by von asc
```

<div class="card">
  <h2>Messstation Konstanz</h2>
  <h3>Position der Station im Laufe der Zeit</h3>

```js
const map_div = display(document.createElement("div"));
map_div.style = "height: 400px;";
```

</div>

```js
const map = L.map(map_div, {
  scrollWheelZoom: false,
  dragging: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  zoomControl: false,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> & OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

function label(row) {
  const opt = {day: 'numeric', month: 'short', year: 'numeric'};
  const von = (new Date(row['von'])).toLocaleDateString(undefined, opt);
  if (row['bis']) {
    const bis = (new Date(row['bis'])).toLocaleDateString(undefined, opt);
    return `${von} – ${bis}`
  } else {
    return `seit ${von}`
  }
}

const points_to_fit = []

kl_geo.toArray().forEach(row => {
  const pos = [row['lat'], row['lon']];
  points_to_fit.push(pos)
  L.circleMarker(pos, {radius: 5, color: 'var(--theme-foreground-focus)'})
   .addTo(map)
   .bindTooltip(label(row), {permanent: true})
   .openTooltip()
});

map.fitBounds(points_to_fit, {padding: [10, 10]});
```

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
const temp_variables = {
  "JA_MX_TN": "Absolutes Minimum",
  "JA_MX_TX": "Absolutes Maximum",
  "JA_TN": "Jahresmittel aus Tagesminimum",
  "JA_TT": "Jahresmittel aus Tagesdurchschnitt",
  "JA_TX": "Jahresmittel aus Tagesmaximum",
};

function label_temp(variable) {
  return temp_variables[variable]
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
        tickFormat: label_temp,
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

```sql id=klindex
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_EISTAGE', 'JA_FROSTTAGE', 'JA_HEISSE_TAGE',
                   'JA_SOMMERTAGE', 'JA_TROPENNAECHTE')
order by year asc, variable asc
```

```js
const klindex_variables = {
  "JA_EISTAGE": "Eistage (Maximum unter 0°C)",
  "JA_FROSTTAGE": "Frosttage (Minimum unter 0°C)",
  "JA_HEISSE_TAGE": "Heiße Tage (Maximum über 30°C)",
  "JA_SOMMERTAGE": "Sommertage (Maximum über 25°C)",
  "JA_TROPENNAECHTE": "Tropennächte (Minimum über 20°C)",
};

function label_klindex(variable) {
  if (variable in klindex_variables) {
    return klindex_variables[variable]
  } else {
    return variable
  }
};
```

<div class="card">
  <h2>Klimakenntage</h2>
  <h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      color: {
        domain: ["JA_EISTAGE", "JA_FROSTTAGE"],
        legend: true,
        tickFormat: label_klindex,
      },
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null, labelArrow: 'none'}),
        Plot.dot(klindex, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(klindex, {
          x: "year",
          y: "ma30y",
          stroke: "variable"},
        ),
      ]
    }))}
</div>

<div class="card">
  <h2>Klimakenntage</h2>
  <h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      color: {
        domain: ["JA_SOMMERTAGE", "JA_HEISSE_TAGE", "JA_TROPENNAECHTE"],
        legend: true,
        tickFormat: label_klindex,
      },
      marks: [
        Plot.frame(),
        Plot.axisX({label: 'Jahr', labelAnchor: 'center', labelArrow: 'none'}),
        Plot.axisY({label: null, labelArrow: 'none'}),
        Plot.dot(klindex, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(klindex, {
          x: "year",
          y: "ma30y",
          stroke: "variable"},
        ),
      ]
    }))}
</div>
