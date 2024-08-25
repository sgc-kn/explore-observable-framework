---
theme: dashboard
title: Einwohner
toc: false
---

```js
const stadtteile_geojson = FileAttachment("data/stadtteile.geo.json").json();
const einwohner_csv = FileAttachment("data/stt_ew.csv").csv({typed: true});
const einwohner_famStd_csv = FileAttachment("data/stt_ew_fam.csv").csv({typed: true});
const einwohner_staatsangehoerigkeit_csv = FileAttachment("data/stt_ew_nat.csv").csv({typed: true});
const stt_ew_alt_csv = FileAttachment("data/stt_ew_alt.csv").csv({typed: true});
const svgLink = FileAttachment("icons/icons8-externer-link.svg").url();
```

```js
html`<style>
@media (min-width: 600px) {
  h2, h3 {max-width: 100% !important;}
  .card * {font-size: 15px !important;}
  .card h2, .card h2 * {font-size: 21px !important;} .card h2 {font-weight: 600;}  
  .card h3, .card .teil_name {font-size: 19px !important;} .card .teil_name {color: #3b5fc0;}
  .card table td, .card table td * {font-size: 17px !important;}
  .card label {font-size: 17px !important;}
  .inputs-3a86ea {--label-width: 140px;}
}
.align-right {text-align: right;}
</style>`
```
# EinwohnerInnen in Konstanz

<h2>EinwohnerInnen: Wohnbevölkerung (EinwohnerInnen mit Hauptwohnsitz am 31.12. des Jahres). Datenquelle ist die eigene Einwohnerfortschreibung auf Basis des städtischen Melderegisters. <br>
Haushalte: Basis Wohnbevölkerung insgesamt. Haushalte ermittelt über Haushaltegenerierung mit dem Programm HHGen.</h2>
<div>
  <a href="https://offenedaten-konstanz.de/search/taxonomy/term/42/field_tags/Bev%C3%B6lkerung-42">Datenquelle<img src="icons/icons8-externer-link.svg" alt="link" width="16" height="16">
  </a>
</div>

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
  //(stadtteil_check) ? stadtteile_geojson.features : [ 'Gesamte Stadt' ], //Patrick's code
  (stadtteil_check) 
    ? stadtteile_geojson.features.sort((a, b) => a.properties.STT_NAME.localeCompare(b.properties.STT_NAME))
    : ['Gesamte Stadt'], //sort by STT_NAME
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
    `${stadtteil_select.properties.STT_NAME}` :
    stadtteil_select;
```
```js
const toggled = Inputs.toggle({label: "Binary", values: [1, 0]})
```
```js
import { map_plot } from "./components/einwohner_map.js";
import { entwicklung_plot } from "./components/einwohner_entwicklung.js";
import { familienstand_plot } from "./components/einwohner_familienstand.js";
import { staatsangehoerigkeit_plot } from "./components/einwohner_staatsangehoerigkeit.js";
import { Table, Card } from "./components/einwohner_table.js";
import { absolut_plot } from "./components/einwohner_entwicklung_abs.js";
import { relativ_plot } from "./components/einwohner_entwicklung_rel.js";
import { altersgruppen_abs_plot } from "./components/einwohner_altersgruppen_abs.js";
import { einwohner_altersgruppen_erwerbsfähige_abs_plot } from "./components/einwohner_altersgruppen_erwerbsfahige_abs.js";
```

```js
const maxYear = Math.max(...einwohner_csv.map((x) => x.Jahr));
```

```jsx
const table = document.createElement("div");
const root = ReactDOM.createRoot(table);
root.render(<Table einwohner_csv={einwohner_csv} einwohner_famStd_csv={einwohner_famStd_csv}    einwohner_staatsangehoerigkeit_csv={einwohner_staatsangehoerigkeit_csv} stt_ew_alt_csv={stt_ew_alt_csv} id={id} width={width} svgLink={svgLink} />);
```
<div class="card">
  <h2>Stadtteile der Stadt Konstanz</h2>
  <h3>Um Detailergebnisse für einzelne Stadtteile zu erhalten, aktivieren Sie bitte die Filterfunktion („Filter aktivieren“). Im darunterliegenden Menü können Sie dann die einzelnen Stadtteile auswählen. Die nachfolgenden Ergebnisse werden dann auf die Stadtteile angepasst.</h3>
  ${stadtteil_check_input}
  ${stadtteil_select_input}
  ${resize((width) => map_plot(stadtteile_geojson, id, width))}
</div>

<div>
${table}
</div>


<div class="card">
  <h2>Einwohnerentwicklung</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${resize((width) => absolut_plot(einwohner_csv, id, width))}
</div>

```js
const compare_select_input = Inputs.select(
  stadtteile_geojson.features.sort((a, b) => a.properties.STT_NAME.localeCompare(b.properties.STT_NAME)),
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

```js
const toggled_plots_famStand = Inputs.toggle({label: "Absolute Werte:", values: [1, 0]});
const toggled_value_famStand = Generators.input(toggled_plots_famStand);

const toggled_plots_sttatAK = Inputs.toggle({label: "Absolute Werte:", values: [1, 0]});
const toggled_value_sttatAK = Generators.input(toggled_plots_sttatAK);

const toggled_plots_alt = Inputs.toggle({label: "Absolute Werte:", values: [1, 0]});
const toggled_value_alt = Generators.input(toggled_plots_alt);

const toggled_plots_erwfk = Inputs.toggle({label: "Absolute Werte:", values: [1, 0]});
const toggled_value_erwfk = Generators.input(toggled_plots_erwfk);
```

<div class="card">
  <h2>Jährliche Einwohnerentwicklung im Vergleich</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${compare_select_input}
  ${resize((width) => relativ_plot(einwohner_csv, id, compare_id, width))}
</div>

<div class="card">
  <h2>Familienstand (Wohnbevölkerung 18 Jahre und älter)</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${toggled_plots_famStand}
  ${resize((width) => familienstand_plot(einwohner_famStd_csv, id, width, toggled_value_famStand))}
</div>

<div class="card">
  <h2>Staatsangehörigkeit</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${toggled_plots_sttatAK}
  ${resize((width) => staatsangehoerigkeit_plot(einwohner_staatsangehoerigkeit_csv, id, width,toggled_value_sttatAK))}
</div>

<div class="card">
  <h2>Altersstruktur der EinwohnerInnen</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${toggled_plots_alt}
  ${resize((width) => altersgruppen_abs_plot(stt_ew_alt_csv, id, width, toggled_value_alt))}
</div>

<div class="card">
  <h2>Erwerbsfähige (15 bis unter 65 jährige EinwohnerInnen)</h2>
  <h3><span class="teil_name">${stt}</span></h3>
  ${toggled_plots_erwfk}
  ${resize((width) => einwohner_altersgruppen_erwerbsfähige_abs_plot(stt_ew_alt_csv, id, width, toggled_value_erwfk))}
</div>
