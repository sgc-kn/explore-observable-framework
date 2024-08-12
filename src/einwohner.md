---
theme: dashboard
title: Einwohner
toc: false
---

```js
const stadtteile_geojson = FileAttachment("data/stadtteile.geo.json").json();
const einwohner_csv = FileAttachment("data/einwohner.csv").csv({typed: true});
const einwohner_famStd_csv = FileAttachment("data/familienstand.csv").csv({typed: true});
const einwohner_staatsangehoerigkeit_csv = FileAttachment("data/nichtdeutsch.csv").csv({typed: true});
```

# Einwohner in Konstanz

<h2></h2>

<!-- Global Stadtteil Selection: affect all plots on this dashboard -->

```js
const stadtteil_check_input = Inputs.toggle({
  label: "Filter aktivieren",
  value: false,
});
const stadtteil_check = Generators.input(stadtteil_check_input);
```

```js
const stadtteil_select_input = Inputs.select(
  (stadtteil_check) ? stadtteile_geojson.features : [ 'Gesamte Stadt' ],
  {
    label: "Stadtteil:",
    format: (x) => (stadtteil_check) ? x.properties.STT_NAME : x,
    disabled: !stadtteil_check,
  }
);
const stadtteil_select = Generators.input(stadtteil_select_input);
```

```js
const id = stadtteil_check ?
    stadtteil_select.properties.STT_ID : 0 ;
const stt = stadtteil_check ?
    `Stadtteil ${stadtteil_select.properties.STT_NAME}` :
    stadtteil_select;
```

<!-- Iryna's second select button
```js
const groupedData = d3.group(einwohner_csv, d => d.STT);
//default value "Gesamtstadt"

// removed element with key "Gesamtstadt" and sorted alphabetically
const sortedData = Array.from(groupedData)
  .filter(([key, values]) => key !== "Gesamtstadt")
  .sort((a, b) => a[0].localeCompare(b[0]));

const combinedData = sortedData.flatMap(item => item[1]);
const groupedCombinedData = d3.group(combinedData, d => d.STT);

const select_ort = view(
  Inputs.select(
    groupedCombinedData,
    {label: html`<div class="st-title">Stadtteile:</div>`, unique: true}
  )
);
```
-->

```js
import { map_plot } from "./components/einwohner_map.js";
import { entwicklung_plot } from "./components/einwohner_entwicklung.js";
import { familienstand_plot } from "./components/einwohner_familienstand.js";
import { staatsangehoerigkeit_plot } from "./components/einwohner_staatsangehoerigkeit.js";
import { Table, Card } from "./components/einwohner_table.js";
import { absolut_plot } from "./components/einwohner_entwicklung_abs.js";
import { relativ_plot } from "./components/einwohner_entwicklung_rel.js";
```

```js
const maxYear = Math.max(...einwohner_csv.map((x) => x.Jahr));
```

```jsx
//display(<Table einwohner_csv={einwohner_csv} einwohner_famStd_csv={einwohner_famStd_csv}    einwohner_staatsangehoerigkeit_csv={einwohner_staatsangehoerigkeit_csv} id={id} width={width} />)

const table = document.createElement("SPAN");
const root = ReactDOM.createRoot(table);
root.render(<Table einwohner_csv={einwohner_csv} einwohner_famStd_csv={einwohner_famStd_csv}    einwohner_staatsangehoerigkeit_csv={einwohner_staatsangehoerigkeit_csv} id={id} width={width} />);
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Stadtteile</h2>
    <h3>Dieses Dashboard kann auf Stadtteile gefiltert werden.</h3>
    ${stadtteil_check_input}
    ${stadtteil_select_input}
    ${resize((width) => map_plot(stadtteile_geojson, id, width))}
  </div>

  <div class="card">
    <h2>Kennzahlen für das Jahr ${maxYear}</h2>
    <h3>${stt}</h3>
    <div>
      ${table}
    </div>
  </div>
</div>

<div class="card">
  <h2>Bevölkerungsentwicklung</h2>
  <h3>${stt}</h3>
  ${resize((width) => entwicklung_plot(einwohner_csv, id, width))}
</div>

<!--

This one is redundant with the one before, right? Which one do we
prefer for the final product?

<div class="card">
  <h2>Bevölkerungsentwicklung</h2>
  <h3>${stt}</h3>
  ${resize((width) => absolut_plot(einwohner_csv, id, width))}
</div>

-->

```js
const compare_select_input = Inputs.select(
  stadtteile_geojson.features,
  {
    label: "Vergleiche mit Stadtteil:",
    format: (x) => x.properties.STT_NAME,
  }
);
const compare_select = Generators.input(compare_select_input);
```

```js
const compare_id = compare_select.properties.STT_ID;
```

<div class="card">
  <h2>Bevölkerungsentwicklung im Vergleich</h2>
  <h3>${stt}</h3>
  ${compare_select_input}
  ${resize((width) => relativ_plot(einwohner_csv, id, compare_id, width))}
</div>

<div class="card">
  <h2>Familienstand</h2>
  <h3>${stt}</h3>
  ${resize((width) => familienstand_plot(einwohner_famStd_csv, id, width))}
</div>

<div class="card">
  <h2>Staatsangehörigkeit</h2>
  <h3>${stt}</h3>
  ${resize((width) => staatsangehoerigkeit_plot(einwohner_staatsangehoerigkeit_csv, id, width))}
</div>
