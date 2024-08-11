---
theme: dashboard
title: Einwohner
toc: false
---

```js
const stadtteile_geojson = FileAttachment("data/stadtteile.geo.json").json();
const einwohner_csv = FileAttachment("data/einwohner.csv").csv({typed: true});
const einwohner_famStd_csv = FileAttachment("data/familienstand.csv").csv({typed: true});
const einwohner_staatsangehörigkeit_csv = FileAttachment("data/nichtdeutsch.csv").csv({typed: true});
```

```js
einwohner_csv
```
# Einwohner in Konstanz

<h2></h2>

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

```js
/*
const groupedData = d3.group(einwohner_csv, d => d.STT);

const checkboxEntries = Array.from(groupedData.entries()).map(([key, values]) => ({
  key: key,
  values: values
}));
console.log('checkboxEntries', checkboxEntries)

const  select_ort = Inputs.select(
  checkboxEntries,
  {
    label: "Выберите город",
    format: x => x.key
  }
);
select_ort.addEventListener("input", (event) => {
    const selectedCity = select_ort.values;
    console.log('selectedCity', selectedCity)
    //const selectedID = selectedCity[0].STT_ID;
    //selectedCityID.next(selectedID);
});
*/

const groupedData = d3.group(einwohner_csv, d => d.STT);

//default value "Gesamtstadt"
/*
const sortedData = Array.from(groupedData).sort((a, b) => {
  if (a[0] === "Gesamtstadt") return -1;
    if (b[0] === "Gesamtstadt") return 1;
    return a[0].localeCompare(b[0]);
});
*/
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

```js
import { map_plot } from "./components/einwohner_map.js";
import { entwicklung_plot } from "./components/einwohner_entwicklung.js";
import { familienstand_plot } from "./components/einwohner_familienstand.js";
import { staatsangehörigkeit_plot } from "./components/einwohner_staatsangehörigkeit.js";
import { Table, Card } from "./components/einwohner_table.js";
import { absolut_plot } from "./components/einwohner_entwicklung_abs.js";
import { relativ_plot } from "./components/einwohner_entwicklung_rel.js";
```
```js
const maxYear = Math.max(...einwohner_csv.map((x) => x.Jahr));
```
```jsx
//display(<Table einwohner_csv={einwohner_csv} einwohner_famStd_csv={einwohner_famStd_csv}    einwohner_staatsangehörigkeit_csv={einwohner_staatsangehörigkeit_csv} id={id} width={width} />)

const table = document.createElement("SPAN");
const root = ReactDOM.createRoot(table);
root.render(<Table einwohner_csv={einwohner_csv} einwohner_famStd_csv={einwohner_famStd_csv}    einwohner_staatsangehörigkeit_csv={einwohner_staatsangehörigkeit_csv} id={id} width={width} />);
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

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Einwohnerentwicklung</h2>
    <h3>${stt}</h3>
    ${resize((width) => entwicklung_plot(einwohner_csv, id, width))}
  </div>
  <div class="card">
    <h2>Bevölkerungsentwicklung in den Stadtteile ab 2010 (absolute)</h2>
    <h3>${stt}</h3>    
    ${resize((width) => absolut_plot(einwohner_csv, id, width))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Bevölkerungsentwicklung in den Stadtteile ab 2010 (relative)</h2>
    <h3>${stt}</h3>    
    ${resize((width) => relativ_plot(einwohner_csv, select_ort, id, width))}
  </div>  
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Familienstand</h2>
    <h3>${stt}</h3>
    ${resize((width) => familienstand_plot(einwohner_famStd_csv, id, width))}
  </div>
  <div class="card">
    <h2>Staatsangehörigkeit</h2>
    <h3>${stt}</h3>
    ${resize((width) => staatsangehörigkeit_plot(einwohner_staatsangehörigkeit_csv, id, width))}
  </div>
</div>

